export async function onRequestPost(context){
    const res = await context.request.json();

    if (res?.owner_token !== context.env.owner_token) {
        return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    console.log("New blog post:", res);

    const {
        title,
        content,
        site_key,
        thumbnail_image
    } = res;

    const date_created= new Date().toISOString();
    const date_modified = date_created;
    console.log(title,
        content,
        site_key,
        thumbnail_image,
        date_created,
        date_modified);


    const row = await context.env.beronicous_db
    .prepare(
        "INSERT INTO blog_posts (title, content, site_key, thumbnail_image, date_created, date_modified) VALUES (?,?,?,?,?,?) RETURNING *"
    )
    .bind(
        title,
        content,
        site_key,
        "thumbnail_image",
        date_created,
        date_modified
    )
    .run();
    console.log(
        `New data has been inputed: ${JSON.stringify(row, null, 2)}`
    );
    // Respond with the new blog post details
    return new Response(
        JSON.stringify({
        success: true,
        data: row.results[0],
        }),
        {
        headers: { "Content-Type": "application/json" },
        }
    );
}