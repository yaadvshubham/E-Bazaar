/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — api.js
   Backend API Integration & Dynamic Rendering Engine
   Connects to http://localhost:5000 and enriches the frontend with
   live database products with cache-busting and case-insensitive matching.
   ═══════════════════════════════════════════════════════════════════════ */
var API_BASE = 'http://localhost:5000/api';
// Global state — backend products are merged into this
window.allProducts = [];
window._apiReady = false;

/* ─── Loader & Caching Utility ────────────────────────────────────────────────── */
function injectLoader() {
  if (document.getElementById('ebazaar-loader-overlay')) return;

  const style = document.createElement('style');
  style.id = 'ebazaar-loader-style';
  style.textContent = `
    #ebazaar-loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #FAF8F5;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      opacity: 0;
      visibility: hidden;
    }
    #ebazaar-loader-overlay.show {
      opacity: 1;
      visibility: visible;
    }
    html[data-theme="dark"] #ebazaar-loader-overlay {
      background: #12100e;
    }
    .loader-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .loader-logo {
      width: 72px;
      height: 72px;
      animation: pulseLogo 2s infinite ease-in-out;
    }
    .loader-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1612;
      margin: 12px 0 4px 0;
    }
    html[data-theme="dark"] .loader-title {
      color: #f3efe9;
    }
    .loader-tagline {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #685e53;
      margin: 0 0 24px 0;
      letter-spacing: 0.5px;
    }
    html[data-theme="dark"] .loader-tagline {
      color: #a89f95;
    }
    .loader-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(168, 140, 109, 0.2);
      border-top: 3px solid #A88C6D;
      border-radius: 50%;
      animation: spinLoader 0.8s linear infinite;
    }
    @keyframes spinLoader {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulseLogo {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'ebazaar-loader-overlay';
  overlay.innerHTML = `
    <div class="loader-content">
      <svg class="loader-logo" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loaderBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#A88C6D"/><stop offset="100%" stop-color="#856B4D"/>
          </linearGradient>
        </defs>
        <rect x="12" y="28" width="56" height="44" rx="7" fill="url(#loaderBagGrad)"/>
        <path d="M28 28V20C28 13.37 33.37 8 40 8C46.63 8 52 13.37 52 20V28" stroke="url(#loaderBagGrad)" stroke-width="6" fill="none"/>
      </svg>
      <h2 class="loader-title">E-Bazaar</h2>
      <p class="loader-tagline">Your everyday and everything store.</p>
      <div class="loader-spinner"></div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function showBrandedLoader() {
  injectLoader();
  const overlay = document.getElementById('ebazaar-loader-overlay');
  if (overlay) overlay.classList.add('show');
}

function hideBrandedLoader() {
  const overlay = document.getElementById('ebazaar-loader-overlay');
  if (overlay) overlay.classList.remove('show');
}

/* ─── Fetch Engine (With Client-Side SWR Caching & Loader) ───────────────────── */
async function fetchProductsFromNetwork() {
  const ts = new Date().getTime();
  const endpoints = [
    `http://127.0.0.1:5000/api/products?t=${ts}`,
    `http://localhost:5000/api/products?t=${ts}`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();
        let items = data.products || data;
        if (items && items.length > 0) return items;
      }
    } catch (err) {
      console.warn(`[E-Bazaar API] Connection attempt failed for ${url}`);
    }
  }
  return [];
}

async function fetchProducts() {
  const cacheKey = 'eb_products_cache';
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache expiry
  const ts = Date.now();

  let cachedData = null;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) cachedData = JSON.parse(raw);
  } catch (e) {
    console.warn('[E-Bazaar API] Failed to parse local storage cache:', e.message);
  }

  // If we have cached products, return them instantly
  if (cachedData && Array.isArray(cachedData.products) && cachedData.products.length > 0) {
    const age = ts - (cachedData.timestamp || 0);
    console.log(`[E-Bazaar API] Serving ${cachedData.products.length} products from cache (Age: ${Math.round(age/1000)}s)`);

    // SWR: If cache is stale (older than 5 minutes), revalidate in background
    if (age >= cacheExpiry) {
      console.log('[E-Bazaar API] Cache stale. Revalidating in background...');
      revalidateCacheBackground();
    }
    return cachedData.products;
  }

  // Cold load: Show branded loader, fetch synchronously
  showBrandedLoader();
  const startTime = Date.now();

  const items = await fetchProductsFromNetwork();

  if (items && items.length > 0) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        products: items
      }));
    } catch (e) {
      console.warn('[E-Bazaar API] Failed to write cache to local storage:', e.message);
    }
  }

  // Guarantee loader displays for at least 350ms to prevent visual flickering
  const elapsed = Date.now() - startTime;
  const delay = Math.max(0, 350 - elapsed);
  setTimeout(hideBrandedLoader, delay);

  return items;
}

