# 🛒 E-Bazaar — Your Everyday & Everything Store

<div align="center">

![E-Bazaar Banner](https://img.shields.io/badge/E--Bazaar-E--Commerce%20Platform-00C853?style=for-the-badge&logo=shoppingcart&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM%20v6-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](#-progressive-web-app--performance)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](./package.json)

**A high-performance, full-stack, enterprise-grade e-commerce platform built with an optimized Express.js REST API backend and a responsive, vanilla-crafted frontend client.**

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Database Seeding](#-database-seeding--ingestion) • [API Documentation](#-api-documentation) • [Directory Structure](#-repository-structure)

</div>

---

## 📖 Overview

**E-Bazaar** is a modern full-stack e-commerce web application engineered to deliver a seamless shopping experience across thousands of products spanning groceries, electronics, apparel, beauty, home essentials, and gadgets.

Connected securely to a live **Supabase PostgreSQL** cloud instance via **Sequelize ORM**, E-Bazaar features real-time search and multi-criteria category filtering, secure JWT authentication, Razorpay gateway integration, an in-app digital wallet system, itemized order tracking, dynamic returns handling, automated cache-busting, and offline PWA support.

---

## ✨ Key Features

### 🛍️ Storefront & Product Engine
- **Multi-Brand Catalog & Smart Price Normalization**: Consolidates thousands of products across diverse categories (Groceries, Electronics, Clothing, Shoes, Sports, Home & Kitchen, Gadgets, Beauty). Automatically bounds and normalizes prices dynamically per category.
- **Dynamic Search & Dialect-Aware Filtering**: Implements case-insensitive search (`Op.iLike` on PostgreSQL, `Op.like` on SQLite fallback) across product titles, descriptions, and brand names.
- **Deals & New Arrivals Feeds**: Dedicated views for promotional discount deals (`isDeal`) and newest inventory drops (`isNew`).

### 🔒 Authentication & Account Management
- **JWT-Based Authentication**: Secure token authorization for protected account, cart, order, and wallet APIs.
- **Bcrypt Password Security**: Hashed user credentials with password strength validation and change password mechanisms.
- **User Profiles & Saved Addresses**: Manage account details, contact credentials, and default shipping addresses.

### 💳 Payments & In-App Digital Wallet
- **Razorpay Checkout Gateway**: Full sandbox order creation (`POST /api/orders/razorpay/create`) and HMAC-SHA256 signature verification (`POST /api/orders/razorpay/verify`).
- **E-Bazaar Digital Wallet**: Built-in virtual wallet enabling instant balance top-ups, wallet payments, and real-time transaction ledger (`WalletTransaction`).
- **Linked Bank Accounts**: Option to link bank credentials for seamless refund payouts and withdrawals.

### 📦 Order Logistics, Wishlist & Invoicing
- **End-to-End Order Tracking**: Real-time order tracking (`Processing` ➔ `Shipped` ➔ `Delivered` / `Cancelled`) with complete line item breakdowns.
- **Return & Refund System**: Structured return request submission and status dashboard (`return-report.html`).
- **Printable Invoices**: Dynamic HTML/SVG printable invoice generation (`invoice.html`) with order barcodes and VAT/tax breakdowns.
- **Wishlist Persistence**: Server-synced item wishlist (`WishlistItem`) with instant toggle controls.

### ⚡ Performance & PWA Optimization
- **Automated Cache Buster**: On server startup, `cacheBuster.js` automatically scans all HTML shells and injects dynamic version tags (`?v=timestamp`) into CSS and JS assets to prevent stale browser caches.
- **Progressive Web App (PWA)**: Includes a Service Worker (`sw.js`) and Web Application Manifest (`manifest.json`) for offline asset caching and mobile app installation.

### 🛠️ Flexible Data Ingestion & Scraping
- **CSV Brand Data Feed Import**: Multi-brand seeder pipeline capable of parsing thousands of catalog rows from structured CSV files (`csv-seeder.js`).
- **Direct Supabase & Sequelize Seeders**: Direct API seeding via Supabase JS Client (`seed_supabase.js`) or standard ORM models (`seeder.js`).
- **Automated Scraper Backup**: Puppeteer-powered real-time fallback product scraper (`api-scraper.js`).

---

## 🛠️ Tech Stack

### **Backend Service**
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/) (v4.19)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) hosted on [Supabase](https://supabase.com/), managed via [Sequelize ORM](https://sequelize.org/)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Payment Processing**: [Razorpay Node SDK](https://razorpay.com/)
- **Data Pipelines**: `csv-parser`, `puppeteer`, `@supabase/supabase-js`, `axios`

### **Frontend Client**
- **Core**: HTML5, Vanilla JavaScript (ES6+ Modular Utilities)
- **Styling**: Vanilla CSS3 (Custom design system with CSS custom properties, glassmorphism UI elements, dark/light aesthetics, responsive grids)
- **Offline / PWA**: Service Worker (`sw.js`), Web App Manifest (`manifest.json`)
- **Analytics**: `@vercel/analytics`

---

## 📁 Repository Structure

```
E-Bazaar/
├── Backend/                        # REST API Backend Service
│   ├── config/                     # Database & ORM configurations
│   │   └── database.js             # Sequelize PostgreSQL connection setup
│   ├── middleware/                 # Express Middleware
│   │   └── authMiddleware.js       # JWT Verification Middleware
│   ├── models/                     # Sequelize Database Schemas
│   │   ├── User.js                 # User credentials, profile & wallet balance
│   │   ├── Product.js              # Product catalog items & pricing engine
│   │   ├── Order.js                # Order details, status, & line items
│   │   ├── WalletTransaction.js    # In-app digital wallet transactions log
│   │   └── WishlistItem.js         # User saved wishlist items
│   ├── routes/                     # REST API Endpoints
│   │   ├── auth.js                 # Authentication, profile, wallet & wishlist routes
│   │   ├── products.js             # Catalog browsing, search & CRUD routes
│   │   └── orders.js               # Razorpay checkout, tracking & return routes
│   ├── seeders/                    # Data Ingestion & Seeding Engine
│   │   ├── csv-seeder.js           # Multi-brand CSV catalog importer
│   │   ├── seed_supabase.js        # Supabase Direct JS Client seeder
│   │   ├── seeder.js               # Fallback Sequelize seeder
│   │   ├── api-scraper.js          # Puppeteer automated product scraper
│   │   └── *.csv                   # Raw brand datasets (electronics, clothing, etc.)
│   ├── utils/                      # Helper Utilities
│   │   └── cacheBuster.js          # Automatic HTML asset cache buster script
│   ├── .env                        # Local Environment Config (git-ignored)
│   ├── package.json                # Backend dependencies & dev scripts
│   └── server.js                   # Application entrypoint & HTTP server
│
├── Frontend/                       # Responsive Client Web Application
│   ├── css/                        # Modular Stylesheets (Custom CSS Design System)
│   ├── js/                         # Client Utilities (api.js, auth.js, payment.js, script.js)
│   ├── images/                     # Brand logos, hero banners, UI assets
│   ├── index.html                  # Main Storefront & Hero Carousel
│   ├── auth.html                   # Login & Registration Portal
│   ├── category.html               # Product Browsing & Filtering View
│   ├── product-detail.html         # Product Details Page (PDP)
│   ├── cart.html                   # Shopping Cart Management
│   ├── payment.html                # Payment Gateway Checkout & Wallet Payout
│   ├── orders.html                 # Order History & Tracking Dashboard
│   ├── wishlist.html               # Saved Wishlist Items View
│   ├── account.html                # User Account & Wallet Settings
│   ├── invoice.html                # Dynamic Printable Order Invoice Generator
│   ├── return-report.html          # Order Returns & Refund Status Tracking
│   ├── deals.html                  # Dynamic Promotional Deals Feed
│   ├── brand-store.html            # Individual Brand Showcase Page
│   ├── brand-directory.html        # Multi-Brand Directory Index
│   ├── about-creator.html          # Creator Profile & Technical Architecture
│   ├── manifest.json               # Progressive Web App Manifest
│   └── sw.js                       # Service Worker for Offline Caching
│
├── package.json                    # Root task delegation & script workspace
└── README.md                       # Comprehensive Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher
- **PostgreSQL / Supabase Database**: A valid PostgreSQL connection URI.

### 1. Clone the Repository

```bash
git clone https://github.com/yaadvshubham/E-Bazaar.git
cd E-Bazaar
```

### 2. Install Dependencies

Install dependencies for both the root workspace and the Backend service:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd Backend
npm install
cd ..
```

### 3. Environment Variables Configuration

Create a `.env` file inside the `Backend/` directory:

```env
# Server Port
PORT=5000

# Database Configuration (Supabase / PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Payment Gateway (Razorpay Sandbox / Production)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Launch the Development Server

From the **root folder**, execute:

```bash
npm run dev
```

This will automatically execute the **Cache Buster** script and boot the Express server at **`http://localhost:5000`**.

---

## 🌾 Database Seeding & Ingestion

E-Bazaar includes multiple data ingestion strategies to populate your database:

### 1. CSV Brand Catalog Seeder (Recommended)
Imports product records from all brand CSV files inside `Backend/seeders/`:
```bash
npm run seed:csv
```

### 2. Direct Supabase JS Client Seeder
Seeds product data directly using `@supabase/supabase-js`:
```bash
npm run seed:supabase
```

### 3. Sequelize Fallback Seeder
Populates mock products via ORM models:
```bash
npm run seed
```

### 4. Real-Time Web Scraper
Runs Puppeteer to scrape live product listings into your database:
```bash
npm run scrape
```

---

## 🔌 API Documentation

### 🟢 Health & Statistics
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Server health check | ❌ |
| `GET` | `/api/stats` | Dynamic database & brand platform statistics | ❌ |

### 🛍️ Products Endpoint (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/products` | Get products with filtering (`category`, `brand`, `q`, `isDeal`, `isNew`) | ❌ |
| `GET` | `/api/products/:id` | Fetch single product details by ID | ❌ |
| `POST` | `/api/products` | Create a new product listing | 🔐 Admin |
| `PUT` | `/api/products/:id` | Update product details | 🔐 Admin |
| `DELETE` | `/api/products/:id` | Delete product listing | 🔐 Admin |

### 👤 Authentication & User Profile (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | 🔐 Yes |
| `PUT` | `/api/auth/profile` | Update account profile & address | 🔐 Yes |
| `PUT` | `/api/auth/change-password` | Update account password | 🔐 Yes |
| `GET` | `/api/auth/wallet` | Fetch wallet balance & transaction ledger | 🔐 Yes |
| `POST` | `/api/auth/wallet/add` | Top-up digital wallet funds | 🔐 Yes |
| `GET` | `/api/auth/wishlist` | Retrieve user wishlist items | 🔐 Yes |
| `POST` | `/api/auth/wishlist/toggle` | Add/Remove product from wishlist | 🔐 Yes |

### 📦 Orders & Payments (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/orders/razorpay/create` | Initialize Razorpay payment order session | 🔐 Yes |
| `POST` | `/api/orders/razorpay/verify` | Verify Razorpay payment signature & confirm order | 🔐 Yes |
| `POST` | `/api/orders` | Place direct COD / Wallet order | 🔐 Yes |
| `GET` | `/api/orders` | Fetch user order history | 🔐 Yes |
| `GET` | `/api/orders/:id` | Get tracking & details for specific order | 🔐 Yes |
| `PUT` | `/api/orders/:id/cancel` | Cancel active order | 🔐 Yes |
| `POST` | `/api/orders/:id/return` | Submit item return & refund request | 🔐 Yes |

---

## 💻 Available Scripts

Run these scripts from the **root directory**:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs Cache Buster utility and starts server with Nodemon live reload |
| `npm start` | Runs Cache Buster utility and starts production Node server |
| `npm run cache-bust` | Executes HTML asset versioning manually |
| `npm run seed:csv` | Executes CSV product data importer pipeline |
| `npm run seed:supabase` | Executes direct Supabase JS API seeder |
| `npm run seed` | Executes default Sequelize database seeder |
| `npm run scrape` | Executes Puppeteer web scraper pipeline |

---

## ⚡ Progressive Web App & Offline Support

E-Bazaar is designed to work offline or under weak network conditions:
- **Service Worker (`sw.js`)**: Caches static assets (HTML, CSS, JavaScript, icons) using a network-first fallback strategy.
- **Web App Manifest (`manifest.json`)**: Configures stand-alone mobile installation, custom app icons, theme color scheme (`#00c853`), and splash screen settings.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [Issues Page](https://github.com/yaadvshubham/E-Bazaar/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License & Author

Distributed under the **ISC License**. See `package.json` for more details.

**Author**: **Shubham Yadav**
- GitHub: [@yaadvshubham](https://github.com/yaadvshubham)

---

<div align="center">
  <sub>Built with ❤️ by Shubham Yadav for E-Bazaar</sub>
</div>
