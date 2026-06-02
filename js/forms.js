/* ============================================================================
   BALLPOINT WITH KUSHAL — forms.js
   Handles: form submission (waitlist / newsletter / contact), the FAQ accordion,
   and the testimonial carousel.

   >>> CONNECTING FORMS TO A REAL SERVICE (no backend needed) <<<
   Right now forms show a local "success" message and do NOT send data anywhere.
   To collect real submissions, pick ONE option per form:

   OPTION A — Google Forms (easiest, free):
     1. Build a Google Form with matching fields.
     2. Either: replace the <form> with an <iframe> embed (Send > <>), OR
        keep this design and POST to the form's "formResponse" URL using the
        entry.XXXX field IDs (see README for the step-by-step).
   OPTION B — Mailchimp / ConvertKit:
     Set the <form action="..."> to the embedded form action URL they give you,
     set method="post", and remove the e.preventDefault() interception below
     for that specific form (or let it submit in a hidden iframe).
   OPTION C — Formspree / Google Sheets (via Apps Script / SheetMonkey):
     Set <form action="https://formspree.io/f/XXXX" method="post"> and submit.

   The fields already use proper name="" attributes so any of the above works.
   ============================================================================ */
(function () {
  "use strict";

  /* ---- 1. Form handling (placeholder success state) ----------------------- */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      // Remove this preventDefault line once you wire the form to a real
      // service that expects a normal POST (Mailchimp/Formspree/Google Forms).
      e.preventDefault();

      // Basic native validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Show the success message (the .form-success sibling)
      const success = form.parentElement.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("role", "status");
      }
      form.reset();

      // For debugging while building — see what would be submitted:
      const data = Object.fromEntries(new FormData(form).entries());
      console.log("[BPK] Form captured (not yet sent anywhere):", data);
    });
  });

  /* ---- 2. FAQ accordion --------------------------------------------------- */
  /* Single-open accordion. Add more .faq__item blocks in the HTML and they
     work automatically — no JS changes needed. */
  const faqQuestions = document.querySelectorAll(".faq__q");
  faqQuestions.forEach((q) => {
    q.addEventListener("click", () => {
      const expanded = q.getAttribute("aria-expanded") === "true";
      const answer = q.nextElementSibling;

      // Close all others (comment out this block for multi-open behaviour)
      faqQuestions.forEach((other) => {
        if (other !== q) {
          other.setAttribute("aria-expanded", "false");
          if (other.nextElementSibling) other.nextElementSibling.style.maxHeight = null;
        }
      });

      // Toggle this one
      q.setAttribute("aria-expanded", String(!expanded));
      if (answer) {
        answer.style.maxHeight = expanded ? null : answer.scrollHeight + "px";
      }
    });
  });

  /* ---- 3. Testimonial carousel -------------------------------------------- */
  /* Works with any number of .carousel__slide elements. Auto-advances every 6s;
     pauses on hover; supports prev/next buttons, dots, and arrow keys. */
  function initCarousel(root) {
    const track = root.querySelector(".carousel__track");
    const slides = Array.from(root.querySelectorAll(".carousel__slide"));
    const dotsWrap = root.querySelector(".carousel__dots");
    const prevBtn = root.querySelector('[data-carousel="prev"]');
    const nextBtn = root.querySelector('[data-carousel="next"]');
    if (!track || slides.length === 0) return;

    let index = 0;
    let timer = null;

    // Build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", () => go(i));
        dotsWrap.appendChild(dot);
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll(".carousel__dot").forEach((d, di) =>
          d.classList.toggle("is-active", di === index)
        );
      }
    }
    const next = () => go(index + 1);
    const prev = () => go(index - 1);

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // Make the track use flex translate
    track.style.transition = "transform 0.45s cubic-bezier(0.4,0,0.2,1)";
    slides.forEach((s) => (s.style.minWidth = "100%"));

    // Autoplay (pauses on hover/focus)
    function start() { timer = setInterval(next, 6000); }
    function stop() { clearInterval(timer); }
    start();
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // Keyboard arrows when carousel focused
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    go(0);
  }

  // Expose so main.js can call it AFTER testimonials are rendered from JSON
  window.BPK = window.BPK || {};
  window.BPK.initCarousel = initCarousel;

  // Also init any carousel that already exists statically in the HTML
  document.querySelectorAll(".carousel").forEach(initCarousel);
})();
