function getPosts(amount=5) {
    return fetch("/api/blog/grab", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount:amount
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
}