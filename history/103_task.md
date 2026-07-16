# E-Bazaar Architecture Refactoring Tasks

- `[/]` Refactor `css/styles.css`
  - Implement Light Brown & Alabaster theme variables
  - Update dropdown CSS to floating compact cards
  - Standardize 0.3s transitions
- `[ ]` Refactor `index.html`
  - Remove emojis from navigation
  - Update nav links to `category.html?cat=...`
  - Update dropdown HTML to simple vertical lists of brands
- `[ ]` Refactor `category.html`
  - Remove emojis
  - Ensure layout matches new aesthetic
- `[ ]` Refactor `css/category.css`
  - Match theme variables and new layout rules
- `[ ]` Refactor `js/script.js`
  - Add dynamic routing logic on `DOMContentLoaded`
  - Parse URL params, filter mock product data
  - Update page title and breadcrumbs dynamically
