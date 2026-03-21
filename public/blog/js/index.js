// Main script file

const md = window.markdownit({ 
    breaks: true,
    linkify: true,
    html: true
 });

isAdmin().then(res => {
    console.log("Is admin:", res);
    if (res){
        document.getElementById("add-posts").classList.remove("hidden");
        console.log("confirmed admin");
    } else{
        console.log("not admin");
    }
    const admin=res;
});



function createPostElement(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = `/blog/post/?id=${post.id}`;
    link.target="_blank"
    link.textContent = post.title;
    title.appendChild(link);
    postElement.appendChild(title);

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = post.thumbnail_image;
    thumbnail.alt = "Thumbnail";
    postElement.appendChild(thumbnail);

    const content = document.createElement("p");
    content.innerHTML = md.render(post.content.slice(0, 200) + (post.content.length > 200 ? "..." : ""), { breaks: true, allowedTags: ['u', '*'] });
    postElement.appendChild(content);

    

    

    return postElement;
}

function displayPosts(posts) {
    recent_posts.innerHTML = "<h2>Recent posts:</h2><hr>"; // Clear existing posts
    posts.forEach((post) => {
        const postElement = createPostElement(post);
        recent_posts.appendChild(postElement);
        recent_posts.appendChild(document.createElement("hr"));
    });
}

// Fetch and display the latest 5 posts on page load
document.addEventListener("DOMContentLoaded", () => {
    getPosts(5).then(displayPosts);
    recent_posts = document.getElementById("recent-posts");
    document.getElementById("post-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const thumbnail = document.getElementById("thumbnail").files[0];
        console.log("Thumbnail: ", thumbnail)
        const site_key = document.getElementById("site-key").value;

        // const formData = new FormData();
        // formData.append("title", title);
        // formData.append("content", content);
        // formData.append("site_key", site_key);
        // formData.append("thumbnail", thumbnail);
        postPost(title, content, site_key, thumbnail).then(() => {
            getPosts(5).then(displayPosts);
        });
    });
});