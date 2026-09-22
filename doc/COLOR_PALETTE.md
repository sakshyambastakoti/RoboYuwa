# RoboYuwa Design System — Official Brand Color Palette

> **Brand Identity Guide:** This document defines the official digital color palette for the **RoboYuwa** platform, derived directly from the official brand emblem ([`assets/roboyuwa-logo-BLCCIWUS.jpg`](file:///d:/RoboYuwa/assets/roboyuwa-logo-BLCCIWUS.jpg)).

---

## 1. Brand Color Philosophy

The RoboYuwa logo represents the synthesis of **youth passion**, **mechanical engineering**, and **technological leadership** in Nepal:

- **RoboYuwa Crimson Red:** Extracted from the tools (wrench, screwdriver) and the *"YUWA"* typography. Symbolizes youth energy, Nepal's national flag crimson, hardware power, and momentum.
- **Industrial Obsidian Black:** Extracted from the central fist, mechanical gear, and the *"ROBO"* typography. Symbolizes structural stability, embedded systems, microcontrollers, and engineering discipline.
- **Precision White & Platinum:** Extracted from the negative space and backdrop. Symbolizes ethics, transparency, precision engineering, and visual clarity.
- **Circuit Amber / Electric Gold:** Complementary accent representing electrical conductivity, soldering sparks, and youth optimism (used for eyebrows, video play buttons, and warm call-to-actions).
- **Mission Sage Green:** Derived from sustainable community impact, grants, and committed funds.

---

## 2. Palette Specification Table

| Color Role | Color Name | Preview | HEX | RGB | HSL | Primary Use Case |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Primary Brand** | RoboYuwa Crimson | 🔴 | `#E52525` | `rgb(229, 37, 37)` | `hsl(0, 78%, 52%)` | Primary brand CTAs, active states, key highlights |
| **Primary Dark** | Deep Maroon Red | 🍷 | `#A31010` | `rgb(163, 16, 16)` | `hsl(0, 82%, 35%)` | Button hover states, active borders, dark accents |
| **Primary Glow** | Scarlet Spark | 💥 | `#FF3B30` | `rgb(255, 59, 48)` | `hsl(3, 100%, 59%)` | Status indicator pulses, micro-animation glows |
| **Dark Canvas** | Obsidian Black | ⚫ | `#08090C` | `rgb(8, 9, 12)` | `hsl(225, 20%, 4%)` | Hero background, dark vignette base, footer |
| **Surface Dark** | Carbon Surface | ⬛ | `#12141A` | `rgb(18, 20, 26)` | `hsl(225, 18%, 9%)` | Sticky frosted navbar, modal cards, dialog surfaces |
| **Dark Border** | Steel Charcoal | 🔲 | `#222631` | `rgb(34, 38, 49)` | `hsl(224, 18%, 16%)` | Dark mode dividers, input borders, card outlines |
| **Accent Gold** | Circuit Amber | 🟡 | `#E59819` | `rgb(229, 152, 25)` | `hsl(37, 82%, 50%)` | Eyebrow subtitles, play button rings, pill buttons |
| **Accent Hover** | Electric Gold | ☀️ | `#F5A623` | `rgb(245, 166, 35)` | `hsl(37, 90%, 55%)` | Pill button hover gradients, warm rim highlights |
| **Impact Accent** | Mission Sage | 🟢 | `#376856` | `rgb(55, 104, 86)` | `hsl(158, 31%, 31%)` | Committed funds card, impact metrics, grants |
| **Impact Dark** | Deep Forest Sage | 🌲 | `#274E40` | `rgb(39, 78, 64)` | `hsl(158, 33%, 23%)` | Impact card hover state, success highlights |
| **Canvas Light** | Pure White | ⚪ | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | Typography on dark, logo framing badge, cards |
| **Background Light** | Platinum Soft Gray | ◽ | `#F6F8FA` | `rgb(246, 248, 250)` | `hsl(210, 20%, 97%)` | Alternate section background, table zebra striping |
| **Text Muted** | Slate Gray | 🔘 | `#8C93A3` | `rgb(140, 147, 163)` | `hsl(222, 12%, 59%)` | Secondary copy, metadata, timestamps, subtitles |

---

## 3. UI Component Mapping

```
                               ┌────────────────────────┐
                               │     ROBOYUWA UI        │
                               └───────────┬────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────────────┬─────────────────┐
         ▼                  ▼                            ▼                 ▼
   [NAVIGATION]       [HERO SECTION]               [IMPACT CARD]     [LIGHT SECTIONS]
  Background:        Background: #08090C          Background:       Background: #F6F8FA
  rgba(12,12,14,0.9) Title: #FFFFFF               #376856 (Sage)    Cards: #FFFFFF
  Logo Ring: #E59819 Eyebrow: #E59819 (Amber)     Icon: #FFFFFF     Text: #222631
  Pill CTA: #E59819  Pill CTA: Amber Gradient     Stat: #FFFFFF     Accent: #E52525 (Red)
```

### Detailed Component Roles:
1. **Buttons & Actions:**
   - **Primary Action (Join/Donate):** Amber gradient (`linear-gradient(135deg, #E59819 0%, #CB8412 100%)`) with white text and gold elevation shadow.
   - **Secondary Video Action:** Transparent background with `#FFFFFF` border, `#FFFFFF` play icon, hover transition to `#E59819`.
   - **Community / Partner CTAs:** RoboYuwa Crimson (`#E52525`) with deep red hover (`#A31010`).

2. **Header & Navigation:**
   - **Top Utility Bar:** Semi-transparent Obsidian (`rgba(10, 10, 10, 0.75)`) with `#E59819` icons and white social links.
   - **Navbar:** Transparent on hero, transitioning to frosted carbon (`rgba(12, 12, 14, 0.92)`) with a 1px `#222631` bottom border upon scroll.
   - **Logo Presentation:** Official emblem enclosed in a `#FFFFFF` circular badge with a 2px `#E59819` glowing ring.

3. **Typography:**
   - **Serif Headings (Playfair Display):** Pure White (`#FFFFFF`) on dark surfaces; Obsidian Black (`#08090C`) on light sections.
   - **Italic Eyebrows:** Circuit Amber (`#E59819`) for warmth and contrast.
   - **Body Text:** Light muted slate (`rgba(255, 255, 255, 0.85)`) on dark mode; Slate Gray (`#4A4F5C`) on light mode.

---

## 4. Ready-to-Use CSS Design Tokens

Copy and paste these tokens into [`css/style.css`](file:///d:/RoboYuwa/css/style.css):

```css
:root {
    /* -------------------------------------------------------------
       RoboYuwa Logo Core Identity
       ------------------------------------------------------------- */
    --ry-crimson: #E52525;
    --ry-crimson-dark: #A31010;
    --ry-crimson-glow: #FF3B30;
    --ry-crimson-gradient: linear-gradient(135deg, #FF2E2E 0%, #B31414 100%);
    --ry-crimson-subtle: rgba(229, 37, 37, 0.12);

    /* -------------------------------------------------------------
       Industrial Dark & Surface Hierarchy
       ------------------------------------------------------------- */
    --ry-dark-bg: #08090C;
    --ry-dark-surface: #12141A;
    --ry-dark-surface-glass: rgba(18, 20, 26, 0.88);
    --ry-dark-border: #222631;
    --ry-dark-text-muted: #8C93A3;

    /* -------------------------------------------------------------
       Circuit Amber & Warm Accent
       ------------------------------------------------------------- */
    --ry-amber: #E59819;
    --ry-amber-hover: #F5A623;
    --ry-amber-dark: #CB8412;
    --ry-amber-gradient: linear-gradient(135deg, #F5A623 0%, #CB8412 100%);
    --ry-amber-glow: rgba(229, 152, 25, 0.4);

    /* -------------------------------------------------------------
       Mission Impact Sage
       ------------------------------------------------------------- */
    --ry-sage: #376856;
    --ry-sage-dark: #274E40;
    --ry-sage-subtle: rgba(55, 104, 86, 0.15);

    /* -------------------------------------------------------------
       Canvas Light Mode
       ------------------------------------------------------------- */
    --ry-white: #FFFFFF;
    --ry-platinum: #F6F8FA;
    --ry-slate-text: #3D424F;

    /* -------------------------------------------------------------
       Semantic Aliases
       ------------------------------------------------------------- */
    --primary-color: var(--ry-crimson);
    --primary-gradient: var(--ry-crimson-gradient);
    --amber-500: var(--ry-amber);
    --amber-600: var(--ry-amber-dark);
    --amber-gradient: var(--ry-amber-gradient);
    --sage-card: var(--ry-sage);
    --sage-dark: var(--ry-sage-dark);
}
```

---

## 5. Accessibility & Contrast Standards (WCAG 2.1)

| Foreground Color | Background Color | Contrast Ratio | WCAG Compliance Level | Recommended Usage |
| :--- | :--- | :---: | :---: | :--- |
| **Pure White (`#FFFFFF`)** | Obsidian Black (`#08090C`) | **19.8 : 1** | **AAA** | Headings, hero display titles, nav links |
| **Circuit Amber (`#E59819`)** | Obsidian Black (`#08090C`) | **8.4 : 1** | **AAA** | Eyebrow subtitles, badges, icons |
| **Pure White (`#FFFFFF`)** | RoboYuwa Crimson (`#E52525`) | **4.9 : 1** | **AA** (Large & UI text) | Primary CTA buttons, badges |
| **Pure White (`#FFFFFF`)** | Mission Sage (`#376856`) | **5.4 : 1** | **AA** (All text) | Committed funds amount, card copy |
| **Obsidian Black (`#08090C`)** | Platinum Soft Gray (`#F6F8FA`) | **18.2 : 1** | **AAA** | Body copy in light mode sections |

---

## 6. Design Best Practices

- ✅ **Do** keep the logo framed in a clean white circular badge to ensure the black fist and red tools stand out on dark transparent navigation bars.
- ✅ **Do** pair the **Playfair Display** serif display headings with pure white on dark backgrounds for a modern premium feel.
- ✅ **Do** use **Circuit Amber** for small-to-medium accent elements (subtitles, star icons, outline circles) to prevent visual fatigue.
- ❌ **Don't** place red text directly on pure black without checking contrast; use white headings and reserve red for buttons, borders, and active highlights.
- ❌ **Don't** mix more than two gradient styles in the same viewport.
