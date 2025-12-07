const menuIcon = document.getElementById("menu-icon");
const dropdownMenu = document.querySelector(".dropdown_menu");

// Toggle open/close menu when clicking icon
menuIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("active");
});

// Close menu when clicking any link
document.querySelectorAll(".dropdown_menu a").forEach((link) => {
  link.addEventListener("click", () => {
    dropdownMenu.classList.remove("active");
  });
});

// Close menu when clicking outside menu & icon
document.addEventListener("click", (e) => {
  if (!dropdownMenu.contains(e.target) && e.target !== menuIcon) {
    dropdownMenu.classList.remove("active");
  }
});

// 🟢 RUBBER SCROLL BAR EFFECT
const scrollBar = document.querySelector(".scroll-progress");
let width = 0;
let target = 0;

function animateBar() {
  width += (target - width) * 0.1; // elasticity
  scrollBar.style.width = width + "%";
  requestAnimationFrame(animateBar);
}

animateBar();

window.addEventListener("scroll", () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  target = (window.scrollY / totalHeight) * 100;
});

window.addEventListener("scroll", () => {
  scrollBar.classList.add("active");
  clearTimeout(scrollBar.removePulse);
  scrollBar.removePulse = setTimeout(() => {
    scrollBar.classList.remove("active");
  }, 200);
});
