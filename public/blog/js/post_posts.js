function postPost(
    title,
    content,
    site_key,
    thumbnail_image
    ){
    owner_token = new URLSearchParams(window.location.search).get("admin");
    return fetch("/api/blog/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            content,
            site_key,
            thumbnail_image,
            owner_token
        }),
    }).then((response) => response.json())
    .then((data) => {
        console.log("Post status:", data.success);
        return data;
    });
}