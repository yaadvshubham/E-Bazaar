# E-Bazaar Multi-Page Architecture & Redesign Plan

## Goal Description
To refactor the E-Bazaar storefront into a modular, production-grade, multi-page layout spread across the `Frontend/` directory. This includes enforcing the Luxury Minimalist Light Brown & Alabaster theme, implementing a "☰ All Categories" wide-width mega-panel, strict parameter-based routing, and dynamic data population using specific brand arrays.

## Proposed Changes

### 1. Theme Lock & Responsive Design (`css/styles.css`)
- **Colors**: Base Canvas: Alabaster (`#FAF8F5`); Headers/Cards: Crisp White (`#FFFFFF`); Text: Espresso Charcoal (`#2A2421`); Accent: Light Caramel/Sand Oak (`#A88C6D`); Borders: Faint sand-beige (`#EBE6DD`).
- **Responsive**: Touch-friendly swipe gestures for product tracks and a collapsible mobile navbar under 768px.

### 2. Navigation Architecture (`index.html`, `category.html`, etc.)
- **"☰ All Categories" Button**: Positioned on the far left of the main categories menu.
- **Wide Dropdown Modal**: On hover/click, displays a 950px–1050px wide mega panel centered relative to the navbar.
- **Internal Grid & Ribbon**: 8 columns for departments and a bottom horizontal ribbon displaying "Shop by Brand: Nike • Apple • Samsung • Levis • Zara • L'Oréal • Decathlon • Prestige" in a caramel highlight.
- **Static Menu Links**: Other links will be text-only (no emojis/icons) and will not open wide panels.

### 3. Dynamic Routing & Parameter Logic (`js/script.js`, `category.html`)
- All category links will strictly map to `category.html?cat=category-name`.
- `script.js` will read `?cat=` and dynamically update the page header, filter sidebar, and grid to match *only* the specific category without cross-contamination.

### 4. Expanded Category Brand Arrays (`js/script.js`)
- The data mapping arrays will be updated to explicitly use the requested 7-8 brands per category (e.g., Groceries: Amul, Nestle, Britannia, Tata, Mother Dairy, ITC, HUL).

### 5. Multi-Page Generation
- **`Frontend/index.html` & `Frontend/css/styles.css`**: Landing page with address modal ("Deliver to Aryan • New Delhi 110001"), animated hero carousel, and product grids.
- **`Frontend/category.html` & `Frontend/css/category.css`**: Sticky sidebar filter and dynamic 4-column product grid.
- **`Frontend/auth.html` & `Frontend/css/auth.css`**: Login/signup with toggleable OTP verification panel and mock countdown clock.
- **`Frontend/cart.html` & `Frontend/css/cart.css`**: Dual-column layout, quantity multipliers, summary pricing, coupon module.
- **`Frontend/orders.html` & `Frontend/css/orders.css`**: Order tracking with interactive horizontal timeline and return/exchange actions.
- **`Frontend/js/script.js`**: Central controller for the mega-panel, sliders, theme, and routing logic.

## User Review Required
> [!IMPORTANT]
> Please review this architectural plan. Once approved, I will begin writing and overriding the files in the `Frontend/` directory to meet these exact specifications.