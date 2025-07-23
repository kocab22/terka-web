const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("main-nav");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
});

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  console.log("scrollY:", window.scrollY); // sleduj hodnoty
  if (window.scrollY > 250) {
    header.style.opacity = "1";
  } else {
    header.style.opacity = "0.5";
  }
});
