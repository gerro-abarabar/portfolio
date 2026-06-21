document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".lightbox-close");

  // 1. OPEN LIGHTBOX WITH ZOOM (Updated to support late-loading D1 images)
  document.body.addEventListener("click", (e) => {
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
