# E-Bazaar — Full Multi-Page Production Rewrite

Complete refactor into a decoupled 7-file production structure with premium theme
refinement, hamburger mobile nav, expanded mega-menu, and 3 new pages.

---

## Color System Change

| Role | Old | New |
|---|---|---|
| Navbar/Header bg | `#111111` (near black) | **Deep Espresso Brown `#1C1613`** |
| Sub-nav bg | `#1C1A18` | **Rich Cocoa `#261F1C`** |
| Footer bg | `#0D0B09` | **`#1C1613`** |
| Dark mode bg | `#121212` | **Obsidian Cocoa `#15110F`** |
| Dark mode panels | `#1E1C1A` | **`#1C1613`** |
| Accent (buttons) | `#8C6B3A` | **Burnished Caramel `#8C6239`** |
| Body text | `#111111` | **Deep Espresso `#231B17`** |
| Borders | `#EAE6E1` | **`#EDEAE6`** |

---

## File Output Map

```
Frontend/
├── index.html          ← Updated (warm palette, hamburger nav, new mega-menu)
├── category.html       ← NEW (4-col grid + sticky filter panel)
├── orders.html         ← NEW (order tracker + history + return flow)
├── css/
│   ├── styles.css      ← Updated (new color tokens, hamburger CSS, no pitch-black)
│   ├── category.css    ← NEW
│   └── orders.css      ← NEW
└── js/
    └── script.js       ← Updated (hamburger, mega-menu hover, cross-page state)
```

---

## Proposed Changes

### Shared Design System (styles.css)

#### [MODIFY] styles.css
- Replace all `#111111` / `#0D0B09` / `#1C1A18` with `#1C1613` / `#261F1C`
- Add hamburger menu CSS: `.hamburger`, `.mobile-drawer`, `.drawer-overlay`
- Add mobile breakpoints for all track widths and grid layouts
- Touch-swipe support declarative CSS for tracks

---

### Homepage (index.html + styles.css)

#### [MODIFY] index.html
- Replace `<nav-sub>` hard-coded categories with 8 ordered categories:
  Groceries → Electronics → Gadgets → Clothing → Shoes → Beauty → Sports → Home & Kitchen
- Each mega-menu tab gets **7–8 brand chips** with SVG wordmarks
- Add hamburger button `<button id="hamburger">` in nav-top right
- Add mobile drawer `<nav id="mobile-drawer">` after header
- Clothing tab gets sub-links: Men / Women / Unisex / Innerwear / Summer / Winter
- All existing sections preserved: hero slider, trust strip, tracks, promo grid,
  discovery feed, brands grid, footer, address modal

---

### Catalog Page (category.html + category.css)

#### [NEW] category.html
- `<head>` links `css/styles.css` + `css/category.css` + `js/script.js`
- **Left sidebar** (sticky, 280px): Price range slider, Brand checkboxes, Size grid,
  Season/Variant filter accordion, Rating filter
- **Right grid** (4-col): Product cards with tags (`Loyalty Wave Off Active`, `20% Off`)
- Breadcrumb trail, sort dropdown, result count badge
- Mobile: sidebar collapses into filter drawer via button

#### [NEW] category.css
- Left panel `.filter-panel` sticky positioning
- Price range `input[type=range]` custom dual-thumb styles
- 4-col → 2-col → 1-col responsive grid
- Filter tag chips, accordion expand/collapse
- Mobile filter drawer overlay

---

### Orders Page (orders.html + orders.css)

#### [NEW] orders.html
- `<head>` links `css/styles.css` + `css/orders.css` + `js/script.js`
- **Active Orders** section: 2 mock order cards with progress tracker
  `Order Placed → Packed → Shipped → Out for Delivery → Delivered`
- **Visual timeline**: horizontal step bar with animated active step indicator
- **Past Orders / Invoice history**: tabulated list with invoice download CTA
- **Return/Exchange flow**: modal triggered by "Request Return" button with
  reason selector, item selection, and pickup date picker

#### [NEW] orders.css
- Tracker step bar with connector lines and pulse animation on active step
- Order card layout with product thumbnail, meta, actions
- Return modal multi-step wizard
- Responsive single-column stacking

---

### Central Engine (script.js)

#### [MODIFY] script.js
- Add `initHamburger()` — toggle `.open` on `#mobile-drawer`, lock body scroll
- Add `initMegaHover()` — hover over subnav links switches active mega panel
  via opacity + pointer-events (smooth CSS transition)
- Update `ThemeEngine` color token names to match new palette vars
- Add `initCategoryFilters()` — price slider, brand checkbox state, filter tag
  removal, result count update (mock)
- Add `initOrderTracker()` — animate order progress steps on page load,
  handle return modal open/close/wizard steps
- Cross-page: `localStorage` preserves cart count + theme across all pages

---

## Open Questions

> [!NOTE]
> **Brand SVG logos**: All 56 brand logos (8 per category × 7 categories) will use
> clean inline SVG wordmarks / text logos — zero external image dependencies.
> Official pixel-perfect SVG paths would require downloading brand assets (not feasible here).

> [!IMPORTANT]
> **Dual-thumb price slider**: Native HTML `<input type="range">` does not support
> dual handles. I will implement a clean CSS+JS custom range slider for the
> category filter panel.

---

## Verification Plan

### Automated
- File existence + size check for all 7 files
- Grep for key tokens: `#1C1613`, `hamburger`, `initHamburger`, `filter-panel`,
  `.tracker-step`, `openReturnModal`

### Manual (user)
1. Open `index.html` → confirm warm espresso navbar (no pitch black)
2. Resize to < 768px → hamburger button appears, drawer opens on click
3. Hover each of 8 mega-menu categories → panel switches with smooth animation
4. Open `category.html` → 4-col grid, filter sidebar sticky, price slider works
5. Open `orders.html` → tracker steps animate, return modal opens
6. Toggle dark mode on any page → all pages honor espresso-cocoa dark theme
