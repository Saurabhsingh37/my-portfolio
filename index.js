/* global gsap, ScrollTrigger, ScrollToPlugin */

// ----- UTILITY: get nav and update offset -----
const nav = document.querySelector(".header");
function updateNavOffset() {
  const h = nav ? nav.offsetHeight : 0;
  document.documentElement.style.scrollPaddingTop = h + "px";
  return h;
}
let navHeight = updateNavOffset();
window.addEventListener("resize", () => {
  navHeight = updateNavOffset();
});

// ----- MENU TOGGLE -----
const menuIcon = document.getElementById("menu-icon");
const dropdownMenu = document.querySelector(".dropdown_menu");
if (menuIcon && dropdownMenu) {
  menuIcon.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
  });

  document.querySelectorAll(".dropdown_menu a").forEach((link) => {
    link.addEventListener("click", () =>
      dropdownMenu.classList.remove("active"),
    );
  });

  document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== menuIcon) {
      dropdownMenu.classList.remove("active");
    }
  });
}

// ----- RUBBER SCROLL PROGRESS BAR -----
const scrollBar = document.querySelector(".scroll-progress");
let width = 0;
let target = 0;
function animateBar() {
  width += (target - width) * 0.1;
  if (scrollBar) scrollBar.style.width = width + "%";
  requestAnimationFrame(animateBar);
}
animateBar();

window.addEventListener("scroll", () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  target = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
  if (scrollBar) {
    scrollBar.classList.add("active");
    clearTimeout(scrollBar.removePulse);
    scrollBar.removePulse = setTimeout(
      () => scrollBar.classList.remove("active"),
      200,
    );
  }
});

// ----- GSAP: register plugins -----
// ----- GSAP safe check (warn only once) -----
if (typeof gsap === "undefined" || typeof ScrollToPlugin === "undefined") {
  if (!window.gsapWarnShown) {
    console.warn(
      "GSAP or ScrollToPlugin not found. Make sure CDN scripts load BEFORE index.js",
    );
    window.gsapWarnShown = true;
  }
} else {
  // GSAP is loaded →  GSAP code starts here

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // disable native smooth to avoid conflicts
  try {
    document.documentElement.style.scrollBehavior = "auto";
  } catch (e) {}

  // prevent double clicks while scrolling
  let isScrolling = false;

  // Very slow cinematic scrollTo settings
  const slowScrollOptions = {
    duration: 20.8, // slow time in seconds (adjust 2.2 - 4.0 as you like)
    ease: "expo.inOut", // smooth cinematic easing
    // will use ScrollToPlugin scrollTo with offsetY below
  };

  // Attach click handlers for nav jumps
  document.querySelectorAll(".nav a, .dropdown_menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return; // ignore external links
      const id = href.slice(1);
      const targetEl = document.getElementById(id);
      if (!targetEl) return;

      e.preventDefault();
      if (isScrolling) return; // ignore while animating
      isScrolling = true;

      // use ScrollToPlugin with offsetY to account for nav height
      gsap.to(window, {
        ...slowScrollOptions,
        scrollTo: { y: targetEl, autoKill: false, offsetY: navHeight },
        onComplete: () => {
          // update hash without jumping
          history.pushState(null, "", `#${id}`);
          // small delay to allow reflows before enabling next click
          setTimeout(() => (isScrolling = false), 40);
        },
      });
    });
  });

  // ----- Premium Reveal: Zoom + Fade + Slide (slow) -----
  const sections = gsap.utils.toArray(
    ".home, .contact, .about, .skills, .resume",
  );
  sections.forEach((section) => {
    // hide initial paint (helps visual jump)
    gsap.set(section, { willChange: "transform, opacity" });

    gsap.from(section, {
      opacity: 0,
      y: 120,
      scale: 0.86,
      duration: 10.8,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        // markers: true // uncomment for debugging
      },
    });

    // slow parallax
    gsap.to(section, {
      y: -18,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.3,
      },
    });
  });
}

// Email Query in contact form
// Initialize EmailJS
document.addEventListener("DOMContentLoaded", function () {
  // Init EmailJS
  emailjs.init("Rertows2rHUaHHk1S");

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop reload

    emailjs.sendForm("service_7mvev3q", "template_4x17de3", form).then(
      function () {
        alert("Message sent successfully!");
        form.reset();
      },
      function (error) {
        alert("Failed to send message!");
        console.log("EmailJS Error:", error);
      },
    );
  });
});

//Social icon tooltips styling
const socialIcons = document.querySelectorAll(".social_icon #hover");

socialIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // vibration feedback (mobile supported devices)
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }

    // auto hide tooltip after 2 seconds
    setTimeout(() => {
      icon.blur(); // removes focus -> tooltip hides
    }, 2000);
  });
});

//vibrating skill icon
document.querySelectorAll(".skill_divs").forEach((skill) => {
  skill.addEventListener("click", () => {
    if (navigator.vibrate) {
      navigator.vibrate(60); // vibration in ms
    }
  });
});
