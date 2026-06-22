// Check if the user is an admin
async function checkAdminStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const admin_param = urlParams.get("admin");

  console.log("Getting admin param:", admin_param);

  if (!admin_param) {
    return { key: null, isAdmin: false };
  }

  try {
    const res = await fetch(`/api/isAdmin?admin=${admin_param}`);
    const data = await res.json();

    return {
      key: admin_param,
      isAdmin: data.isAdmin,
    };
  } catch (error) {
    console.error("API error:", error);
    return { key: admin_param, isAdmin: false };
  }
}

// Global variable so appendParamToLink can read it later
let globalAdminKey = null;

function appendParamToLink(e) {
  const link = e.target.closest("a");

  if (link && link.href && globalAdminKey) {
    if (!link.dataset.paramAdded) {
      try {
        const targetUrl = new URL(link.href);
        targetUrl.searchParams.set("admin", globalAdminKey);

        link.href = targetUrl.toString();
        link.dataset.paramAdded = "true";
      } catch (err) {
        console.error("Invalid URL structure", err);
      }
    }
  }
}

// Put setup inside DOMContentLoaded so everything executes in order
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Admin Setup (Using await properly)
  const admin_data = await checkAdminStatus();

  if (admin_data.isAdmin) {
    globalAdminKey = admin_data.key; // Store it globally for the event handlers
    document.body.addEventListener("mouseover", appendParamToLink);
    document.body.addEventListener("touchstart", appendParamToLink);
  }

  // 2. Lightbox Setup (Unchanged)
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".lightbox-close");

  document.body.addEventListener("click", async (e) => {
    if (e.target.tagName === "IMG") {
      if (e.target.id === "lightboxImg") return;

      lightboxImg.src = e.target.src;
      lightbox.style.display = "flex";

      setTimeout(() => {
        lightbox.classList.add("active");
      }, 10);
    }
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    setTimeout(() => {
      lightbox.style.display = "none";
    }, 250);
  }

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
});
