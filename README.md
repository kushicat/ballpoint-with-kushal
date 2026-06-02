# Ballpoint with Kushal — Website

A premium, scalable, multi-page education brand website. Pure HTML, CSS, and
vanilla JavaScript — no frameworks, no build step, no backend. It runs as-is on
GitHub Pages (or any static host).

Brand message: **Structured preparation for ambitious professionals.**

---

## 1. Folder structure

```
ballpoint-with-kushal/
├── index.html            # Homepage (all 12 sections)
├── about.html            # About / profile page
├── courses.html          # Courses listing (rendered from data/courses.json)
├── ebooks.html           # Ebooks listing (rendered from data/ebooks.json)
├── resources.html        # Free resources
├── contact.html          # Contact page + optional contact form
├── 404.html              # Shown by GitHub Pages for unknown URLs
│
├── assets/
│   ├── images/           # Photos + placeholder/social SVGs
│   ├── icons/            # Extra icon files (most icons are inline SVG)
│   ├── logos/            # logo-full.svg, logo-icon.svg, favicon.svg
│   └── documents/        # PDFs, ebooks, downloadable sheets (add later)
│
├── css/
│   ├── styles.css        # Design tokens (colors/fonts/spacing) + base + layout
│   ├── components.css    # Buttons, cards, navbar, forms, carousel, footer, etc.
│   ├── utilities.css     # Small helper classes (spacing, text, display)
│   └── responsive.css    # ALL breakpoints live here
│
├── js/
│   ├── navigation.js     # Sticky navbar, hamburger drawer, smooth scroll
│   ├── animations.js     # Scroll reveal, animated counters, back-to-top
│   ├── forms.js          # Form handling, FAQ accordion, testimonial carousel
│   └── main.js           # Entry point: loads JSON data and renders sections
│
├── data/
│   ├── courses.json      # Edit courses here (no HTML needed)
│   ├── ebooks.json       # Edit ebooks here
│   └── testimonials.json # Testimonials + stats  (PLACEHOLDERS — see §9)
│
└── README.md
```

HTML, CSS, and JavaScript are all complete and production-quality (spec
deliverables 2, 3, and 4).

---

## 2. Setup & local preview

> **Important:** Some sections (courses, ebooks, testimonials, stats) are loaded
> from the JSON files in `/data` using JavaScript `fetch()`. Browsers **block
> `fetch()` when you open a file directly** (the `file://...` protocol). If you
> just double-click `index.html`, those sections will show a "couldn't load"
> message. Everything else still works.
>
> To preview the full site locally, run a tiny local server from the project
> folder. Pick whichever you have:

```bash
# Python 3 (most common)
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

On GitHub Pages (or any real web host) this caveat does **not** apply — `fetch()`
works normally because the files are served over `https://`.

---

## 3. Deploy to GitHub Pages

1. Create a GitHub repository (e.g. `ballpoint-with-kushal`).
2. Put **all the files in this folder at the repository root** (not inside a
   subfolder). `index.html` must sit at the top level of the repo.
3. Commit and push.
4. In the repo: **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Branch: `main`, folder: `/ (root)`. Save.
7. Wait ~1 minute. Your site goes live at
   `https://<your-username>.github.io/<repo-name>/`.

**Custom domain (optional):** in Settings → Pages → Custom domain, add your
domain and create the matching DNS records with your registrar. GitHub will
provision HTTPS automatically.

A few deployment notes:
- All internal links are **relative** (`courses.html`, `index.html#waitlist`),
  so the site works whether it's at a root domain or a `/<repo-name>/` subpath.
- `404.html` is automatically used by GitHub Pages for unknown URLs.
- Before going live, update the `<link rel="canonical">` and `og:image` URLs in
  each HTML `<head>` from `https://example.com/...` to your real domain.

---

## 4. Customization guide

### Colors, fonts, spacing — one place

Open **`css/styles.css`** and edit the `:root` variables at the top. Everything
else references them, so changing one value updates the whole site.

```css
:root {
  --color-primary:   #2563EB;  /* brand blue  */
  --color-secondary: #10B981;  /* brand green */
  --color-text:      #0F172A;  /* dark text   */
  --color-bg:        #F8FAFC;  /* light page background */
  --color-surface:   #FFFFFF;  /* card surface */
  --gradient-brand:  linear-gradient(135deg, #2563EB 0%, #10B981 100%);
  /* fonts (--font-body, --font-display), type scale, spacing, radius,
     and shadows are all defined here too */
}
```

Don't hunt for hard-coded colors in other files — there shouldn't be any. If you
want a different look, change the tokens here.

### Fonts

Fonts are loaded in each HTML `<head>` (Google Fonts: Inter, Manrope, Plus
Jakarta Sans) and assigned via `--font-body` / `--font-display` in `styles.css`.
Swap the `<link>` and the two variables to change typography everywhere.

### Logo

Three files in `assets/logos/`:
- `logo-full.svg` — icon + wordmark. Used in the navbar and footer.
- `logo-icon.svg` — square icon only. Use it for app icons or tight spaces.
- `favicon.svg` — browser tab icon. Referenced in every page's `<head>`.

To replace the logo, swap these files (keep the same filenames) or update the
`src`/`href` references. The placeholder logo is a real, editable SVG — open it
in any editor to tweak colors or shape.

---

## 5. Section-by-section editing guide

### Edit content WITHOUT touching HTML (the easy path)

These sections are generated from JSON data files by `js/main.js`:

| Section            | Edit this file            | Notes                                  |
|--------------------|---------------------------|----------------------------------------|
| Courses            | `data/courses.json`       | Add/remove objects in the `courses` array |
| Ebooks             | `data/ebooks.json`        | Add/remove objects in the `ebooks` array  |
| Testimonials + Stats | `data/testimonials.json` | **Placeholders — read §9 before publishing** |

