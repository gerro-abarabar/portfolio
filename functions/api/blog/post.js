export async function onRequestPost(context){
    let res;
    try {
        res = await context.request.formData();
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: "Invalid Content-Type. Please use multipart/form-data" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (res.get("owner_token") !== context.env.owner_token ) {
        return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    console.log("New blog post:", res);

    const title = res.get("title");
    const content = res.get("content");
    const site_key = res.get("site_key");
    const thumbnail_image = res.get("thumbnail_image");

    const date_created= new Date().toISOString();
    const date_modified = date_created;
    console.log(title,
        content,
        site_key,
        thumbnail_image,
        date_created,
        date_modified);
    
    var thumbnail_link=null;
    const thumbnailFormData = new FormData();
    thumbnailFormData.append("admin", res.get("owner_token"));
    thumbnailFormData.append("file", thumbnail_image);

    // For the thumbnail
    const uploadResponse = await fetch(new URL("/api/files/upload", context.request.url), {
        method: "POST",
        body: thumbnailFormData,
    });
    const uploadData = await uploadResponse.json();
    thumbnail_link = uploadData.url;
    


    const row = await context.env.beronicous_db
    .prepare(
        "INSERT INTO blog_posts (title, content, site_key, thumbnail_image, date_created, date_modified) VALUES (?,?,?,?,?,?) RETURNING *"
    )
    .bind(
        title,
        content,
        site_key,
        thumbnail_link,
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