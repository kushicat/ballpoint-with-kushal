/* ============================================================================
   BALLPOINT WITH KUSHAL — animations.js
   Handles: scroll-reveal effects, animated number counters, and the
   back-to-top button. Uses IntersectionObserver (efficient, no scroll spam).
   Respects prefers-reduced-motion automatically (CSS handles the reduction).
   ============================================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Scroll reveal --------------------------------------------------- */
  /* Any element with [data-reveal] fades/slides in when it enters the viewport.
     Add data-reveal to a new element and it animates automatically. */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target); // animate once, then stop watching
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Reduced motion or no IO support: just show everything
    revealEls.forEach((el) => el.classList.add("is-revealed"));
  }

  /* ---- 2. Animated counters ----------------------------------------------- */
  /* Any element with [data-counter="123"] counts up from 0 when scrolled into
     view. Optional [data-suffix="+"] appends a symbol. */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-counter")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    if (prefersReduced || target === 0) {
      el.textContent = target + suffix;
      return;
    }
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---- 3. Back-to-top button ---------------------------------------------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const toggle = () => backToTop.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", toggle, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
    toggle();
  }

  // Expose counter helper so main.js can re-trigger it on dynamically added stats
  window.BPK = window.BPK || {};
  window.BPK.animateCounter = animateCounter;
})();
