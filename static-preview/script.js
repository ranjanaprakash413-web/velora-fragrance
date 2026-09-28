const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const heroVideo = document.getElementById("heroVideo");

let cart = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Header scroll effect
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
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

// Cart interactions
document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    cart += 1;
    cartCount.textContent = String(cart);
    showToast(`${button.dataset.add} added to your bag`);
  });
});

document.getElementById("bagBtn")?.addEventListener("click", () => {
  showToast(cart
    ? `Your bag has ${cart} item${cart === 1 ? "" : "s"}`
    : "Your bag is currently empty");
});

document.getElementById("searchBtn")?.addEventListener("click", () => {
  showToast("Search is active on the main store (/shop)");
});

document.getElementById("accountBtn")?.addEventListener("click", () => {
  showToast("Account access available on /profile");
});

// Newsletter connected to backend API
document.getElementById("newsletter")?.addEventListener("submit", async event => {
  event.preventDefault();

  const input = document.getElementById("email");
  const message = document.getElementById("newsletterMessage");
  const button = event.currentTarget.querySelector("button");

  button.disabled = true;
  message.textContent = "SUBSCRIBING...";

  try {
    const response = await fetch("http://localhost:5000/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.value.trim() })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to subscribe");

    message.textContent = "THANK YOU — YOU'RE ON THE LIST.";
    input.value = "";
  } catch (error) {
    message.textContent = error.message || "Thank you for subscribing.";
  } finally {
    button.disabled = false;
  }
});