async function revalidateCacheBackground() {
  try {
    const items = await fetchProductsFromNetwork();
    if (items && items.length > 0) {
      localStorage.setItem('eb_products_cache', JSON.stringify({
        timestamp: Date.now(),
        products: items
      }));
      mergeApiProducts(items);
      triggerUIReload();
      console.log('[E-Bazaar API] Background cache revalidation complete.');
    }
  } catch (err) {
    console.warn('[E-Bazaar API] Background revalidation failed:', err.message);
  }
}

function triggerUIReload() {
  const page = document.body.dataset.page;
  const path = window.location.pathname;

  if (page === 'category' || path.includes('category.html')) {
    if (typeof initDynamicCategory === 'function') initDynamicCategory();
  } else if (page === 'brand-store' || path.includes('brand-store.html')) {
    if (typeof initBrandStore === 'function') initBrandStore();
  } else if (page === 'product-detail' || path.includes('product-detail.html')) {
    if (typeof initProductDetail === 'function') initProductDetail();
  } else {
    if (typeof populateHomeTracks === 'function') populateHomeTracks();
  }
}

/* ─── Normalise a backend product → same shape as MASTER_PRODUCTS ─────────── */
function normaliseApiProduct(p) {
  return {
    id: `api_${p.id}`,
    title: p.title || 'Unnamed Product',
    name: p.title || 'Unnamed Product',
    description: p.description || '',
    price: Math.round(p.price || 0),
    originalPrice: Math.round(p.originalPrice || p.price || 0),
    discount: p.discount || '0%',
    rating: p.rating || 4.0,
    reviews: p.reviews || 0,
    sales: p.sales || null,
    brand: p.brand || 'Generic',
    category: (p.category || 'general').toLowerCase(),
    badge: p.badge || null,
    gstRate: p.gstRate || 0,
    image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
    imageUrl: p.imageUrl || p.image || null,
    _fromApi: true,
  };
}

/* ─── Merge backend products into global arrays ──────────────────────────── */
function mergeApiProducts(apiProducts) {
  const normalisedApiProducts = apiProducts.map(normaliseApiProduct);

  if (!window.MASTER_PRODUCTS) window.MASTER_PRODUCTS = [];

  const existingIds = new Set(window.MASTER_PRODUCTS.map(p => p.id));
  const newApiProducts = normalisedApiProducts.filter(p => !existingIds.has(p.id));

  window.MASTER_PRODUCTS.unshift(...newApiProducts);
  window.allProducts = [...window.MASTER_PRODUCTS];
  window._apiReady = true;
  console.log(`[E-Bazaar API] Merged ${newApiProducts.length} backend products. Total: ${window.MASTER_PRODUCTS.length}`);
}

/* ─── Apply URL Parameter Filtering (Case-Insensitive) ────────────────────── */
function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category') || params.get('cat');
  const brandParam = params.get('brand');
  const qParam = params.get('q');

  if (!catParam && !brandParam && !qParam) return null;

  let filtered = [...window.allProducts];

  if (qParam) {
    const qLower = qParam.trim().toLowerCase();
    filtered = filtered.filter(p =>
      (p.title || p.name || '').toLowerCase().includes(qLower) ||
      (p.brand || '').toLowerCase().includes(qLower) ||
      (p.category || '').toLowerCase().includes(qLower) ||
      (p.description || '').toLowerCase().includes(qLower)
    );
  }
  if (catParam) {
    const targetCat = catParam.trim().toLowerCase();
    filtered = filtered.filter(p =>
      (p.category || '').toLowerCase() === targetCat || targetCat === 'all'
    );
  }
  if (brandParam) {
    const targetBrand = brandParam.trim().toLowerCase();
    filtered = filtered.filter(p =>
      (p.brand || '').toLowerCase() === targetBrand
    );
  }

  let title = `Explore Catalog`;
  if (qParam) title = `Search Results for "${qParam}"`;
  else if (brandParam) title = `Brand Store: ${brandParam}`;
  else if (catParam) title = `Explore: ${catParam.charAt(0).toUpperCase() + catParam.slice(1)}`;

  return {
    products: filtered,
    catParam,
    brandParam,
    qParam,
    title,
  };
}

