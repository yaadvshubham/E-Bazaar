/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — script.js  v4
   Central Engine: Theme · Slider · Hamburger · Mega-Menu · Category Dynamic
   ═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════════════════
   THEME ENGINE — Dark / Light with localStorage
   ═══════════════════════════════════════════════════════════════════════ */
const ThemeEngine = (() => {
  const KEY  = 'eb-theme';
  const root = document.documentElement;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggle() {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (prefersDark ? 'dark' : 'light'));
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init, toggle };
})();

/* ═══════════════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
   ═══════════════════════════════════════════════════════════════════════ */
let _toastTimer;
function showToast(msg, duration = 2800) {
  const el  = document.getElementById('toast');
  const txt = document.getElementById('toast-msg');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO SLIDER
   ═══════════════════════════════════════════════════════════════════════ */
const HeroSlider = (() => {
  let current = 0, timer = null;
  let track, slides, dots;

  function goTo(n) {
    const total = slides.length;
    current = ((n % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      const a = i === current;
      d.classList.toggle('active', a);
      d.setAttribute('aria-selected', String(a));
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetAuto() {
    clearInterval(timer);
    timer = setInterval(next, 5200);
  }

  function initSwipe() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    let startX = 0;
    hero.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) { diff > 0 ? next() : prev(); resetAuto(); }
    });
  }

  function init() {
    track  = document.getElementById('heroTrack');
    slides = document.querySelectorAll('.hero-slide');
    dots   = document.querySelectorAll('.s-dot');
    if (!track || !slides.length) return;

    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); resetAuto(); }));

    const btnNext = document.getElementById('sNext');
    const btnPrev = document.getElementById('sPrev');
    if (btnNext) btnNext.addEventListener('click', () => { next(); resetAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); resetAuto(); });

    slides.forEach(slide => {
      slide.addEventListener('click', e => {
        if (!e.target.closest('.hero-cta,.s-arr,.s-dot,.slider-arrows,.slider-dots') && slide.dataset.href)
          window.location.href = slide.dataset.href;
      });
    });

    const hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(timer));
      hero.addEventListener('mouseleave', resetAuto);
    }

    initSwipe();
    resetAuto();
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════════════
   HAMBURGER MOBILE NAV
   ═══════════════════════════════════════════════════════════════════════ */
function initHamburger() {
  const btn     = document.getElementById('hamburger');
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn= document.getElementById('drawer-close');
  if (!btn || !drawer) return;

  function open() {
    btn.classList.add('open');
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  if (overlay) overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close on escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ═══════════════════════════════════════════════════════════════════════
   MEGA-MENU
   ═══════════════════════════════════════════════════════════════════════ */
function initMegaMenu() {
  const items = document.querySelectorAll('.mega-item');
  let activeItem = null;
  let closeTimer = null;

  function activate(item) {
    if (activeItem && activeItem !== item) deactivate(activeItem);
    item.classList.add('active');
    item.querySelector('> a')?.setAttribute('aria-expanded','true');
    activeItem = item;
  }
  function deactivate(item) {
    item.classList.remove('active');
    item.querySelector('> a')?.setAttribute('aria-expanded','false');
    if (activeItem === item) activeItem = null;
  }

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      activate(item);
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => deactivate(item), 250);
    });
    const drop = item.querySelector('.mega-drop');
    if (drop) {
      drop.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      drop.addEventListener('mouseleave', () => {
        closeTimer = setTimeout(() => deactivate(item), 250);
      });
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   ADDRESS MODAL
   ═══════════════════════════════════════════════════════════════════════ */
const AddressModal = (() => {
  function open() {
    const overlay = document.getElementById('addr-modal');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    const overlay = document.getElementById('addr-modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hideAddForm();
  }
  function showAddForm() {
    const form = document.getElementById('new-addr-form');
    const btn  = document.getElementById('add-addr-btn');
    if (form) form.classList.add('visible');
    if (btn)  btn.style.display = 'none';
  }
  function hideAddForm() {
    const form = document.getElementById('new-addr-form');
    const btn  = document.getElementById('add-addr-btn');
    if (form) { form.classList.remove('visible'); form.reset?.(); }
    if (btn)  btn.style.display = '';
  }

  function init() {
    const trigger = document.getElementById('addr-trigger');
    if (trigger) trigger.addEventListener('click', open);

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const overlay = document.getElementById('addr-modal');
    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    const addBtn = document.getElementById('add-addr-btn');
    if (addBtn) addBtn.addEventListener('click', showAddForm);

    const cancelBtn = document.getElementById('addr-form-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', hideAddForm);

    document.querySelectorAll('.set-default-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const clicked = btn.closest('.addr-item');
        if (!clicked) return;
        document.querySelectorAll('.addr-item').forEach(item => {
          item.classList.remove('is-default');
          const t = item.querySelector('.addr-type');
          if (t) t.textContent = item.dataset.type || 'Address';
        });
        clicked.classList.add('is-default');
        const typeEl = clicked.querySelector('.addr-type');
        if (typeEl) typeEl.textContent = (clicked.dataset.type || 'Address') + ' ✓';
        showToast('✅ Default address updated');
      });
    });

    const form = document.getElementById('new-addr-form');
    if (form) form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('🏠 New address saved!');
      hideAddForm();
    });
  }

  return { init, open, close };
})();

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT DATA & DYNAMIC ROUTING (Category Page)
   ═══════════════════════════════════════════════════════════════════════ */

