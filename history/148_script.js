/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — script.js  v5
   Central Engine: Theme, Mega-Panel, Category Dynamic, Auth, Cart, Orders
   ═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   THEME ENGINE
───────────────────────────────────────────────────────────────── */
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
  return { init };
})();

/* ─────────────────────────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────────────────────────── */
let _toastTimer;
window.showToast = function(msg, duration = 2800) {
  const el  = document.getElementById('toast');
  const txt = document.getElementById('toast-msg');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
};

/* ─────────────────────────────────────────────────────────────────
   HAMBURGER & MEGA-PANEL
───────────────────────────────────────────────────────────────── */
function initMegaMenu() {
  // Desktop "Show All Categories" Panel logic
  const megaTrig = document.getElementById('mega-trigger');
  if (megaTrig) {
    let timer;
    megaTrig.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      megaTrig.classList.add('active');
    });
    megaTrig.addEventListener('mouseleave', () => {
      timer = setTimeout(() => megaTrig.classList.remove('active'), 250);
    });
  }
  // Standard Item Dropdowns
  const items = document.querySelectorAll('.mega-item');
  let activeItem = null;
  let closeTimer = null;
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      if(activeItem && activeItem !== item) activeItem.classList.remove('active');
      item.classList.add('active');
      activeItem = item;
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => { item.classList.remove('active'); activeItem = null; }, 250);
    });
  });
}

function initHamburger() {
  const btn     = document.getElementById('hamburger');
  const drawer  = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn= document.getElementById('drawer-close');
  if (!btn || !drawer) return;

  function close() {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', () => {
    btn.classList.add('open');
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  if (overlay) overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
}

/* ─────────────────────────────────────────────────────────────────
   HERO SLIDER
───────────────────────────────────────────────────────────────── */
const HeroSlider = (() => {
  let current = 0, timer = null;
  let track, slides, dots;

  function goTo(n) {
    const total = slides.length;
    current = ((n % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function next() { goTo(current + 1); }
  function resetAuto() { clearInterval(timer); timer = setInterval(next, 5200); }

  function init() {
    track  = document.getElementById('heroTrack');
    slides = document.querySelectorAll('.hero-slide');
    dots   = document.querySelectorAll('.s-dot');
    if (!track || !slides.length) return;

    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); resetAuto(); }));
    slides.forEach(slide => {
      slide.addEventListener('click', e => {
        if (!e.target.closest('.hero-cta,.s-dot') && slide.dataset.href)
          window.location.href = slide.dataset.href;
      });
    });
    const hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(timer));
      hero.addEventListener('mouseleave', resetAuto);
    }
    resetAuto();
  }
  return { init };
})();

/* ─────────────────────────────────────────────────────────────────
   MOCK PRODUCT DATA ENGINE (For Category & Home Tracks)
───────────────────────────────────────────────────────────────── */
const CATEGORY_MAP = {
  'groceries': { title: 'Groceries', brands: ['Amul','Nestle','Britannia','Tata'] },
  'electronics': { title: 'Electronics Showcase', brands: ['Apple','Samsung','Sony','OnePlus'] },
  'gadgets': { title: 'Gadgets', brands: ['Philips','LG','Boat','JBL'] },
  'clothing': { title: 'Clothing Collection', brands: ['Levis','Zara','HM','Tommy'] },
  'shoes': { title: 'Shoes', brands: ['Nike','Adidas','Campus','Puma'] },
  'beauty': { title: 'Beauty', brands: ['LOreal','Maybelline','Nykaa','MAC'] },
  'sports': { title: 'Sports', brands: ['Decathlon','Yonex','Cosco','Nivia'] },
  'home-kitchen': { title: 'Home & Kitchen', brands: ['Prestige','Hawkins','Pigeon','Milton'] },
  'all': { title: 'All Products', brands: ['Nike', 'Apple', 'Zara', 'Sony'] }
};

