# E-Bazaar: Your Everyday and Everything Store

E-Bazaar is a high-performance, modern, and aesthetically premium e-commerce platform built with an optimized Express.js backend and a beautiful, fully customized responsive frontend client. It is connected securely to a live Supabase PostgreSQL database via Sequelize ORM.

## Repository Reorganization & Structure

The codebase is organized cleanly into distinct, production-ready directories:

```
E-Bazaar/
├── Backend/                    # REST API Backend Service
│   ├── config/                 # Sequelize and database configurations
│   ├── middleware/             # Express middlewares (Authentication, etc.)
│   ├── models/                 # Sequelize ORM schema declarations (User, Product, etc.)
│   ├── routes/                 # Express REST endpoint routes (Auth, Products, Orders)
│   ├── seeders/                # Consolidate seeder scripts & CSV databases
│   │   ├── csv-seeder.js       # Main CSV product data feed seeder
│   │   ├── seeder.js           # Fallback Sequelize database seeder
│   │   ├── seed_supabase.js    # Direct Supabase JS Client product seeder
│   │   ├── api-scraper.js      # Live scraper / backup seeder
│   │   └── *.csv               # Raw CSV data feeds for various brands
│   ├── .env                    # Local environment config (git-ignored)
│   ├── package.json            # Backend dependencies & dev scripts
│   └── server.js               # Main API application entrypoint
│
├── Frontend/                   # Client-Side Application Assets
│   ├── css/                    # Modular page stylesheets
│   ├── js/                     # Client application script utilities (api.js, auth.js, script.js)
│   ├── images/                 # Optimized brand banners, logos, and UI icons
│   ├── index.html              # Home Page
│   ├── about-creator.html      # Creator Profile & Engineering Hurdles Page
│   ├── account.html            # User Account Settings
│   ├── auth.html               # Authentication (Login / Signup)
│   ├── cart.html               # Shopping Cart View
│   ├── category.html           # Product Catalog & Dynamic Filtering View
│   ├── deals.html              # Dynamic Deals Feed
│   ├── faq.html                # Frequently Asked Questions
│   ├── orders.html             # Order Tracking & Transactions Ledger
│   ├── payment.html            # Razorpay / Wallet payment checkout screen
│   ├── product-detail.html     # Product Details Page (PDP)
│   └── ...                     # Returns, FAQ, and Support policies
│
├── package.json                # Consolidated repository entry scripts
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation & Run

1. **Install Backend Dependencies**:
   Navigate to `/Backend` and run:
   ```bash
   npm install
   ```

2. **Configure Environment variables**:
   Create a `.env` file inside `/Backend` containing the following keys:
   ```env
   DATABASE_URL=your_supabase_postgres_url
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anonymous_key
   JWT_SECRET=your_custom_jwt_secret
   ```

3. **Launch Dev Server**:
   From the **root directory**, execute the consolidated delegation script:
   ```bash
   npm run dev
   ```
   The backend API service will boot successfully on `http://localhost:5000`.

### Database Seeding

To clear and rebuild the products catalog using the consolidated CSV brand directories, execute the following script from the root folder:
```bash
npm run seed:csv
```
This maps thousands of items (including grocer, clothing, tech, shoes, gadgets, and beauty products) securely across your Supabase tables.
