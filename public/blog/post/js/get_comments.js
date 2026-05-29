function get_comments(id) {
  return fetch("/api/blog/get_comments", {
    method: "POST",
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Post comment status:", res.success);
      return res;
    });
}
