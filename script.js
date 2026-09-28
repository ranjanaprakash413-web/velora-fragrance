// Production Render Backend URL
const API_BASE_URL = "https://velora-backend-82fr.onrender.com";

const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const heroVideo = document.getElementById("heroVideo");

let cart = 0;
let cartItems = [];
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Try to start the muted homepage video.
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.playsInline = true;

  heroVideo.addEventListener("error", () => {
    console.warn("Video notice. Checking fallback sources.");
  });

  const startVideo = () => {
    const playRequest = heroVideo.play();
    if (playRequest && typeof playRequest.catch === "function") {
      playRequest.catch(error => {
        console.warn("Video autoplay was blocked by the browser:", error);
      });
    }
  };

  if (heroVideo.readyState >= 2) {
    startVideo();
  } else {
    heroVideo.addEventListener("canplay", startVideo, { once: true });
  }
}

// Header scroll effect
window.addEventListener("scroll", () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
}, { passive: true });

// Mobile navigation
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

// Cart interactions connected to backend catalog
document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    const productName = button.dataset.add;
    cart += 1;
    cartItems.push(productName);
    if (cartCount) cartCount.textContent = String(cart);
    showToast(`${productName} added to your bag`);
  });
});

document.getElementById("bagBtn")?.addEventListener("click", () => {
  showToast(cart
    ? `Your bag has ${cart} item${cart === 1 ? "" : "s"}`
    : "Your bag is currently empty");
});

document.getElementById("searchBtn")?.addEventListener("click", () => {
  showToast("Search is coming soon");
});

document.getElementById("accountBtn")?.addEventListener("click", () => {
  showToast("Account features are coming soon");
});

// Reveal elements as they enter the viewport
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

// Newsletter connected to the live Render backend
const newsletterForm = document.getElementById("newsletter");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async event => {
    event.preventDefault();

    const input = document.getElementById("email");
    const message = document.getElementById("newsletterMessage");
    const button = event.currentTarget.querySelector("button");

    if (!input || !message) return;

    if (button) button.disabled = true;
    message.textContent = "SUBSCRIBING...";

    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim() })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to subscribe");

      message.textContent = "THANK YOU — YOU'RE ON THE LIST.";
      input.value = "";
    } catch (error) {
      message.textContent = error.message || "Please try again.";
    } finally {
      if (button) button.disabled = false;
    }
  });
}

// Verify backend connectivity and sync products on load
async function initBackendConnection() {
  try {
    const [healthRes, prodRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/health`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/products`).then(r => r.json())
    ]);

    if (healthRes.status === 'healthy') {
      console.log("[VELORA] Connected to Render Backend:", healthRes.service);
    }
    if (prodRes.success && Array.isArray(prodRes.data)) {
      console.log(`[VELORA] ${prodRes.data.length} Fragrances loaded from backend database.`);
      window.veloraBackendProducts = prodRes.data;
    }
  } catch (err) {
    console.warn("[VELORA] Backend connection notice:", err.message);
  }
}

initBackendConnection();
