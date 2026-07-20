/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — api.js
   Backend API Integration & Dynamic Rendering Engine
   Connects to http://localhost:5000 and enriches the frontend with
   live database products while preserving all existing functionality.
   ═══════════════════════════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:5000/api';

// Global state — backend products are merged into this
window.allProducts = [];
window._apiReady = false;

/* ─── Fetch Engine ────────────────────────────────────────────────────────── */
async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams({ limit: 200, ...params }).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    console.warn('[E-Bazaar API] Fetch failed, using local data:', err.message);
    return [];
  }
}

/* ─── Normalise a backend product → same shape as MASTER_PRODUCTS ─────────── */
function normaliseApiProduct(p) {
  return {
    id:            `api_${p.id}`,
    title:         p.title         || 'Unnamed Product',
    description:   p.description   || '',
    price:         p.price         || 0,
    originalPrice: p.originalPrice || p.price,
    discount:      p.discount      || '0%',
    rating:        p.rating        || 4.0,
    reviews:       p.reviews       || 0,
    sales:         p.sales         || null,   // real value — no more "undefinedk+"
    brand:         p.brand         || 'Generic',
    category:      p.category      || 'general',
    badge:         p.badge         || null,
    image:         p.imageUrl      || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
    imageUrl:      p.imageUrl      || null,
    _fromApi:      true,
  };
}

/* ─── Merge backend products into the global MASTER_PRODUCTS array ─────────── */
function mergeApiProducts(apiProducts) {
  const normalisedApiProducts = apiProducts.map(normaliseApiProduct);

  // De-duplicate: keep existing local products, prepend API products
  const existingIds = new Set(MASTER_PRODUCTS.map(p => p.id));
  const newApiProducts = normalisedApiProducts.filter(p => !existingIds.has(p.id));

  // Prepend API products so they appear first in all grids
  MASTER_PRODUCTS.unshift(...newApiProducts);
  window.allProducts = [...MASTER_PRODUCTS];
  window._apiReady = true;
  console.log(`[E-Bazaar API] Merged ${newApiProducts.length} backend products. Total: ${MASTER_PRODUCTS.length}`);
}

/* ─── Apply URL Parameter Filtering ──────────────────────────────────────── */
function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const catParam   = params.get('category') || params.get('cat');
  const brandParam = params.get('brand');

  if (!catParam && !brandParam) return null;

  let filtered = [...window.allProducts];

  if (catParam) {
    filtered = filtered.filter(p =>
      (p.category || '').toLowerCase() === catParam.toLowerCase()
    );
  }
  if (brandParam) {
    filtered = filtered.filter(p =>
      (p.brand || '').toLowerCase() === brandParam.toLowerCase()
    );
  }

  return {
    products: filtered,
    catParam,
    brandParam,
    title: brandParam
      ? `Brand Store: ${brandParam}`
      : `Explore: ${catParam.charAt(0).toUpperCase() + catParam.slice(1)}`,
  };
}

