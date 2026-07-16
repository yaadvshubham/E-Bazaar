# Comprehensive Refactoring & Multi-Page Integration Plan

## Goal Description
Implement a complete logical review to fix routing, resolve category-to-product mappings, add a "Show All Categories" mega-panel, and generate 3 new stable pages (`auth.html`, `cart.html`, `orders.html`). All designs will strictly adhere to the Luxury Minimalist Light Brown & Alabaster theme.

## Proposed Changes

### 1. Navigation Bar & Mega Panel (`styles.css`, `index.html`, `category.html`, `script.js`)
- **"Show All Categories" Button:** Placed at the far-left of the subnav with a clean grid/menu icon.
- **Wide-Width Mega Panel:** On hover/click, this button will open a centered 1050px-wide panel showcasing a clean 4-column matrix of all 8 departments.
- **Brand Ribbon:** At the bottom of the mega panel, a horizontal strip will display "Popular Partner Brands" (Nike, Apple, etc.) in a caramel highlight color.
- **Header Links:** Cart icon points to `cart.html`, Orders points to `orders.html`, Account points to `auth.html`.

### 2. Strict Routing & Dynamic Category Population (`js/script.js`, `category.html`, `category.css`)
- **URL Standardization:** All category links will strictly use `category.html?cat=category_name`.
- **Dynamic Handlers:** `category.html` will interpret the `?cat=` query. The filter sidebar will dynamically swap out options (e.g., Apple/Samsung for electronics, Summer/Winter for clothing) and the product grid will match accurately.
- **Cross-page Consistency:** The dynamic generator logic will power both the index page carousels and the category grids.

### 3. Authentication Gateway (`auth.html`, `css/auth.css`)
- **Dual-State Container:** Smooth slider transition between Login and Sign Up.
- **Components:** Forgot password triggers, OTP input states, and resend timers.

### 4. Cart & Checkout (`cart.html`, `css/cart.css`)
- **Layout:** Two-column design (Left: Cart Items; Right: Order Breakdown).
- **Features:** Quantity incrementor/decrementor buttons, promo code application UI.

### 5. Order Dashboard (`orders.html`, `css/orders.css`)
- **Active Orders:** Step-by-step progress tracking (Placed -> Shipped -> Out for Delivery -> Delivered).
- **History:** Order history cards with functional-looking "Request Return/Exchange" buttons.

## User Review Required
> [!IMPORTANT]
> Please review this structure. Once approved, I will sequentially generate and update all 11 files (`index.html`, `styles.css`, `script.js`, `category.html`, `category.css`, `auth.html`, `auth.css`, `cart.html`, `cart.css`, `orders.html`, `orders.css`).