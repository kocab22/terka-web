const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("main-nav");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  nav.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (nav.classList.contains("active")) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("active");
    }
  }
});

document.addEventListener("touchstart", (e) => {
  if (nav.classList.contains("active")) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("active");
    }
  }
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const heroText = document.querySelector(".hero-text");
  const heroTextRect = heroText.getBoundingClientRect();
  if (window.scrollY === 0) {
    header.classList.remove("transparent");
  } else if (heroTextRect.top <= header.offsetHeight - 100) {
    header.classList.remove("transparent");
  } else {
    header.classList.add("transparent");
  }
});
