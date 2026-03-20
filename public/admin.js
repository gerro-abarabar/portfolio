// Check if the user is an admin
function isAdmin() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Getting admin",urlParams.get('admin'));
    return fetch(`/api/isAdmin?admin=${urlParams.get('admin')}`)
        .then(res => {
            return res.json();
        })
        .then(data => {
            
            return data.isAdmin;
        });
}