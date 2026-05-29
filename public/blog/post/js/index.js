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
  const formData = new FormData(comment_form);
  const author_element = document.getElementById("comment-author");
  const content_element = document.getElementById("comment-content");

  formData.append("comment-author", author_element.value);
  formData.append("comment-content", content_element.value);
  formData.append("blog_post_id", blog_id);
  console.log(Object.fromEntries(formData));
  console.log(await send_comment(formData));
});

function new_comment(comment_author, comment_content, id) {
  section = document.createElement("section");
  section.id = id;
  section.classList.add("comment");

  content = document.createElement("p");
  content.textContent = comment_content;

  author = document.createElement("h4");
  author.textContent = comment_author;

  section.append(author);
  section.append(content);

  comment_section.append(section);
  console.log(id);
}
const comment_section = document.getElementById("comment-section");
get_comments(blog_id).then((data) => {
  if (data == []) {
    comment_section.innerHTML = "<p>No comments.</p>";
  }
  for (const { author, content, id } of data) {
    new_comment(author, content, id);
  }
});
