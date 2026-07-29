export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Check if the request is for the blog post route and has an ID parameter
  if (url.pathname.startsWith("/blog/post") && url.searchParams.has("id")) {
    const postId = url.searchParams.get("id");
    console.log("--> Intercepted Search Params:", postId);

    try {
      // Query your D1 Database (replace 'DB' with your actual D1 binding name)
      const post = await env.beronicous_db
        .prepare(
          "SELECT title, content, thumbnail_image FROM blog_posts WHERE id = ?",
        )
        .bind(postId)
        .first();

      if (post) {
        // Truncate content to the first 200 characters for og:description
        const description = post.content
          ? post.content.substring(0, 200) + "..."
          : "";

        // Fetch the static HTML page from storage
        const response = await env.ASSETS.fetch(request);

        // Use HTMLRewriter to inject Open Graph meta tags into the <head>
        return new HTMLRewriter()
          .on("head", {
            element(element) {
              element.append(
                `\n<meta property="og:title" content="${escapeHtml(post.title)}" />`,
                { html: true },
              );
              element.append(
                `\n<meta property="og:description" content="${escapeHtml(description)}" />`,
                { html: true },
              );
              if (post.thumbnail) {
                element.append(
                  `\n<meta property="og:image" content="${escapeHtml(post.thumbnail)}" />`,
                  { html: true },
                );
              }
              element.append(
                `\n<meta property="og:type" content="article" />`,
                { html: true },
              );
              element.append(
                `\n<meta property="og:url" content="${url.href}" />`,
                { html: true },
              );
            },
          })
          .transform(response);
      }
    } catch (err) {
      console.error("Error fetching post from D1:", err);
    }
  }

  // Pass through all other requests normally
  return env.ASSETS.fetch(request);
}

// Utility to escape quotes and unsafe characters in strings
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
