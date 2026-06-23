export async function onRequest(context) {
  const res = await context.request.json();
  const { id, admin_key, content, title } = res;
  if (admin_key !== context.env.owner_token) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const date_modified = new Date().toISOString();
  const row = await context.env.beronicous_db
    .prepare(
      "UPDATE blog_posts SET title = ?, content = ?, date_modified = ? WHERE id = ? RETURNING *",
    )
    .bind(title, content, date_modified, id)
    .run();
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