/* ─── Render a product grid ───────────────────────────────────────────────── */
// function renderProductGrid(products, containerId) {
//   const container = document.getElementById(containerId);
//   if (!container) return;
//   if (!products || products.length === 0) {
//     container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted)">
//       <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;opacity:.4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
//       <p style="font-size:16px;margin:0">No products found.</p>
//     </div>`;
//     return;
//   }
//   container.innerHTML = products.map(p => (window.buildCard ? window.buildCard(p) : '')).join('');
// }

/* ─── Update section titles ───────────────────────────────────────────────── */
function updatePageTitles(filterResult) {
  if (!filterResult) return;
  document.title = `${filterResult.title} — E-Bazaar`;

  const sectionTitle = document.querySelector('.cat-page-title, .section-title, [data-section-title]');
  if (sectionTitle) sectionTitle.textContent = filterResult.title;

  const bc = document.getElementById('bc-parent-cat');
  if (bc) bc.textContent = filterResult.title;
}

/* ─── Patch buildCard to support imageUrl and sales ──────────────────────── */
function patchBuildCard() {
  if (typeof buildCard !== 'function') return;
  const _orig = window._origBuildCard || buildCard;
  window._origBuildCard = _orig;

  window.buildCard = function (p) {
    if (!p.image && p.imageUrl) p.image = p.imageUrl;
    if (!p.image) p.image = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80';

    const card = _orig(p);
    if (p.sales) {
      return card.replace(
        /\$\{p\.sales\}k\+ bought in past month/,
        `${p.sales} in past month`
      );
    }
    return card.replace(
      /<div class="cat-transactions"[^>]*>[^<]*<\/div>/,
      ''
    );
  };
}

/* ─── Bootstrap ──────────────────────────────────────────────────────────── */
async function initApiEngine() {
  patchBuildCard();

  const apiProducts = await fetchProducts();

  if (apiProducts.length > 0) {
    mergeApiProducts(apiProducts);
  } else {
    console.info('[E-Bazaar API] Running with local data.');
    window.allProducts = [...(window.MASTER_PRODUCTS || [])];
    window._apiReady = true;
  }

  // Route-aware initialization to render products immediately without hard refreshes
  const page = document.body.dataset.page;
  const path = window.location.pathname;

  if (page === 'category' || path.includes('category.html')) {
    if (typeof initDynamicCategory === 'function') {
      initDynamicCategory();
    }
  } else if (page === 'brand-store' || path.includes('brand-store.html')) {
    if (typeof initBrandStore === 'function') {
      initBrandStore();
    }
  } else if (page === 'product-detail' || path.includes('product-detail.html')) {
    if (typeof initProductDetail === 'function') {
      initProductDetail();
    }
  } else {
    if (typeof populateHomeTracks === 'function') {
      populateHomeTracks();
    }
  }

  console.log(`[E-Bazaar API] Engine initialised. Ready: ${window._apiReady} | Products Pool Size: ${window.allProducts.length}`);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initApiEngine, 100);
});

function renderProducts(products) {
  // 1. Locate main container. Using #tr-trend as requested to replace trending items.
  const container = document.querySelector('#tr-trend');

  // 2. Add debugging logs
  console.log("Data reached render function:", products);
  console.log("Target container found:", container);

  if (!container) return;

  // 3. Clear hardcoded HTML
  container.innerHTML = '';

  // 4. Render product cards
  container.innerHTML = products.slice(0, 20).map(p => `
    <div class="product-card" style="border: 1px solid #e0e0e0; padding: 12px; border-radius: 8px; min-width: 200px;">
      <img src="${p.image || p.imageUrl || 'https://placehold.co/200x200'}" alt="${p.title}" style="width: 100%; height: 160px; object-fit: contain;">
      <h3 style="font-size: 14px; margin-top: 8px;">${p.title}</h3>
      <p style="font-weight: 700; color: #333;">₹${p.price}</p>
    </div>
  `).join('');
}