/* ─── Render a product grid from API/local data ───────────────────────────── */
function renderProductGrid(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!products || products.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted)">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;opacity:.4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <p style="font-size:16px;margin:0">No products found.</p>
    </div>`;
    return;
  }
  container.innerHTML = products.map(p => buildCard(p)).join('');
}

/* ─── Update section titles for URL-filtered pages ───────────────────────── */
function updatePageTitles(filterResult) {
  if (!filterResult) return;

  // <title> tag
  document.title = `${filterResult.title} — E-Bazaar`;

  // h1 / section headings that are on category / brand-store pages
  const sectionTitle = document.querySelector('.cat-page-title, .section-title, [data-section-title]');
  if (sectionTitle) sectionTitle.textContent = filterResult.title;

  // Breadcrumb
  const bc = document.getElementById('bc-parent-cat');
  if (bc) bc.textContent = filterResult.title;
}

/* ─── Patch populateHomeTracks to use real API data once loaded ───────────── */
function patchHomeTracksWithApiData() {
  if (document.body.dataset.page === 'category') return;

  const nr = document.getElementById('tr-new');
  if (nr) {
    const apiProds = window.allProducts.filter(p => p._fromApi || p.badge === 'new');
    const mixed = [...apiProds, ...MASTER_PRODUCTS.filter(p => !p._fromApi)]
      .sort(() => 0.5 - Math.random()).slice(0, 36);
    nr.innerHTML = mixed.map(buildCard).join('');
  }

  const tr = document.getElementById('tr-trend');
  if (tr) {
    const trendCats = ['electronics', 'gadgets', 'smartphones', 'laptops', 'fashion'];
    const api = window.allProducts.filter(p => trendCats.includes(p.category));
    const local = MASTER_PRODUCTS.filter(p => !p._fromApi && trendCats.includes(p.category));
    const combined = [...api, ...local].sort(() => 0.5 - Math.random()).slice(0, 36);
    tr.innerHTML = combined.map(buildCard).join('');
  }

  ['row1', 'row2', 'row3'].forEach((k, i) => {
    const el = document.getElementById(`disc-row-${i + 1}`);
    if (!el) return;
    const catMaps = [
      ['electronics', 'gadgets', 'smartphones', 'laptops'],
      ['fashion', 'shoes', 'mens-shirts', 'womens-dresses'],
      ['groceries', 'appliances', 'electronics'],
    ];
    const prods = window.allProducts
      .filter(p => catMaps[i].includes(p.category))
      .sort(() => 0.5 - Math.random())
      .slice(0, 36);
    el.innerHTML = (prods.length > 0 ? prods : window.allProducts.sort(() => 0.5 - Math.random())).slice(0, 36).map(buildCard).join('');
  });
}

/* ─── Fix buildCard to support both `image` and `imageUrl` fields ──────────── 
   Also fixes the "undefinedk+ bought" bug in transactions line.               */
function patchBuildCard() {
  const _orig = window._origBuildCard || buildCard;
  window._origBuildCard = _orig;

  // Override the global buildCard
  window.buildCard = function(p) {
    // Ensure image field is always set (backend uses imageUrl, local uses image)
    if (!p.image && p.imageUrl) p.image = p.imageUrl;
    if (!p.image) p.image = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80';

    // Build the card using the original function (now p.image is always valid)
    const card = _orig(p);

    // Fix "undefinedk+ bought" — replace with real `sales` value or hide if null
    if (p.sales) {
      // Backend provides full string like "5k+ sold"
      return card.replace(
        /\$\{p\.sales\}k\+ bought in past month/,
        `${p.sales} in past month`
      );
    }
    // If no sales data, strip the transactions div entirely
    return card.replace(
      /<div class="cat-transactions"[^>]*>[^<]*<\/div>/,
      ''
    );
  };
}

/* ─── Bootstrap — called after DOMContentLoaded ──────────────────────────── */
async function initApiEngine() {
  // Patch buildCard first (sync, safe to do before fetch)
  patchBuildCard();

  // Fetch backend products
  const apiProducts = await fetchProducts();

  if (apiProducts.length > 0) {
    mergeApiProducts(apiProducts);

    // Re-render home tracks with live API data
    patchHomeTracksWithApiData();

    // Handle URL-based filtering (used by nav links like ?category=electronics)
    const filterResult = applyUrlFilters();
    if (filterResult) {
      updatePageTitles(filterResult);

      // If we're on a filtered URL but NOT the category page, render a grid
      if (document.body.dataset.page !== 'category') {
        const grid = document.querySelector('.products-grid, #main-cat-grid, #tr-new, #tr-trend');
        if (grid) {
          grid.innerHTML = filterResult.products.map(p => window.buildCard(p)).join('');
        }
      }
    }

    // If we're on the category page, refresh it with merged data
    if (document.body.dataset.page === 'category') {
      const urlParams = new URLSearchParams(window.location.search);
      const catId = urlParams.get('cat') || 'clothing';
      if (window.currentCategoryProducts) {
        // Inject matching API products into the category product pool
        const apiForCat = apiProducts
          .map(normaliseApiProduct)
          .filter(p => p.category === catId || catId === 'all');
        if (apiForCat.length > 0) {
          window.currentCategoryProducts = [...apiForCat, ...window.currentCategoryProducts];
          // Trigger a re-render via the existing pagination system
          window.currentPage = 1;
          if (typeof renderFilteredProducts === 'function') renderFilteredProducts();
        }
      }
    }

    // Toast success notification (subtle, only in dev)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[E-Bazaar API] ✅ ${apiProducts.length} live products loaded from backend.`);
    }
  } else {
    console.info('[E-Bazaar API] Backend unavailable — running in offline mode with local data.');
    window.allProducts = [...MASTER_PRODUCTS];
  }
}

// Auto-init after DOMContentLoaded (append to existing boot sequence)
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to let the main script.js DOMContentLoaded handler run first
  setTimeout(initApiEngine, 100);
});
