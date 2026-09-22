@# RoboYuwa Website — Complete Professional Audit & Implementation Plan

## Project Summary

**Architecture:** Static HTML/CSS/JS website deployed on Vercel  
**Pages:** 8 public pages (Home, About, Contact, Donate, Membership, Team, Privacy Policy, Terms of Service, Cookie Policy)  
**Assets:** 39 original images (26 MB), 341 optimized variants (40 MB), 3 testimonial images  
**CSS:** Single 244 KB stylesheet (`style.css`) — 10,795 lines  
**JS:** 4 files (51 KB total) — `script.js`, `formspree.js`, `email-handler.js`, `legal-suite.js`  
**External Services:** Google Fonts, Formspree, EmailJS, FontAwesome (via `zenithkandel.com.np`)  
**Deployment:** Vercel (with GitHub Pages workflow also configured)

---

## Audit Findings — Prioritized by Severity

---

### 🔴 CRITICAL — Must Fix

| # | Problem | Location | Why It Matters | Solution |
|---|---------|----------|---------------|----------|
| C1 | **`.env` file fetched client-side, exposing secrets** | [email-handler.js](file:///d:/RoboYuwa/js/email-handler.js#L2-L20) | `loadEnv()` fetches `.env` via HTTP. Even though `.env` contains placeholder values now, this pattern would expose real API keys to any browser. `.gitignore` blocks commit but Vercel may serve it. | Remove `email-handler.js` entirely — form handling is already done via Formspree in `formspree.js`. If EmailJS is needed in future, hardcode the public key directly (it's designed to be public) instead of fetching `.env`. |
| C2 | **No `robots.txt`** | Root directory | Search engines get no crawling directives. Some bots may index the `.env` path, legal pages excessively, or asset directories. | Create `/robots.txt` with proper directives. |
| C3 | **No `sitemap.xml`** | Root directory | Major SEO gap — search engines can't efficiently discover all pages, reducing indexing coverage. | Create `/sitemap.xml` with all 8 public page URLs. |
| C4 | **No Open Graph / Twitter Card metadata on ANY page** | All 8 HTML `<head>` sections | Social media shares show plain URLs with no preview image, title, or description. This drastically hurts link sharing engagement. | Add `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` to every page. |
| C5 | **No canonical URLs on any page** | All HTML `<head>` sections | Duplicate content risk — each page exists at both `/about` and `/about.html` (Vercel cleanUrls handles it, but search engines need canonical guidance). Root `.html` duplicates also exist. | Add `<link rel="canonical">` to every page. |
| C6 | **Duplicate HTML files** — every page exists as both `about.html` AND `about/index.html` (identical copies) | Root directory | 8 duplicate files bloating the repo, confusing deploys, and risk content divergence. | Delete root-level `.html` duplicates (`about.html`, `contact.html`, etc.). Vercel's `cleanUrls: true` + subdirectory `index.html` files already handle routing. |
| C7 | **Hero slider uses unoptimized original images (up to 3.7 MB each!)** | [index.html L120-197](file:///d:/RoboYuwa/index.html#L120-L197) | Hero slides 1–4 use raw original images (`flex-pcb-dfm-checks-featured-img.jpg` 549KB, `Top-10-PCB-Design.jpg` 114KB, `IMG_1869.JPG.jpeg` 1.7MB, `IMG_2016.JPG (1).jpeg` 3.7MB). These are **the LCP elements** and kill performance. | Replace with optimized `<picture>` elements using the existing AVIF/WebP variants from `/assets/optimized/`. Use `fetchpriority="high"` only on slide 1, `loading="lazy"` on others. |
| C8 | **EmailJS CDN loaded on every page** (including non-contact pages) | [index.html L1412](file:///d:/RoboYuwa/index.html#L1412) | EmailJS library (23KB+ JS) loads on homepage where it's never used. `email-handler.js` is also loaded but never fires (no `#contact-form` element on home page). Both block the main thread. | Remove EmailJS CDN `<script>` and `email-handler.js` from pages that don't use them. Or remove entirely since Formspree handles all forms now. |

---

### 🟠 HIGH — Significant UX/Performance Impact

| # | Problem | Location | Why It Matters | Solution |
|---|---------|----------|---------------|----------|
| H1 | **CSS file is 244 KB (10,795 lines)** — single monolithic file | [style.css](file:///d:/RoboYuwa/css/style.css) | All pages load the entire stylesheet, including page-specific styles for donate, membership, team, legal pages, etc. This is render-blocking. | While splitting into multiple files would be ideal long-term, for now: add critical inline CSS for above-the-fold, and verify page-specific styles in `<style>` blocks on donate/membership pages don't duplicate styles in style.css. |
| H2 | **Massive inline `<style>` blocks** in donate.html and membership.html | [donate/index.html L15+](file:///d:/RoboYuwa/donate/index.html#L15), [membership/index.html L15+](file:///d:/RoboYuwa/membership/index.html#L15) | These pages embed thousands of lines of CSS inline in `<style>` tags *in addition to* loading the full 244 KB `style.css`. This doubles the CSS payload for those pages. | Move page-specific styles into the main `style.css` or separate page CSS files. Remove duplication. |
| H3 | **FontAwesome loaded via third-party JS from `zenithkandel.com.np`** | All HTML `<head>` sections | Single-point-of-failure on a third-party domain. If `zenithkandel.com.np` goes down, ALL icons disappear. Also JS-based icon loading causes FOUT and blocks rendering. | This is a dependency risk. Add `crossorigin` and `integrity` attributes if available, or preconnect to the domain. Consider migrating to official FontAwesome CDN or self-hosting. Flag for owner review. |
| H4 | **Google Fonts loads 12+ font weight/style combinations** | All HTML `<head>` sections | Loading `Inter:wght@300;400;500;600;700` (5 weights) + `Playfair Display` with 7 ital/weight combos = significant font payload. Some weights (300, 800) may not be used. | Audit actual usage and reduce to only needed weights. Add `font-display: swap` preload hint for critical font weights. |
| H5 | **~24 MB of unused original images** in `/assets/` root | [assets/](file:///d:/RoboYuwa/assets) | 34 of 39 original images are unused in any HTML file. These bloat the repo and deployment. | Remove unused originals (keep only the 5 referenced ones and the optimized directory). |
| H6 | **Hero images missing `width` and `height` attributes** | [index.html L120-197](file:///d:/RoboYuwa/index.html#L120-L197) | Hero slide `<img>` tags lack explicit dimensions, causing layout shifts (CLS) as images load. | Add `width` and `height` attributes to all hero images. |
| H7 | **Contact page meta description is copy-pasted from About page** | [contact/index.html L9](file:///d:/RoboYuwa/contact/index.html#L9) | Says "Learn more about RoboYuwa..." instead of describing the contact page. Duplicate meta descriptions hurt SEO. | Write unique, accurate meta descriptions for every page. |
| H8 | **Theme flicker (FOUT) on non-home pages** | Only contact page has early theme script | The theme toggle defaults to light mode in `script.js` DOMContentLoaded. On pages without the early `<script>` block, users see a flash from default to their saved theme. Only `contact/index.html` has the early theme script. | Add the early theme-detection `<script>` consistently to all pages' `<body>` tags. |

---

### 🟡 MEDIUM — Production Quality Issues

| # | Problem | Location | Why It Matters | Solution |
|---|---------|----------|---------------|----------|
| M1 | **No 404 page** | Missing | Users hitting invalid URLs see Vercel's default 404. | Create a branded `404.html` page. |
| M2 | **No structured data (JSON-LD)** | All pages | No Organization, WebSite, or BreadcrumbList schema. Missing structured data for Google rich results. | Add JSON-LD structured data to homepage (Organization + WebSite) and breadcrumbs on inner pages. |
| M3 | **Security headers missing** | [vercel.json](file:///d:/RoboYuwa/vercel.json) | No `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, or `Content-Security-Policy` headers. | Add security headers in `vercel.json`. |
| M4 | **No `prefers-reduced-motion` in donate/membership page-specific styles** | Inline `<style>` blocks in those pages | Only the main `style.css` has reduced motion. Page-specific animations in inline styles don't respect it. | Ensure all animation styles respect `prefers-reduced-motion`. |
| M5 | **Inconsistent theme script placement** | Various pages | Some pages have early theme scripts, most don't. Dark mode toggle exists but flash is inconsistent. | Standardize the early theme detection script across all pages. |
| M6 | **Multiple `<h1>` tags possible** on home page | [index.html](file:///d:/RoboYuwa/index.html) | Each hero slide has an `<h1>`. Only one `<h1>` should exist per page for proper heading hierarchy. | Change non-active slide headings to `<h2>` or use `aria-hidden` approach, keeping only the first slide's heading as `<h1>`. |
| M7 | **GitHub Pages deploy workflow exists alongside Vercel** | [static.yml](file:///d:/RoboYuwa/.github/workflows/static.yml) | Confusing dual-deployment setup. Could accidentally serve from GitHub Pages too. | Remove GitHub Pages workflow if Vercel is the primary deployment. |
| M8 | **`onsubmit="return false;"` on newsletter form** | [index.html L1346](file:///d:/RoboYuwa/index.html#L1346) | Inline event handler — inconsistent with the JS-based handling pattern used everywhere else. | Remove inline handler; JS already handles submit prevention. |
| M9 | **Unused optimized images prefixed `unused-`** | [assets/optimized/](file:///d:/RoboYuwa/assets/optimized) | ~18 files with "unused-" prefix (homepage, lab-visual, whatsapp-misc, workshop-alt variants) wasting space. | Delete `unused-*` files from optimized directory. |
| M10 | **Inconsistent dark-mode theme detection** | [contact/index.html L22](file:///d:/RoboYuwa/contact/index.html#L22) | Contact page checks for `'light'` theme, but `script.js` defaults to `'light'`. The early script should check for `'dark'` to add dark class. | Fix the early script to check for `dark` theme: `if (localStorage.getItem('roboyuwa-theme') === 'dark') { document.body.classList.add('dark-theme'); }` |

---

### 🟢 LOW — Polish & Cleanup

| # | Problem | Location | Why It Matters | Solution |
|---|---------|----------|---------------|----------|
| L1 | Social links to `https://twitter.com` and `https://youtube.com` (generic, not actual accounts) | Multiple pages header/footer | Dead/generic links reduce trust. | Update with actual RoboYuwa accounts or remove if not available. |
| L2 | Doc files (PDFs, 22+ MB) in repository | [doc/](file:///d:/RoboYuwa/doc) | Bloats git repo. PDFs aren't served to users. | Move to cloud storage or Git LFS if needed. |
| L3 | CSS has inconsistent breakpoints (576, 600, 640, 768, 860, 991, 1024, 1120) | `style.css` media queries | 8 different breakpoint values make responsive behavior hard to reason about. | Standardize where possible (not a rewrite — just note for future). |
| L4 | `WhatsApp Image` and `IMG_` filenames with spaces/parens | `/assets/` originals | Bad URL encoding and messy file naming. | Already handled by optimized variants; just cleanup originals if kept. |
| L5 | `testimonials` directory misspelled as `testomonials` | [assets/testomonials/](file:///d:/RoboYuwa/assets/testomonials) | Not referenced in code, appears unused. | Delete if unused, or rename if needed later. |

---

## Proposed Implementation Plan

### Phase 1: Security & Critical Fixes

#### [DELETE] Root-level duplicate HTML files
Remove: `about.html`, `contact.html`, `cookie-policy.html`, `donate.html`, `membership.html`, `privacy-policy.html`, `team.html`, `terms-of-service.html`

#### [DELETE] [email-handler.js](file:///d:/RoboYuwa/js/email-handler.js)
Remove this file — it fetches `.env` client-side (security risk) and is superseded by `formspree.js`.

#### [MODIFY] All HTML files — Remove EmailJS CDN and email-handler.js references
Remove `<script>` tags for EmailJS CDN and `email-handler.js` from all pages.

#### [MODIFY] [vercel.json](file:///d:/RoboYuwa/vercel.json) — Add security headers
Add `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`.

---

### Phase 2: SEO & Metadata

#### [NEW] [robots.txt](file:///d:/RoboYuwa/robots.txt)
Standard robots.txt with sitemap reference.

#### [NEW] [sitemap.xml](file:///d:/RoboYuwa/sitemap.xml)
XML sitemap with all 8 public page URLs.

#### [MODIFY] All 8 HTML pages — Add SEO metadata
- Canonical URLs
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter Card tags
- JSON-LD structured data (Organization on homepage, breadcrumbs on inner pages)
- Fix duplicate/incorrect meta descriptions (contact page)
- Fix multiple `<h1>` tags on homepage

---

### Phase 3: Performance — Images & Loading

#### [MODIFY] [index.html](file:///d:/RoboYuwa/index.html) — Hero slider images
Replace raw original images with optimized `<picture>` elements (AVIF/WebP/fallback). Add explicit `width`/`height` to prevent CLS.

#### [DELETE] Unused original images from `/assets/`
Remove ~34 unused originals (~24 MB saved from deployment).

#### [DELETE] Unused optimized images (`unused-*` prefix)
Remove ~18 `unused-*` files from `/assets/optimized/`.

---

### Phase 4: Theme & UX Consistency

#### [MODIFY] All HTML pages — Add early theme detection script
Add consistent `<script>` block after `<body>` tag on every page to prevent theme flash.

#### [MODIFY] Google Fonts loading — Reduce weights
Audit and remove unused font weights. Add `font-display: swap` preload for critical weights.

#### [MODIFY] All pages — Remove `email-handler.js` and EmailJS script references

---

### Phase 5: Deployment & Cleanup

#### [NEW] [404.html](file:///d:/RoboYuwa/404.html)
Branded 404 error page.

#### [DELETE] [.github/workflows/static.yml](file:///d:/RoboYuwa/.github/workflows/static.yml)
Remove GitHub Pages workflow (Vercel is primary).

#### [MODIFY] Newsletter form — Remove inline `onsubmit`

---

## Verification Plan

### Automated Checks
- Verify all pages load without errors (manually visit each route)
- Check no console errors
- Verify no broken links
- Check all images load
- Verify form submissions work

### Manual Verification
- Test responsive layout at 320px, 375px, 768px, 1024px, 1440px, 1920px
- Verify dark mode toggle works consistently
- Verify mobile menu works
- Test all navigation links
- Test contact form submission
- Verify no horizontal scroll at any viewport

> [!IMPORTANT]
> **Estimated impact:** Removing the 4 unoptimized hero images alone should save 5.5 MB of initial page load. Adding SEO metadata fixes critical indexing gaps. Security header additions address OWASP best practices.

> [!WARNING]
> **FontAwesome dependency on `zenithkandel.com.np`:** This is a third-party risk I cannot fix automatically — it requires you to decide whether to migrate to official FontAwesome CDN or self-host. I will flag this but not change it.

## Open Questions

> [!IMPORTANT]
> 1. **FontAwesome hosting:** The icon library is loaded from `zenithkandel.com.np`. Should I migrate to the official FontAwesome CDN, or is this an intentional setup? Changing this could break icon display if the kit has custom icons.
> 2. **Social media links:** Twitter and YouTube links point to generic homepage URLs. Do you have actual RoboYuwa accounts for these platforms? If not, should they be removed?
> 3. **GitHub Pages workflow:** Should I delete the GitHub Pages deploy workflow, or do you still use GitHub Pages alongside Vercel?
> 4. **Document PDFs in `/doc/`:** These are 22+ MB of PDFs in the git repo. Should they be removed from the repo, or do they need to remain?
