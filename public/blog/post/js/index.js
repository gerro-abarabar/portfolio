// TODO: add an edit capability for the owner

const md = window.markdownit({
  breaks: true,
  linkify: true,
  html: true,
});

function getPost(id) {
  return fetch("/api/blog/get_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post status:", data.success);
      return data;
    });
}
const blog_id = new window.URLSearchParams(window.location.search).get("id");
getPost(blog_id)
  .then((res) => res[0])
  .then((res) => {
    console.log(res);
    document.getElementById("title").innerHTML = res.title;
    document.getElementById("content").innerHTML = md.render(res.content);
    document.getElementById("thumbnail").src = res.thumbnail_image;
  });
const comment_form = document.querySelector("#comment-form");

comment_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const author_element = document.getElementById("comment-author");
  const content_element = document.getElementById("comment-content");

  // Keep a reference to the values before we clear the inputs
  const author_value = author_element.value;
  const content_value = content_element.value;

  const formData = new FormData(comment_form);
  formData.append("blog_post_id", blog_id);
  formData.append("comment-author", author_value);
  formData.append("comment-content", content_value);

  try {
    // 1. Wait for the server to process and return data (like the new database ID)
    const response = await send_comment(formData);

    // Assuming your server returns an object containing the new ID, e.g., { id: 42 }
    // If it returns a raw string ID, just use: const comment_id = response;
    const comment_id = response?.id || Date.now().toString();

    // 2. Clear out the "No comments" fallback if this is the first comment
    if (comment_section.innerHTML.includes("No comments.")) {
      comment_section.innerHTML = "";
    }

    // 3. Dynamically insert the comment straight into the DOM
    new_comment(author_value, content_value, comment_id);

    // 4. Reset the form inputs cleanly for the next comment
    author_element.value = "";
    content_element.value = "";
  } catch (error) {
    console.error("Failed to send comment:", error);
    alert("Something went wrong saving your comment. Please try again.");
  }
});

// A tiny adjustment to ensure variables don't accidentally leak into global scope
function new_comment(comment_author, comment_content, id) {
  const section = document.createElement("section");
  section.id = id;
  section.classList.add("comment");
  section.classList.add("container-text");

  const content = document.createElement("p");
  content.textContent = comment_content;

  const author = document.createElement("h4");
  author.textContent = comment_author;

  section.append(author);
  section.append(content);

  // Appending adds it to the bottom.
  // TIP: If you want newer comments at the top, change this to: comment_section.prepend(section);
  comment_section.prepend(section);
}
const comment_section = document.getElementById("comment-section");
get_comments(blog_id).then((data) => {
  if (!data || data.length === 0) {
    comment_section.innerHTML = "<p>No comments.</p>";
    return; // Stop execution here so the loop doesn't run
  }
  for (const { author, content, id } of data) {
    new_comment(author, content, id);
  }
});
