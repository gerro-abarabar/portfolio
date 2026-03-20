//checks for admin
export async function onRequest(request) {
    console.log("Checking admin status...", request.request.url);
    const url = new URL(request.request.url);
    const admin_code = url.searchParams.get('admin');
    console.log("Admin code provided:", admin_code,admin_code === request.env.owner_token );
    return new Response(
        JSON.stringify({ isAdmin: admin_code === request.env.owner_token }),
        { headers: { 'Content-Type': 'application/json' } }
    );
}