// Check if the user is an admin
async function checkAdminStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const admin_param = urlParams.get("admin");

  console.log("Getting admin param:", admin_param);

  // Default values if no parameter is in the URL
  if (!admin_param) {
    return { key: null, isAdmin: false };
  }

  try {
    const res = await fetch(`/api/isAdmin?admin=${admin_param}`);
    const data = await res.json();

    // Return BOTH pieces of data grouped together in an object
    return {
      key: admin_param,
      isAdmin: data.isAdmin,
    };
  } catch (error) {
    console.error("API error:", error);
    return { key: admin_param, isAdmin: false };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".lightbox-close");

  // 1. OPEN LIGHTBOX WITH ZOOM (Updated to support late-loading D1 images)
  document.body.addEventListener("click", async (e) => {
    // Check if the clicked element is an image
    if (e.target.tagName === "IMG") {
      // Safety check: ignore clicks on the lightbox image itself
      if (e.target.id === "lightboxImg") return;

      // Set the image source
      lightboxImg.src = e.target.src;

      // First make it flex so it exists in the DOM layout
      lightbox.style.display = "flex";

      // Use a tiny timeout so the browser registers the display change
      // before applying the zoom/fade animation class
      setTimeout(() => {
        lightbox.classList.add("active");
      }, 10);
    }
    // For adding admin param to links
    const link = e.target.closest("a");
    const adminData = await checkAdminStatus();

    // Now you have access to both variables from that single function call
    const admin_key = adminData.key; // e.g., "secret-token-123"
    const is_admin = adminData.isAdmin;
    if (link && link.href && is_admin) {
      e.preventDefault();
      const targetUrl = new URL(link.href);

      targetUrl.searchParams.set("admin", admin_key);

      window.location.href = targetUrl.toString();
    }
  });

  // 2. CLOSE LIGHTBOX SAFELY (Keeps the smooth fade-out delay)
  function closeLightbox() {
    lightbox.classList.remove("active");
    // Wait for the fade-out transition to finish before hiding display completely
    setTimeout(() => {
      lightbox.style.display = "none";
    }, 250);
  }

  // Close triggers
  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
});