const CATEGORY_MAP = {
  'groceries': { title: 'Groceries', brands: ['Amul','Nestle','Britannia','Tata','MotherDairy','ITC','HUL'] },
  'electronics': { title: 'Electronics Showcase', brands: ['Apple','Samsung','Sony','OnePlus','Xiaomi','Vivo','Nothing'] },
  'gadgets': { title: 'Gadgets', brands: ['Philips','LG','Boat','JBL','Noise','Boult','Logitech'] },
  'clothing': { title: 'Clothing Collection', brands: ['Levis','Zara','HM','Tommy','USPolo','AllenSolly'] },
  'shoes': { title: 'Shoes', brands: ['Nike','Adidas','Campus','Puma','Comet','NewBalance','Reebok'] },
  'beauty': { title: 'Beauty', brands: ['LOreal','Maybelline','Nykaa','MAC','Cetaphil','Mamaearth'] },
  'sports': { title: 'Sports', brands: ['Decathlon','Yonex','Cosco','Nivia','Speedo','Spalding'] },
  'home-kitchen': { title: 'Home & Kitchen', brands: ['Prestige','Hawkins','Pigeon','Milton','Borosil','Bajaj'] },
  'all': { title: 'All Products', brands: ['Nike', 'Apple', 'Zara', 'Sony', 'Puma'] }
};

// Mock product generator based on category parameters
function generateMockProductsForCategory(catId) {
  const products = [];
  const categoryData = CATEGORY_MAP[catId] || CATEGORY_MAP['all'];
  const brands = categoryData.brands;
  
  for(let i=0; i<12; i++) {
    const brand = brands[i % brands.length];
    products.push({
      id: `prod_${catId}_${i}`,
      brand: brand,
      name: `Premium ${categoryData.title} Item - Edition ${i+1}`,
      price: `₹${(Math.floor(Math.random() * 50) + 10) * 100}`,
      orig: `₹${(Math.floor(Math.random() * 70) + 30) * 100}`,
      disc: `${Math.floor(Math.random() * 40) + 10}%`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: `${Math.floor(Math.random() * 500) + 50}`,
      badge: Math.random() > 0.7 ? 'new' : (Math.random() > 0.5 ? 'sale' : ''),
      color: `hsl(${Math.random() * 360}, 15%, 25%)`,
      shape: ['circle','oval','diamond','hexagon','rect'][Math.floor(Math.random()*5)]
    });
  }
  return products;
}

