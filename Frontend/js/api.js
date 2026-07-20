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

/* ─── Fetch Engine ────────────────────────────────────────────────────────── */
async function fetchProducts() {
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

/* ─── Normalise a backend product → same shape as MASTER_PRODUCTS ─────────── */
function normaliseApiProduct(p) {
  return {
    id: `api_${p.id}`,
    title: p.title || 'Unnamed Product',
    name: p.title || 'Unnamed Product',
    description: p.description || '',
    price: p.price || 0,
    originalPrice: p.originalPrice || p.price,
    discount: p.discount || '0%',
    rating: p.rating || 4.0,
    reviews: p.reviews || 0,
    sales: p.sales || null,
    brand: p.brand || 'Generic',
    category: (p.category || 'general').toLowerCase(),
    badge: p.badge || null,
    image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
    imageUrl: p.imageUrl || p.image || null,
    _fromApi: true,
  };
}

/* ─── Merge backend products into global arrays ──────────────────────────── */
function mergeApiProducts(apiProducts) {
  const normalisedApiProducts = apiProducts.map(normaliseApiProduct);

  if (!window.MASTER_PRODUCTS) window.MASTER_PRODUCTS = [];

  const existingIds = new Set(MASTER_PRODUCTS.map(p => p.id));
  const newApiProducts = normalisedApiProducts.filter(p => !existingIds.has(p.id));

  MASTER_PRODUCTS.unshift(...newApiProducts);
  window.allProducts = [...MASTER_PRODUCTS];
  window._apiReady = true;
  console.log(`[E-Bazaar API] Merged ${newApiProducts.length} backend products. Total: ${MASTER_PRODUCTS.length}`);
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

    // Add renderProducts call for testing as requested
    // renderProducts(apiProducts);

    // Re-initialize home page tracks if on index.html
    if (typeof populateHomeTracks === 'function' && document.body.dataset.page !== 'category') {
      populateHomeTracks();
    }

    // If on category page or brand store page, trigger refresh
    if (document.body.dataset.page === 'category' || window.location.pathname.includes('category.html')) {
      if (typeof initDynamicCategory === 'function') {
        initDynamicCategory();
      }
    } else if (document.body.dataset.page === 'brand-store' || window.location.pathname.includes('brand-store.html')) {
      if (typeof initBrandStore === 'function') {
        initBrandStore();
      }
    }

    console.log(`[E-Bazaar API] ✅ ${apiProducts.length} live products loaded from backend.`);
  } else {
    console.info('[E-Bazaar API] Running with local data.');
    window.allProducts = [...(window.MASTER_PRODUCTS || [])];
  }
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