function generateMockProductsForCategory(catId) {
  const products = [];
  const categoryData = CATEGORY_MAP[catId] || CATEGORY_MAP['all'];
  const brands = categoryData.brands;
  for(let i=0; i<12; i++) {
    const brand = brands[i % brands.length];
    products.push({
      id: `prod_${catId}_${i}`, brand: brand,
      name: `Premium ${categoryData.title} Item - ${i+1}`,
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
  return `<article class="cat-card">
    <div class="cat-img">${makeSVG(p.color,p.shape)}${p.badge?`<span class="card-badge ${bCls}">${bLbl}</span>`:''}
      <button class="cat-wish-btn" onclick="showToast('❤️ Wishlist updated')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="cat-body">
      <div class="cat-brand">${p.brand}</div>
      <div class="cat-name">${p.name}</div>
      <div class="cat-prices"><span class="cat-price">${p.price}</span><span class="cat-orig">${p.orig}</span><span class="cat-disc">${p.disc} off</span></div>
      <div class="cat-rating"><div class="cat-stars">${makeStars(p.rating)}</div><span class="cat-reviews">(${p.reviews})</span></div>
      <button class="cat-add-btn" onclick="window.updateGlobalCart()">+ Add to Cart</button>
    </div>
  </article>`;
}

/* ─────────────────────────────────────────────────────────────────
   PAGE SPECIFIC LOGIC: CATEGORY PAGE
───────────────────────────────────────────────────────────────── */
function initCategoryPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let catId = urlParams.get('cat') || 'clothing';
  if (!CATEGORY_MAP[catId]) catId = 'clothing';
  
  const categoryData = CATEGORY_MAP[catId];
  
  const title = document.getElementById('page-title');
  if(title) title.textContent = `${categoryData.title} — E-Bazaar`;
  
  const brandListEl = document.getElementById('filter-brand-list');
  if (brandListEl) {
    brandListEl.innerHTML = categoryData.brands.map(brand => `
      <label class="brand-check">
        <input type="checkbox" value="${brand}" checked/>
        <span class="brand-check-name">${brand}</span>
      </label>
    `).join('');
  }

  const grid = document.getElementById('main-cat-grid');
  if (grid) {
    grid.innerHTML = generateMockProductsForCategory(catId).map(buildCard).join('');
  }
}

/* ─────────────────────────────────────────────────────────────────
   PAGE SPECIFIC LOGIC: AUTH PAGE
───────────────────────────────────────────────────────────────── */
window.toggleAuth = function(type) {
  const login = document.getElementById('panel-login');
  const signup = document.getElementById('panel-signup');
  if(!login || !signup) return;
  if(type === 'signup') {
    login.classList.add('out');
    setTimeout(()=>{login.classList.add('hidden');login.classList.remove('out');}, 400);
    signup.classList.remove('hidden');
    // slight delay for transition logic
    setTimeout(()=>signup.style.opacity = '1', 10);
  } else {
    signup.classList.add('out');
    setTimeout(()=>{signup.classList.add('hidden');signup.classList.remove('out');}, 400);
    login.classList.remove('hidden');
    setTimeout(()=>login.style.opacity = '1', 10);
  }
};

window.showOTP = function() {
  document.getElementById('send-otp-btn').classList.add('hidden');
  document.getElementById('otp-section').classList.remove('hidden');
  
  let time = 30;
  const timerSpan = document.querySelector('.resend-timer span');
  const int = setInterval(()=>{
    time--;
    timerSpan.textContent = `00:${time < 10 ? '0'+time : time}`;
    if(time<=0){
      clearInterval(int);
      timerSpan.innerHTML = `<a href="#" style="color:var(--accent)">Resend OTP</a>`;
    }
  }, 1000);
};


/* ─────────────────────────────────────────────────────────────────
   PAGE SPECIFIC LOGIC: CART PAGE
───────────────────────────────────────────────────────────────── */
window.updateQty = function(btn, change) {
  const valEl = btn.parentElement.querySelector('.qty-val');
  let val = parseInt(valEl.textContent);
  val += change;
  if(val < 1) val = 1;
  valEl.textContent = val;
  recalcCart();
};

window.applyPromo = function() {
  const code = document.getElementById('promo-code')?.value.trim().toUpperCase();
  if(!code) return showToast('❌ Enter a code');
  if(code === 'LOYALTY') {
    document.querySelector('.s-discount').style.display = 'flex';
    document.getElementById('discount').textContent = '-₹1,500';
    showToast('🎉 Loyalty discount applied!');
    recalcCart(1500);
  } else {
    showToast('❌ Invalid promo code');
  }
};

function recalcCart(discountAmount = 0) {
  let sub = 0;
  document.querySelectorAll('.c-item').forEach(item => {
    const price = parseInt(item.dataset.price);
    const qty = parseInt(item.querySelector('.qty-val').textContent);
    sub += (price * qty);
  });
  
  const subEl = document.getElementById('subtotal');
  const totEl = document.getElementById('total-amt');
  if(subEl) subEl.textContent = `₹${sub.toLocaleString('en-IN')}`;
  
  const isDisc = document.querySelector('.s-discount')?.style.display === 'flex';
  const disc = isDisc ? 1500 : 0;
  const total = sub - disc;
  if(totEl) totEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

/* ─────────────────────────────────────────────────────────────────
   GLOBAL CART UTILITIES
───────────────────────────────────────────────────────────────── */
let globalCartCount = 3;
window.updateGlobalCart = function() {
  globalCartCount++;
  document.querySelectorAll('.cart-count-el').forEach(e => e.textContent = globalCartCount);
  showToast('🛒 Added to cart!');
};

/* ─────────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  initMegaMenu();
  initHamburger();
  
  const page = document.body.dataset.page;
  if(page === 'category') initCategoryPage();
  if(!page) { // Index
    HeroSlider.init();
    const trendTrack = document.getElementById('tr-trend');
    if (trendTrack) trendTrack.innerHTML = generateMockProductsForCategory('clothing').map(buildCard).join('');
    
    document.querySelectorAll('.track-arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const track = document.getElementById(btn.dataset.track);
        if(track) track.scrollBy({ left: (btn.classList.contains('left') ? -1 : 1) * 640, behavior: 'smooth' });
      });
    });
  }
});