// Reuse SVG generator
function makeSVG(color, shape, w = 200, h = 190) {
  const cx = w / 2, cy = h / 2, r = Math.min(cx, cy);
  let inner = '';
  switch (shape) {
    case 'circle':  inner = `<circle cx="${cx}" cy="${cy}" r="${r*.52}" fill="${color}" opacity=".4"/>`; break;
    case 'oval':    inner = `<ellipse cx="${cx}" cy="${cy}" rx="${r*.62}" ry="${r*.36}" fill="${color}" opacity=".4"/>`;  break;
    case 'diamond': inner = `<polygon points="${cx},${cy*.20} ${cx*1.58},${cy} ${cx},${cy*1.80} ${cx*.42},${cy}" fill="${color}" opacity=".4"/>`;  break;
    case 'hexagon': {
      const pts = Array.from({length:6},(_,i)=>{const a=(Math.PI/3)*i-Math.PI/6;return `${cx+r*.52*Math.cos(a)},${cy+r*.52*Math.sin(a)}`;});
      inner = `<polygon points="${pts.join(' ')}" fill="${color}" opacity=".4"/>`;  break;
    }
    default:        inner = `<rect x="${cx*.28}" y="${cy*.28}" width="${cx*1.44}" height="${cy*1.44}" rx="8" fill="${color}" opacity=".4"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

function makeStars(rating) {
  return Array.from({length:5},(_,i)=>{
    const f = i < Math.floor(rating) ? 'currentColor' : (i - .5 < rating ? 'currentColor' : 'none');
    const op = i < Math.floor(rating) ? '1' : (i - .5 < rating ? '.5' : '.2');
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="1.5" opacity="${op}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }).join('');
}

function buildCard(p) {
  const bCls = { new:'b-new', sale:'b-sale', hot:'b-hot' }[p.badge] || '';
  const bLbl = { new:'New', sale:'Sale', hot:'🔥 Hot' }[p.badge] || '';
  return `<article class="cat-card" role="listitem">
    <a href="product-detail.html?id=${p.id}" class="cat-img" style="display:block; text-decoration:none;">${makeSVG(p.color,p.shape)}${p.badge?`<span class="card-badge ${bCls}">${bLbl}</span>`:''}</a>
    <button class="cat-wish-btn" style="position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:var(--bg-white);border:1px solid var(--border);display:grid;place-items:center;cursor:pointer;z-index:2;" aria-label="Add to wishlist" onclick="toggleWish('w_${p.id}','${p.name}')" id="w_${p.id}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </button>
    <div class="cat-body">
      <div class="cat-brand">${p.brand}</div>
      <a href="product-detail.html?id=${p.id}" class="cat-name" style="display:block;">${p.name}</a>
      <div class="cat-prices"><span class="cat-price">${p.price}</span><span class="cat-orig">${p.orig}</span><span class="cat-disc">${p.disc} off</span></div>
      <div class="cat-rating"><div class="cat-stars" aria-label="${p.rating} out of 5">${makeStars(p.rating)}</div><span class="cat-reviews">${p.rating} (${p.reviews})</span></div>
      <div class="cat-transactions" style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${Math.floor(Math.random()*5 + 1)}k+ bought in past month</div>
      <button class="cat-add-btn" onclick="addToCart('${p.id}','${p.name}')">+ Add to Cart</button>
    </div>
  </article>`;
}

/* Category Page Specific Logic */
function getBrandLogoSVG(brand) {
  // Return placeholder SVG for brand logo if specific one is not found
  const logos = {
    'Nike': '<svg viewBox="0 0 110 44" aria-hidden="true"><path d="M10 33 Q34 5 100 11 Q65 26 28 36 Q18 38 10 33Z" fill="currentColor"/></svg>',
    'Apple': '<svg viewBox="0 0 52 62" aria-hidden="true"><path d="M38 6c-3.8 2.8-6.2 7-5.6 11.5 5.4-.5 9.2-4.8 8.6-10-.1-.7-.9-1.8-3-1.5zm-12 14c-5 0-10 5-10 12.5 0 8.8 7 18.5 12.5 18.5 1.8 0 4.5-.9 6.5-.9 2 0 5.2.9 7.2.9 5.5-1.4 10.5-11 10.5-18.5 0-7.5-4.5-12.5-10.5-12.5-2.5 0-4.2 1-6.5 1-2 0-5.2-1-9.7-1z" fill="currentColor"/></svg>',
    'Zara': '<svg viewBox="0 0 130 32" aria-hidden="true"><text x="4" y="26" font-family="Georgia,serif" font-size="26" font-weight="700" letter-spacing="8" fill="currentColor">ZARA</text></svg>',
    'Sony': '<svg viewBox="0 0 120 30" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="5" fill="currentColor">SONY</text></svg>',
    'Puma': '<svg viewBox="0 0 130 34" aria-hidden="true"><text x="2" y="28" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" letter-spacing="3" fill="currentColor">PUMA</text></svg>',
    'LOreal': '<svg viewBox="0 0 170 38" aria-hidden="true"><text x="2" y="22" font-family="Georgia,serif" font-size="17" font-weight="600" letter-spacing="2" fill="currentColor">L\'ORÉAL</text></svg>',
  };
  return logos[brand] || `<svg viewBox="0 0 120 30" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="currentColor">${brand}</text></svg>`;
}

function initDynamicCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  let catId = urlParams.get('cat') || 'clothing';
  
  // Default fallback if category not mapped
  if (!CATEGORY_MAP[catId]) catId = 'clothing';
  
  const categoryData = CATEGORY_MAP[catId];
  
  // Update Title
  document.title = `${categoryData.title} — E-Bazaar`;
  
  // Update Breadcrumbs
  const parentBC = document.getElementById('bc-parent-cat');
  if (parentBC) {
    parentBC.textContent = categoryData.title;
    parentBC.href = `category.html?cat=${catId}`;
  }

  // Generate Filter Brands Dynamically
  const brandListEl = document.getElementById('filter-brand-list');
  if (brandListEl) {
    brandListEl.innerHTML = categoryData.brands.map(brand => `
      <label class="brand-check">
        <input type="checkbox" value="${brand}" checked/>
        <span class="brand-check-name">${brand}</span>
        <span class="brand-check-count">(${Math.floor(Math.random() * 200) + 20})</span>
      </label>
    `).join('');
  }
  
  // Generate Brand Showcase Row
  const showcaseRow = document.getElementById('brand-showcase-row');
  if (showcaseRow) {
    showcaseRow.innerHTML = categoryData.brands.slice(0, 8).map(brand => `
      <a href="brand-store.html?brand=${brand}" class="brand-showcase-card" title="Shop ${brand}">
        ${getBrandLogoSVG(brand)}
      </a>
    `).join('');
  }

  // Generate Products
  const grid = document.getElementById('main-cat-grid');
  if (grid) {
    const products = generateMockProductsForCategory(catId);
    grid.innerHTML = products.map(buildCard).join('');
  }

  // Update Result Count
  const countEl = document.getElementById('result-count');
  if (countEl) {
    countEl.innerHTML = `Showing <strong>${categoryData.brands.length * 34} products</strong>`;
  }
}

function initCategoryFilters() {
  initDynamicCategory(); // Initialize routing first

  // Filter accordions
  document.querySelectorAll('.f-section-head').forEach(head => {
    head.addEventListener('click', () => {
      head.closest('.f-section').classList.toggle('open');
    });
  });

  // Price range slider (dual input simulation)
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minDisplay = document.getElementById('price-min-display');
  const maxDisplay = document.getElementById('price-max-display');
  const fill = document.getElementById('range-fill');

  function updatePriceUI() {
    if (!minInput || !maxInput) return;
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    const total = parseInt(minInput.max);
    if (minDisplay) minDisplay.textContent = `₹${min.toLocaleString('en-IN')}`;
    if (maxDisplay) maxDisplay.textContent = `₹${max.toLocaleString('en-IN')}`;
    if (fill) {
      fill.style.left  = (min / total * 100) + '%';
      fill.style.width = ((max - min) / total * 100) + '%';
    }
  }

  if (minInput) { minInput.addEventListener('input', () => { if (parseInt(minInput.value) >= parseInt(maxInput.value)) minInput.value = parseInt(maxInput.value) - 500; updatePriceUI(); }); }
  if (maxInput) { maxInput.addEventListener('input', () => { if (parseInt(maxInput.value) <= parseInt(minInput.value)) maxInput.value = parseInt(minInput.value) + 500; updatePriceUI(); }); }
  updatePriceUI();

  // Size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // Brand checkboxes
  document.getElementById('filter-brand-list')?.addEventListener('change', updateFilterTags);

  // Mobile filter drawer
  const filterBtn  = document.querySelector('.filter-toggle-btn');
  const filterDr   = document.getElementById('filter-drawer');
  const filterOvl  = document.getElementById('filter-drawer-overlay');
  const filterDrCl = document.getElementById('filter-drawer-close');
  if (filterBtn  && filterDr) {
    filterBtn.addEventListener('click', () => { filterDr.classList.add('open'); filterOvl?.classList.add('open'); });
    filterOvl?.addEventListener('click', () => { filterDr.classList.remove('open'); filterOvl.classList.remove('open'); });
    filterDrCl?.addEventListener('click', () => { filterDr.classList.remove('open'); filterOvl?.classList.remove('open'); });
  }

  // Clear filters
  const clearBtn = document.querySelector('.filter-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.brand-check input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.size-btn.active').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.rating-row input, .discount-row input').forEach(i => i.checked = false);
    if (minInput) { minInput.value = minInput.min; updatePriceUI(); }
    if (maxInput) { maxInput.value = maxInput.max; updatePriceUI(); }
    updateFilterTags();
    showToast('🔄 Filters cleared');
  });

  // Filter tag removal
  document.addEventListener('click', e => {
    if (e.target.closest('.filter-tag-rm')) {
      const brand = e.target.closest('.filter-tag')?.dataset.brand;
      const cb = document.querySelector(`.brand-check input[value="${brand}"]`);
      if (cb) cb.checked = false;
      e.target.closest('.filter-tag')?.remove();
    }
  });

  updateFilterTags();
}

function updateFilterTags() {
  const container = document.getElementById('active-filter-tags');
  if (!container) return;
  const checked = [...document.querySelectorAll('.brand-check input:checked')].map(c => c.value);
  const existing = [...container.querySelectorAll('.filter-tag[data-brand]')].map(t => t.dataset.brand);
  // Add new
  checked.filter(b => !existing.includes(b)).forEach(b => {
    const tag = document.createElement('span');
    tag.className = 'filter-tag'; tag.dataset.brand = b;
    tag.innerHTML = `${b} <button class="filter-tag-rm" aria-label="Remove ${b} filter">×</button>`;
    container.appendChild(tag);
  });
  // Remove unchecked
  container.querySelectorAll('.filter-tag[data-brand]').forEach(tag => {
    if (!checked.includes(tag.dataset.brand)) tag.remove();
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   CART & WISHLIST
   ═══════════════════════════════════════════════════════════════════════ */
let cartCount = parseInt(localStorage.getItem('eb-cart') || '3');

function syncCartBadge() {
  document.querySelectorAll('.cart-count-el').forEach(el => el.textContent = cartCount);
  localStorage.setItem('eb-cart', String(cartCount));
}

function addToCart(id, title) {
  cartCount++;
  syncCartBadge();
  showToast('🛒 Added to cart!');
}

function toggleWish(btnId, title) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const on = btn.classList.toggle('wished');
  btn.querySelector('svg')?.setAttribute('stroke', on ? '#E03E3E' : '#999');
  showToast(on ? '❤️ Added to wishlist' : 'Removed from wishlist');
}

/* ═══════════════════════════════════════════════════════════════════════
   TRACK SCROLL ARROWS & HOME PAGE CARDS
   ═══════════════════════════════════════════════════════════════════════ */
function initTrackArrows() {
  document.querySelectorAll('.track-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.track);
      if (track) track.scrollBy({ left: (btn.classList.contains('left') ? -1 : 1) * 640, behavior: 'smooth' });
    });
  });
}

// Generate simple mock products for home page tracks if on index
function populateHomeTracks() {
  if (document.body.dataset.page === 'category') return; // Skip if on category page
  
  const nr = document.getElementById('tr-new');
  if (nr) nr.innerHTML = generateMockProductsForCategory('electronics').slice(0,8).map(buildCard).join('');
  
  const tr = document.getElementById('tr-trend');
  if (tr) tr.innerHTML = generateMockProductsForCategory('clothing').slice(0,8).map(buildCard).join('');
  
  ['row1','row2','row3'].forEach((k,i) => {
    const el = document.getElementById(`disc-row-${i+1}`);
    if (el) el.innerHTML = generateMockProductsForCategory(i === 0 ? 'gadgets' : i === 1 ? 'shoes' : 'beauty').slice(0,10).map(buildCard).join('');
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   SHARED UTILITIES
   ═══════════════════════════════════════════════════════════════════════ */
function initSearch() {
  const inp = document.getElementById('q');
  if (!inp) return;
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inp.value.trim())
      window.location.href = `category.html?q=${encodeURIComponent(inp.value.trim())}`;
  });
  document.querySelector('.search-btn')?.addEventListener('click', () => {
    if (inp.value.trim()) window.location.href = `category.html?q=${encodeURIComponent(inp.value.trim())}`;
    else inp.focus();
  });
}

function initNewsletter() {
  const form = document.getElementById('nl-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inp = form.querySelector('input[type="email"]');
    if (inp) { showToast(`✅ Subscribed as ${inp.value}`); inp.value = ''; }
  });
}

function initBTT() {
  const btn = document.getElementById('btt');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initHeaderShadow() {
  const h = document.getElementById('site-header');
  if (!h) return;
  window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 6), { passive: true });
}

function initNavActions() {
  document.getElementById('cart-btn')?.addEventListener('click', () => showToast(`🛒 ${cartCount} items in your cart`));
  document.getElementById('acc-btn')?.addEventListener('click', () => showToast('👤 Please sign in to continue'));
  document.getElementById('wl-nav-btn')?.addEventListener('click', () => showToast('❤️ View your saved items'));
}

/* ═══════════════════════════════════════════════════════════════════════
   BRAND STORE & PRODUCT DETAIL
   ═══════════════════════════════════════════════════════════════════════ */
function initBrandStore() {
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get('brand') || 'Nike';
  
  document.title = `${brand} Official Store — E-Bazaar`;
  
  const titleEl = document.getElementById('brand-title');
  if (titleEl) titleEl.textContent = brand;
  
  const logoEl = document.getElementById('brand-logo-large');
  if (logoEl) logoEl.innerHTML = getBrandLogoSVG(brand);
  
  const grid = document.getElementById('main-cat-grid');
  if (grid) {
    const products = generateMockProductsForCategory('clothing').slice(0, 12);
    products.forEach(p => p.brand = brand);
    grid.innerHTML = products.map(buildCard).join('');
  }
  
  const countEl = document.getElementById('result-count');
  if (countEl) countEl.innerHTML = `Showing <strong>12 products</strong>`;
}

function initProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'P01';
  
  const p = generateMockProductsForCategory('clothing')[0];
  p.name = "Premium " + p.name;
  
  document.title = `${p.name} — E-Bazaar`;
  
  const container = document.getElementById('product-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="product-gallery">
      <div class="product-image-main">
        ${makeSVG(p.color, p.shape)}
      </div>
      <div class="product-thumbnails">
        <div class="thumb-img active">${makeSVG(p.color, p.shape)}</div>
        <div class="thumb-img">${makeSVG('#E0E0E0', p.shape)}</div>
        <div class="thumb-img">${makeSVG('#D0D0D0', p.shape)}</div>
      </div>
    </div>
    <div class="product-info">
      <div class="pd-brand">${p.brand}</div>
      <h1 class="pd-title">${p.name}</h1>
      <div class="pd-rating">
        <div class="cat-stars">${makeStars(p.rating)}</div>
        <a href="#reviews" class="pd-reviews">${p.reviews} Reviews</a>
      </div>
      <div class="pd-price-row">
        <span class="pd-price">${p.price}</span>
        <span class="pd-orig">${p.orig}</span>
        <span class="pd-disc">${p.disc} off</span>
      </div>
      
      <div class="pd-section-title">Select Size</div>
      <div class="size-selector">
        <button class="size-btn">S</button>
        <button class="size-btn active">M</button>
        <button class="size-btn">L</button>
        <button class="size-btn">XL</button>
      </div>
      
      <div class="pd-actions">
        <button class="btn-add-cart" onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}')">Add to Cart</button>
        <button class="btn-wishlist" onclick="toggleWish('w_pd_${p.id}', '${p.name.replace(/'/g, "\\'")}')" id="w_pd_${p.id}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      
      <ul class="pd-details-list">
        <li><span>Material</span><span>100% Premium Cotton</span></li>
        <li><span>Fit</span><span>Regular Fit</span></li>
        <li><span>Care</span><span>Machine Wash Cold</span></li>
        <li><span>SKU</span><span>${productId}</span></li>
      </ul>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  syncCartBadge();
  populateHomeTracks();
  HeroSlider.init();
  initHamburger();
  initMegaMenu();
  AddressModal.init();
  initTrackArrows();
  initNavActions();
  initSearch();
  initNewsletter();
  initBTT();
  initHeaderShadow();

  // Page-specific inits
  if (document.body.dataset.page === 'category') {
    initCategoryFilters();
  } else if (document.body.dataset.page === 'brand-store') {
    initBrandStore();
  } else if (document.body.dataset.page === 'product-detail') {
    initProductDetail();
  }
});
