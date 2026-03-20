export async function onRequestPost(context){
    const res = await context.request.json();
    const { id } = res; // The amount of posts to fetch, e.g., 5 for the latest 5 posts

    // const data = await context.env.beronicous_db.prepare('SELECT * FROM blog_posts ORDER BY id DESC LIMIT ?').all(amount);
    const data = await context.env.beronicous_db.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).all(); // Temporary until posts are more than 5
    return new Response(JSON.stringify(data.results), {
    headers: { 'Content-Type': 'application/json' },
    });

}