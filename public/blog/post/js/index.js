// TODO: add an edit capability for the owner

const md = window.markdownit();

function getPost(id){
    return fetch("/api/blog/get_post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id
        }),
    }).then((response) => response.json())
    .then((data) => {
        console.log("Post status:", data.success);
        return data;
    });
}

getPost(new window.URLSearchParams(window.location.search).get("id")).then(res => res[0]).then(res =>    {
    console.log(res);
    document.getElementById("title").innerHTML = res.title;
    document.getElementById("content").innerHTML = md.render(res.content);
})