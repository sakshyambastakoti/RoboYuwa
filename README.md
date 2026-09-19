# RoboYuwa Official Website

Static website for RoboYuwa, a youth-driven NGO in Nepal focused on robotics, research, and innovation.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Current Structure

### Core pages

- `index.html`
- `about.html`
- `membership.html`
- `donate.html`
- `team.html`
- `contact.html`

### Legal pages

- `privacy-policy.html`
- `cookie-policy.html`
- `terms-of-service.html`

### Static resources

- `css/style.css` - global styles
- `js/script.js` - navigation, scroll effects, reveal animations
- `js/email-handler.js` - contact form integration via EmailJS
- `assets/` - images and branding assets used by the site

### Documentation

- `doc/RoboYuwa_NGO_Details.txt`
- `doc/roboyuwa extracted.txt`

## Run Locally

Serve the project root with any static web server.

### Option 1: Python

```bash
python -m http.server 8000
```

### Option 2: Node.js

```bash
npx serve
```

Then open `http://localhost:8000`.

## Contact Form Configuration

The contact form expects a project-root `.env` file for EmailJS values.

Required keys:

- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `FORWARD_TO_EMAIL`

## Notes on Repository Cleanup

- Removed one-off Python maintenance scripts that were not part of runtime.
- Removed orphaned, unreferenced images from `assets/`.
- Kept only files currently used by the website pages and scripts.

## Contact

- Email: `roboyuwa@gmail.com`
- Phone: `+977 9749464658`
- Location: Kathmandu, Nepal
