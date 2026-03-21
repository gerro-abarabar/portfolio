function postPost(
    title,
    content,
    site_key,
    thumbnail_image
    ){
    owner_token = new URLSearchParams(window.location.search).get("admin");
    formData=new FormData();    
    formData.append("title", title);
    formData.append("content", content);
    formData.append("site_key", site_key);
    formData.append("thumbnail_image", thumbnail_image);
    formData.append("owner_token", owner_token);
    return fetch("/api/blog/post", {
        method: "POST",
        body: formData,
    }).then((response) => response.json())
    .then((data) => {
        console.log("Post status:", data.success);
        return data;
    });
}