Each JSON file has a `_comment` field explaining the fields. Add a course by
copying an existing object, changing the values, and saving. No HTML required.

`status` values control the badge/button: `waitlist`, `enrolling`, `live`,
`coming-soon`.

### Edit content IN the HTML (static sections)

Open `index.html` — every section is wrapped in a clearly commented block
(e.g. `SECTION 6 — FREE RESOURCES`). Each section is self-contained and can be
edited or deleted without breaking the others.

- **Hero copy / buttons** → top of `index.html`, `SECTION 1`.
- **Why this exists** → `SECTION 2` (problem vs. solution columns).
- **About / timeline** → `SECTION 3` in `index.html`, and the full `about.html`.
  Add a timeline entry by copying a `<li class="timeline__item">`.
- **Free resources** → `SECTION 6`. Add a card by copying an
  `<article class="card resource-card">`.
- **YouTube** → `SECTION 7`. Replace the placeholders with real embeds — the
  HTML comment there shows the `<iframe>` snippet to paste.
- **Waitlist form** → `SECTION 9`. See §6 below to make it actually send.
- **FAQ** → `SECTION 10`. Add a question by copying a `.faq__item` block.
- **Contact** → `SECTION 11` plus the standalone `contact.html`.
- **Footer** → bottom of every page. **It's duplicated in each HTML file**
  (there's no templating in a static site), so if you change a footer link,
  change it in all pages. Same applies to the navbar.

---

## 6. Connecting the forms (currently front-end only)

The waitlist form (`index.html`) and contact form (`contact.html`) are marked
with `data-form` and handled by `js/forms.js`. **Right now they only show a
success message — they do not send or store anything.** This is intentional:
it's a static site with no backend.

To make a form actually deliver, pick one of these (no backend code needed):

- **Formspree** — easiest. Set `action="https://formspree.io/f/yourID"` and
  `method="POST"` on the `<form>`, then let it submit normally.
- **Google Forms** — create a Form, map your fields to its entry IDs, and POST
  to its `formResponse` URL.
- **Mailchimp / ConvertKit** — use their embedded form action URL.
- **Google Sheets** — via a Google Apps Script web-app endpoint.

`js/forms.js` has inline comments at the top of the form handler explaining
exactly where to wire each option. The field `name` attributes are already set
sensibly (`name`, `email`, `target_exam`, `subject`, `message`).

---

## 7. Architecture notes (for future edits, human or AI)

- **Separation of concerns:** structure in HTML, all theming via CSS variables
  in `styles.css`, behavior split across four small JS files by responsibility.
- **Data-driven where it matters:** content that changes often (courses,
  ebooks, testimonials) lives in `/data` JSON, not in markup.
- **No global side effects:** each JS file is an IIFE; shared helpers are
  namespaced under `window.BPK`. New scripts can be added without collisions.
- **Reusable component classes:** `.card`, `.btn`, `.section`, `.grid`, etc. New
  pages can be built by reusing these — copy the shared navbar/footer shell from
  any existing page (e.g. `courses.html`) as a starting template.
- **Accessibility built in:** skip link, semantic landmarks, ARIA on the
  hamburger/FAQ/carousel, keyboard support, and `prefers-reduced-motion` is
  respected for all animations.

---

## 8. Future scaling recommendations

The site is structured to grow. Suggested path:

1. **More pages** — `blog.html`, `mock-tests.html`, `vocabulary.html`. Copy the
   shell from an existing page; reuse the component classes.
2. **Blog** — start static (one HTML file per post or a `posts.json` rendered
   like courses). Move to a static-site generator (Astro, Eleventy) if volume
   grows.
3. **Ebook store / payments** — for selling, you'll need a backend or a hosted
   service (Gumroad, Lemon Squeezy, Stripe Payment Links). Static hosting alone
   can't process payments securely.
4. **Student dashboard / member area / mock-exam system** — these require
   accounts and a backend. Reasonable options: Supabase or Firebase (auth +
   database) with the current front-end, or a full framework (Next.js) when
   complexity justifies a rewrite.
5. **AI tutor** — integrate via an API behind a small backend (never put API
   keys in client-side code).
6. **Analytics** — add a privacy-friendly script (Plausible, Fathom) or Google
   Analytics in the `<head>`.

When the app outgrows static hosting (real accounts, payments, dynamic data),
plan a migration to a framework + backend. Until then, this setup keeps things
fast, cheap, and simple.

---

## 9. Honest caveats — read before launch

A few things are deliberately **placeholders** and must be handled before you
go live:

- **Testimonials and statistics are fake placeholders.** `data/testimonials.json`
  contains sample testimonials and stat numbers set to `0`. **Do not publish
  these as if they were real.** Showing invented testimonials or made-up success
  numbers is misleading to visitors and can violate advertising/consumer-protection
  rules. Replace them with genuine, permissioned testimonials and real numbers —
  or remove the section until you have them. If you have no testimonials yet,
  it's better to delete the section than to fake it.
- **Photos are placeholders.** `assets/images/placeholder-hero.svg` and
  `placeholder-portrait.svg` should be replaced with real photos of Kushal.
  Export `og-image.svg` to a `.jpg`/`.png` for proper social sharing previews.
- **Links are placeholders.** Email (`hello@example.com`), social URLs
  (`/your-page`, `@your-handle`), and `example.com` canonical/OG URLs are
  examples. Search the project for `example.com`, `your-`, and `TODO` and
  replace them all.
- **Forms don't send yet** — see §6.

Everything marked with an HTML comment, `TODO`, `example.com`, `your-`, or a
`_comment` in JSON is something to review before launch.
