# E-Bazaar Homepage — Production Rewrite Plan

Full architectural overhaul of the single-file `index.html` into a clean, modular 3-file
structure inside `Frontend/`. Zero external UI frameworks. Native HTML5 + CSS3 + Vanilla JS.

---

## Proposed File Structure

```
Frontend/
├── index.html          ← Semantic HTML shell, links external CSS + JS
├── css/
│   └── styles.css      ← All root variables, layouts, components, animations
└── js/
    └── script.js       ← Dark mode engine, slider, modal, cart, wishlist, toasts
```

---

## Proposed Changes

### 1. Frontend/index.html  [MODIFY → overwrite]
- Clean semantic shell: `<head>` links to `css/styles.css` and `js/script.js`
- **Navbar (top row):** Logo · Multi-Address widget (left) · Search bar (center) · Dark-mode toggle + Account + Orders + Wishlist + Cart (right)
- **Navbar (sub-row):** "All Categories" mega-menu trigger + subnav quick links
- **Mega-menu columns:** Shoes (with Nike/Adidas/Campus/Comet/Puma/NB brand row), Electronics (Apple/Samsung/Vivo/Mi/Oppo/Nothing), Gadgets (Philips/LG/Sony), Clothing (Levi's/U.S. Polo/Zara)
- **Hero Slider:** 4–5 slides with dots + arrows
- **Trust Strip:** 4-column guarantees
- **New Releases** horizontal track (8 cards)
- **Promo Grid:** 2-column editorial banners
- **Trending Products** horizontal track (8 cards)
- **"You May Also Like"** — 3 independently scrollable dense rows, 10 cards each
- **Explore Brands** — 6-tile grid with brand logos
- **Footer** — 5-column + newsletter + payment chips
- **Address Modal** — centered overlay with address list + add form
- **Back-to-top button** + Toast notification

### 2. Frontend/css/styles.css  [NEW]
- **`:root` light theme** — Canvas `#FFFFFF`/`#FAF8F5`, text `#111111`, accent `#8C6239`, borders `#EAE6E1`
- **`[data-theme="dark"]` overrides** — Obsidian `#121212` bg, cream `#FAF8F5` text, charcoal borders `#2C2A28`
- CSS custom property transitions on `html` element for smooth theme switching
- All layout: navbar, hero, tracks, grid, modal, footer, back-to-top
- Micro-animations: hover lifts, button ripples, modal fade-in/scale, track scroll fade-edges
- Brand logo containers with hover border highlight
- Dark-mode toggle switch (pill/thumb design)
- Responsive breakpoints: 1200 / 960 / 768 / 520px

### 3. Frontend/js/script.js  [NEW]
- **Dark mode engine** — reads `localStorage`, applies `data-theme` on `<html>`, syncs toggle state on page load
- **Hero slider** — 4-slide auto-advance (5s interval), pause-on-hover, touch swipe, dot sync, arrow controls, click-to-redirect
- **Address modal** — open/close/backdrop-click, "Add New Address" inline form reveal, focus trap
- **Track scroll arrows** — smooth `scrollBy` per track
- **Wishlist toggle** — per-card heart state, toast notification
- **Add to Cart** — badge counter increment, toast
- **Newsletter form** — submit handler with toast
- **Back-to-top** — scroll listener, smooth scroll

---

## Open Questions

> [!IMPORTANT]
> **Brand logo sourcing**: The mega-menu requires logos for Nike, Adidas, Campus, Comet, Puma, New Balance, Apple, Samsung, Vivo, Mi, Oppo, Nothing, Philips, LG, Sony, Levi's, U.S. Polo Assn, and Zara. Since CDN image URLs can break, I'll use **clean inline SVG wordmarks** for all brands — this guarantees zero broken images and maintains design consistency. Is this acceptable, or do you have specific image URLs?

> [!NOTE]
> The existing `index.html` (v1) will be **completely overwritten**. All styling will move to `css/styles.css` and all JavaScript to `js/script.js`.

---

## Verification Plan

### Automated
- File existence check for all 3 files post-creation
- Grep for key tokens: `data-theme`, `initSlider`, `openAddressModal`, brand names

### Manual (user)
- Open `Frontend/index.html` in browser
- Toggle dark mode — verify smooth transition, localStorage persistence on reload
- Click delivery address widget — verify modal opens/closes correctly
- Verify hero slider auto-advances and responds to dots/arrows/swipe
- Scroll "You May Also Like" rows independently
- Hover mega-menu and verify brand sub-rows render
