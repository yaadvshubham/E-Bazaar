# Refactoring E-Bazaar Architecture & Styling

We will refactor the directory to fix styling anomalies, adjust the core aesthetic to a premium Light Brown & Alabaster theme, clean up layout logic, remove icon/emoji clutter from drop-downs, and fully implement dynamic multi-page navigation.

## Proposed Changes

### Global Styling (`css/styles.css`)
- **Theme Variables:** Replace the dark/espresso light theme with a Warm Alabaster/Off-White (`#FAF8F5`) base, Crisp White (`#FFFFFF`) nav, Soft Warm Charcoal (`#2A2421`) text, and Soft Sand Oak (`#A88C6D`) accent.
- **Product Card Backgrounds:** Set product cards to a soft neutral tint (`#F4F1EA`).
- **Transitions:** Update all hover, theme, and layout transitions to use a standard `0.3s ease-in-out` curve.
- **Dropdown Redesign:** Refactor `.mega-drop` from a 100% viewport mega-menu to compact (max-width: 280px), floating cards positioned directly below each parent menu item.

### HTML Layout (`index.html` & `category.html`)
- **Navigation Menu:**
  - Remove all emojis from category names (e.g., "🛒 Groceries" -> "Groceries").
  - Update href targets to dynamic parameters: `category.html?cat=groceries`.
- **Dropdown Contents:**
  - Replace complex matrix layouts with a clean, single-column vertical list of text-based links for the specific 7-8 premium brands as requested.
- **Layout Consistency:** Ensure `category.html` breadcrumbs and layouts match the new simplified structure.

### Category CSS (`css/category.css`)
- Align category page styling (sidebar, product grid) with the new Alabaster & Light Caramel theme.
- Ensure the sticky filter sidebar and product cards match the 0.3s transition and correct background tints.

### JavaScript Logic (`js/script.js`)
- **Dynamic Routing:** Add URL query parsing logic (`new URLSearchParams(window.location.search)`).
- **Dynamic Rendering:** When `category.html` loads, read the `cat` parameter to:
  1. Dynamically update the page `<title>` (e.g., "Electronics Showcase").
  2. Update the breadcrumbs text.
  3. Re-render the product grid by filtering the mock products dataset to only include items relevant to the selected category.
  4. Ensure category cross-contamination does not happen.

## User Review Required

> [!WARNING]
> Please review this plan. Once approved, I will immediately begin rewriting all 5 files (`index.html`, `styles.css`, `script.js`, `category.html`, `category.css`) to implement these changes.