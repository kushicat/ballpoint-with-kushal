/* ============================================================================
   BALLPOINT WITH KUSHAL — navigation.js
   Handles: sticky navbar scroll state, mobile hamburger drawer, smooth-scroll
   to anchors, and closing the drawer after a link is tapped.

   This module is self-contained. It runs only if the relevant elements exist,
   so it won't error on pages that don't have a navbar.
   ============================================================================ */
(function () {
  "use strict";

  /* ---- 1. Sticky navbar: add shadow/border once the user scrolls ---------- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- 2. Hamburger menu + mobile drawer ---------------------------------- */
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");

  function closeDrawer() {
    if (!drawer || !hamburger) return;
    drawer.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openDrawer() {
    if (!drawer || !hamburger) return;
    drawer.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // lock background scroll
  }

  if (hamburger && drawer) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.getAttribute("aria-expanded") === "true";
      open ? closeDrawer() : openDrawer();
    });

    // Close the drawer when any link inside it is clicked
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    // Close on Escape key (accessibility)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    // Close if the viewport grows back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeDrawer();
    });
  }

  /* ---- 3. Smooth scroll for same-page anchor links ------------------------ */
  /* Native CSS smooth-scroll handles most of this; this adds focus management
     for accessibility and works even if CSS smooth-scroll is disabled. */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
})();
