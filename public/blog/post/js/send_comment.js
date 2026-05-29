function send_comment(formData) {
  return fetch("/api/blog/post_comment", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post comment status:", data.success);
      return data;
    });
}
