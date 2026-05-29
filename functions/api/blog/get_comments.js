export async function onRequestPost(context) {
  const res = await context.request.json();
  const { id } = res; // The amount of posts to fetch, e.g., 5 for the latest 5 posts
  console.log(res);
  // const data = await context.env.beronicous_db.prepare('SELECT * FROM blog_posts ORDER BY id DESC LIMIT ?').all(amount);
  const data = await context.env.beronicous_db
    .prepare("SELECT * FROM comments WHERE blog_post_id = ? ORDER BY id DESC")
    .bind(id)
    .all();
  return new Response(JSON.stringify(data.results), {
    headers: { "Content-Type": "application/json" },
  });
}
