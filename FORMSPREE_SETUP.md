# Formspree Setup Guide — RoboYuwa

This guide explains how Formspree is integrated into the RoboYuwa website and how to manage it.

---

## What is Formspree?

[Formspree](https://formspree.io) is a zero-backend form service. When a user submits a form, their data is sent directly to Formspree's servers, which then forwards it to your configured email address. No server-side code or database is needed.

---

## Current Integration

| Form | Pages | Submissions sent to |
|---|---|---|
| Home Contact | `index.html` | Your Formspree dashboard + email |
| Executive Contact | `contact.html` | Your Formspree dashboard + email |
| Newsletter | All pages (footer) | Your Formspree dashboard + email |
| Membership Application | `membership.html` | Your Formspree dashboard + email |

**Endpoint in use:** `https://formspree.io/f/mqpaezbo`

All form submissions go to this single endpoint. The `form_type` field in each submission tells you which form it came from (e.g. `"Home Contact"`, `"Newsletter"`, `"Membership Application"`).

---

## How to View Submissions

1. Go to **[https://formspree.io](https://formspree.io)** and log in
2. Click your form (`mqpaezbo`) in the dashboard
3. All submissions appear in the **Submissions** tab
4. You can also configure email notifications under **Settings → Notifications**

---

## Changing the Endpoint

If you ever need to change the Formspree endpoint (e.g. new account or form), open:

```
js/formspree.js
```

Find line 8:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqpaezbo';
```

Replace `mqpaezbo` with your new form ID. **That's the only change needed** — all forms across all pages automatically use this constant.

---

## Creating a New Formspree Account (If Starting Fresh)

1. Go to **[https://formspree.io/register](https://formspree.io/register)**
2. Sign up with your email (e.g. `roboyuwa@gmail.com`)
3. Click **+ New Form**
4. Give it a name (e.g. "RoboYuwa Website")
5. Set the notification email where you want submissions sent
6. Copy the **Form ID** (the part after `/f/` in the endpoint URL)
7. Paste it into `js/formspree.js` as shown above

---

## Spam Protection (Recommended)

Formspree includes built-in spam filtering. For extra protection:

### Option A — reCAPTCHA (Formspree built-in)
In your Formspree dashboard → **Settings → Plugins** → enable **reCAPTCHA**. No code changes needed.

### Option B — Honeypot Field
Add a hidden field to any form to trick bots:

```html
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
```

Formspree automatically discards submissions where this field is filled (bots fill everything).

---

## Email Notification Setup

1. Log in at [formspree.io](https://formspree.io)
2. Select your form → **Settings**
3. Under **Email Notifications**, add `roboyuwa@gmail.com` (or any team email)
4. You can add multiple recipients
5. Customize the subject line if needed

---

## File Reference

| File | Purpose |
|---|---|
| [`js/formspree.js`](js/formspree.js) | Central Formspree handler — all form logic lives here |
| [`js/script.js`](js/script.js) | UI interactions (sliders, modals, theme) — form handling removed |
| `index.html` | Home contact form + footer newsletter |
| `contact.html` | Executive contact form + footer newsletter |
| `membership.html` | Membership application + footer newsletter |
| `about.html`, `team.html`, `donate.html`, `privacy-policy.html`, `terms-of-service.html`, `cookie-policy.html` | Footer newsletter only |

---

## Testing Forms Locally

Since Formspree requires HTTPS, **form submissions won't work when opening HTML files directly** from your filesystem (`file://` protocol). To test:

### Option 1 — Use VS Code Live Server
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Forms will work at `http://127.0.0.1:5500`

### Option 2 — Use Python HTTP Server
```bash
cd d:\RoboYuwa
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Option 3 — Deploy to GitHub Pages / Netlify
Push your code and test on the live URL. Formspree works on any HTTPS domain.

---

## Formspree Free Plan Limits

| Feature | Free Tier |
|---|---|
| Submissions/month | 50 |
| Forms | Unlimited |
| Email notifications | ✅ Yes |
| Spam filtering | ✅ Yes |
| File uploads | ❌ No |
| Custom redirect | ❌ No |

If you exceed 50 submissions/month, upgrade to **Gold ($16/mo)** for 1,000 submissions.

---

*Last updated: September 2026 — RoboYuwa Website v1.0*
