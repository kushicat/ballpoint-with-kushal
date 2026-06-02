/* ============================================================================
   BALLPOINT WITH KUSHAL — main.js
   Entry point. Loads the data files in /data and renders the dynamic sections
   (courses, ebooks, testimonials + stats) so non-developers can edit content
   in JSON without touching HTML/CSS.

   IMPORTANT (local preview):
   This file uses fetch() to load JSON. fetch() does NOT work when you open
   index.html directly via the file:// protocol (the browser blocks it).
   It works perfectly on GitHub Pages and on any local web server.
   To preview locally, run a tiny server in the project folder:
       python3 -m http.server 8080      (then open http://localhost:8080)
   or use the VS Code "Live Server" extension.
   See README.md > "Running locally" for details.
   ============================================================================ */
(function () {
  "use strict";

  /* ---- Small inline icon set (keyed by the "icon" field in courses.json) -- */
  const ICONS = {
    function: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h4l3-14h4"/><path d="M6 12h8"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 0-2 2z"/><path d="M18 3v17"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-6 9 6"/><path d="M5 10v9M19 10v9M9 10v9M15 10v9M3 19h18"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>'
  };
  const checkIcon = ICONS.check;

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  // Friendly inline message if a data file can't be loaded
  function showLoadError(container, file) {
    if (!container) return;
    container.innerHTML =
      '<p class="text-muted" style="grid-column:1/-1;text-align:center;">' +
      "Couldn’t load " + file + ". If you’re previewing locally, run a local " +
      "server (see README). On GitHub Pages this loads automatically.</p>";
  }

  async function loadJSON(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  /* ---- 1. COURSES --------------------------------------------------------- */
  async function renderCourses() {
    const grid = document.querySelector("[data-courses]");
    if (!grid) return;
    try {
      const { courses } = await loadJSON("data/courses.json");
      grid.innerHTML = courses
        .map((c, i) => {
          const icon = ICONS[c.icon] || ICONS.book;
          const status = (c.status || "").replace(/\s+/g, "-");
          const badge = c.badge
            ? `<span class="badge badge--brand">${escapeHtml(c.badge)}</span>`
            : "";
          const features = (c.features || [])
            .map((f) => `<li>${checkIcon}<span>${escapeHtml(f)}</span></li>`)
            .join("");
          return `
          <article class="card course-card" data-reveal data-reveal-delay="${i % 3}">
            <div class="course-card__top">
              <div class="card__icon">${icon}</div>
              ${badge}
            </div>
            <h3>${escapeHtml(c.title)}</h3>
            <p>${escapeHtml(c.description)}</p>
            <ul class="course-card__features">${features}</ul>
            <span class="status-pill status-${status}" style="align-self:flex-start;margin-bottom:1rem;">
              ${escapeHtml(prettyStatus(c.status))}
            </span>
            <a class="btn btn--primary btn--full" href="${escapeHtml(c.link)}">${escapeHtml(c.ctaLabel || "Join Waitlist")}</a>
          </article>`;
        })
        .join("");
      reObserveReveals(grid);
    } catch (err) {
      console.warn("[BPK] courses.json:", err);
      showLoadError(grid, "courses.json");
    }
  }

  /* ---- 2. EBOOKS ---------------------------------------------------------- */
  async function renderEbooks() {
    const grid = document.querySelector("[data-ebooks]");
    if (!grid) return;
    try {
      const { ebooks } = await loadJSON("data/ebooks.json");
      grid.innerHTML = ebooks
        .map((b, i) => {
          const status = (b.status || "").replace(/\s+/g, "-");
          return `
          <article class="ebook-card" data-reveal data-reveal-delay="${i % 4}">
            <div class="ebook-card__cover">
              ${escapeHtml(b.title)}
              <span>${escapeHtml(b.category)}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="status-pill status-${status}">${escapeHtml(prettyStatus(b.status))}</span>
            </div>
            <p style="font-size:var(--fs-small)">${escapeHtml(b.description)}</p>
            <a class="btn btn--secondary btn--sm" href="${escapeHtml(b.link)}">${b.status === "available" ? "Download" : "Notify Me"}</a>
          </article>`;
        })
        .join("");
      reObserveReveals(grid);
    } catch (err) {
      console.warn("[BPK] ebooks.json:", err);
      showLoadError(grid, "ebooks.json");
    }
  }

  /* ---- 3. TESTIMONIALS + STATS -------------------------------------------- */
  async function renderTestimonials() {
    const statsWrap = document.querySelector("[data-stats]");
    const track = document.querySelector("[data-testimonials]");
    if (!statsWrap && !track) return;
    try {
      const data = await loadJSON("data/testimonials.json");

      // Stats (animated counters)
      if (statsWrap && data.stats) {
        statsWrap.innerHTML = data.stats
          .map(
            (s) => `
          <div class="stat" data-reveal>
            <div class="stat__num"><span class="text-gradient" data-counter="${Number(s.value) || 0}" data-suffix="${escapeHtml(s.suffix || "")}">0</span></div>
            <div class="stat__label">${escapeHtml(s.label)}</div>
          </div>`
          )
          .join("");
        // Trigger counters now that they exist
        statsWrap.querySelectorAll("[data-counter]").forEach((el) => {
          if (window.BPK && window.BPK.animateCounter) window.BPK.animateCounter(el);
        });
      }

      // Testimonials (carousel slides)
      if (track && data.testimonials) {
        track.innerHTML = data.testimonials
          .map((t) => {
            const initials = (t.name || "?").trim().charAt(0).toUpperCase();
            const avatar = t.avatar
              ? `<img class="testimonial__avatar" src="${escapeHtml(t.avatar)}" alt="${escapeHtml(t.name)}">`
              : `<div class="testimonial__avatar">${escapeHtml(initials)}</div>`;
            return `
            <div class="carousel__slide">
              <figure class="testimonial">
                <blockquote class="testimonial__quote">“${escapeHtml(t.quote)}”</blockquote>
                <figcaption class="testimonial__author">
                  ${avatar}
                  <div style="text-align:left">
                    <div class="testimonial__name">${escapeHtml(t.name)}</div>
                    <div class="testimonial__role">${escapeHtml(t.role)}</div>
                  </div>
                </figcaption>
              </figure>
            </div>`;
          })
          .join("");

        // (Re)initialise the carousel now that slides exist
        const carousel = track.closest(".carousel");
        if (carousel && window.BPK && window.BPK.initCarousel) {
          window.BPK.initCarousel(carousel);
        }
      }
      reObserveReveals(statsWrap);
    } catch (err) {
      console.warn("[BPK] testimonials.json:", err);
      if (track) showLoadError(track, "testimonials.json");
    }
  }

  /* ---- Helpers ------------------------------------------------------------ */
  function prettyStatus(s) {
    const map = {
      waitlist: "Waitlist open",
      enrolling: "Enrolling now",
      live: "Live",
      "coming-soon": "Coming soon",
      available: "Available now"
    };
    return map[s] || s || "";
  }

  // Make newly injected [data-reveal] elements animate in
  function reObserveReveals(scope) {
    if (!scope) return;
    const els = scope.querySelectorAll("[data-reveal]:not(.is-revealed)");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-revealed");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach((el) => el.classList.add("is-revealed"));
    }
  }

  /* ---- 4. Footer year ----------------------------------------------------- */
  function setYear() {
    const y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---- Init --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    renderCourses();
    renderEbooks();
    renderTestimonials();
  });
})();
