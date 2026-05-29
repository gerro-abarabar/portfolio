export async function onRequestPost(context) {
  let res;
  try {
    res = await context.request.formData();
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid Content-Type. Please use multipart/form-data",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const author = res.get("comment-author");
  const content = res.get("comment-content");
  const blog_post_id = res.get("blog_post_id");
  const date_created = new Date().toISOString();
  console.log(res);
  const row = await context.env.beronicous_db
    .prepare(
      "INSERT INTO comments (blog_post_id,author,content,date_created) VALUES (?,?,?,?) RETURNING *",
    )
    .bind(blog_post_id, author, content, date_created)
    .run();
  console.log(`New data has been inputed: ${JSON.stringify(row, null, 2)}`);
  // Respond with the new blog post details
  return new Response(
    JSON.stringify({
      success: true,
      data: row.results[0],
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
