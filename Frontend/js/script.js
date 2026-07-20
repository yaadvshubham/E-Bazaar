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
  const ADDRESS_MODAL_HTML = `
  <div class="modal-card">
    <div class="modal-head"><h2 class="modal-title">Manage Delivery Addresses</h2><button class="modal-close" id="modal-close-btn" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="modal-body">
      <div class="addr-list" id="global-addr-list">
        <div class="addr-item is-default" data-type="Home"><div class="addr-item-top"><span class="addr-name">Aryan Verma</span><span class="addr-type">Home ✓</span></div><p class="addr-line">47, Sector 18, DLF Phase 3<br>New Delhi, Delhi — 110001</p><p class="addr-phone">+91 98765 43210</p><div class="addr-actions"><button class="addr-act-btn set-default-btn">Set as Default</button><button class="addr-act-btn edit-btn">&#9998; Edit</button><button class="addr-act-btn secondary delete-btn">&#128465; Delete</button></div></div>
        <div class="addr-item" data-type="Work"><div class="addr-item-top"><span class="addr-name">Aryan Verma</span><span class="addr-type">Work</span></div><p class="addr-line">E-Bazaar HQ, Tower B, Cyber City<br>Gurugram, Haryana — 122002</p><p class="addr-phone">+91 98765 43210</p><div class="addr-actions"><button class="addr-act-btn set-default-btn">Set as Default</button><button class="addr-act-btn edit-btn">&#9998; Edit</button><button class="addr-act-btn secondary delete-btn">&#128465; Delete</button></div></div>
      </div>
      <button class="add-addr-btn" id="add-addr-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add New Address</button>
      <form class="addr-form" id="new-addr-form" novalidate>
        <div class="form-row"><div class="form-group"><label for="f-name">First Name</label><input type="text" id="f-name" placeholder="Aryan" required/></div><div class="form-group"><label for="f-lname">Last Name</label><input type="text" id="f-lname" placeholder="Verma" required/></div></div>
        <div class="form-group full"><label for="f-line1">Address Line 1</label><input type="text" id="f-line1" placeholder="House no., Street, Area" required/></div>
        <div class="form-group full"><label for="f-line2">Address Line 2 (Optional)</label><input type="text" id="f-line2" placeholder="Landmark, Apartment"/></div>
        <div class="form-row"><div class="form-group"><label for="f-city">City</label><input type="text" id="f-city" placeholder="New Delhi" required/></div><div class="form-group"><label for="f-pin">PIN Code</label><input type="text" id="f-pin" placeholder="110001" maxlength="6" required/></div></div>
        <div class="form-row"><div class="form-group"><label for="f-state">State</label><select id="f-state" required><option value="">Select State</option><option value="Delhi">Delhi</option><option value="Haryana">Haryana</option><option value="UP">UP</option><option value="Maharashtra">Maharashtra</option><option value="Karnataka">Karnataka</option></select></div><div class="form-group"><label for="f-phone">Mobile</label><input type="tel" id="f-phone" placeholder="+91 XXXXX XXXXX" required/></div></div>
        <div style="display:flex;gap:16px"><button type="submit" class="form-submit" style="flex:1">Save Address</button><button type="button" id="addr-form-cancel" class="addr-act-btn secondary" style="height:48px;padding:0 24px;border-radius:14px">Cancel</button></div>
      </form>
    </div>
  </div>`;

  function injectModalIfNeeded() {
    let overlay = document.getElementById('addr-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'addr-modal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Manage delivery addresses');
      overlay.innerHTML = ADDRESS_MODAL_HTML;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function open() {
    const overlay = injectModalIfNeeded();
    if (!overlay) return;
    
    // Rebind events just in case it was freshly injected
    bindModalEvents(overlay);
    
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
  
  function bindAddressItemEvents(item) {
    const defaultBtn = item.querySelector('.set-default-btn');
    if (defaultBtn) {
      defaultBtn.addEventListener('click', () => {
        document.querySelectorAll('.addr-item').forEach(el => {
          el.classList.remove('is-default');
          const t = el.querySelector('.addr-type');
          if (t) t.textContent = el.dataset.type || 'Address';
        });
        item.classList.add('is-default');
        const typeEl = item.querySelector('.addr-type');
        if (typeEl) typeEl.textContent = (item.dataset.type || 'Address') + ' ✓';
        if (typeof showToast === 'function') showToast('✅ Default address updated');
      });
    }
    
    const deleteBtn = item.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to delete this address?')) {
          item.remove();
          if (typeof showToast === 'function') showToast('🗑️ Address deleted');
        }
      });
    }
    
    const editBtn = item.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
         showAddForm();
         document.getElementById('new-addr-form').scrollIntoView({behavior: 'smooth'});
      });
    }
  }

  let eventsBound = false;
  function bindModalEvents(overlay) {
    if (eventsBound) return;
    
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', close);

    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

    const addBtn = document.getElementById('add-addr-btn');
    if (addBtn) addBtn.addEventListener('click', showAddForm);

    const cancelBtn = document.getElementById('addr-form-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', hideAddForm);

    document.querySelectorAll('.addr-item').forEach(bindAddressItemEvents);

    const form = document.getElementById('new-addr-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        
        const fname = document.getElementById('f-name').value;
        const lname = document.getElementById('f-lname').value;
        const line1 = document.getElementById('f-line1').value;
        const line2 = document.getElementById('f-line2').value;
        const city = document.getElementById('f-city').value;
        const pin = document.getElementById('f-pin').value;
        const phone = document.getElementById('f-phone').value;
        
        const newAddr = {
          type: 'Custom',
          fname, lname, line1, line2, city, pin, phone
        };
        
        let user = JSON.parse(localStorage.getItem('eb_user'));
        if (user) {
          if (!user.addresses) user.addresses = [];
          user.addresses.push(newAddr);
          localStorage.setItem('eb_user', JSON.stringify(user));
        }

        const list = document.getElementById('global-addr-list') || document.querySelector('.addr-list');
        if (list) {
          const newItem = document.createElement('div');
          newItem.className = 'addr-item';
          newItem.dataset.type = 'Custom';
          newItem.innerHTML = `
            <div class="addr-item-top">
              <span class="addr-name">${fname} ${lname}</span>
              <span class="addr-type">Custom</span>
            </div>
            <p class="addr-line">${line1}<br>${line2 ? line2 + ', ' : ''}${city} — ${pin}</p>
            <p class="addr-phone">${phone}</p>
            <div class="addr-actions">
              <button class="addr-act-btn set-default-btn">Set as Default</button>
              <button class="addr-act-btn edit-btn">&#9998; Edit</button>
              <button class="addr-act-btn secondary delete-btn">&#128465; Delete</button>
            </div>
          `;
          list.appendChild(newItem);
          bindAddressItemEvents(newItem);
        }
        
        if (typeof AddressModal.onSave === 'function') {
          AddressModal.onSave(newAddr);
        }
        
        if (typeof showToast === 'function') showToast('🏠 New address saved!');
        hideAddForm();
      });
    }
    eventsBound = true;
  }

  function init() {
    // Only bind the trigger on init. Modal injection happens lazily on open.
    // However, if the modal happens to be hardcoded on the page already, we can bind it now.
    const overlay = document.getElementById('addr-modal');
    if (overlay) {
        bindModalEvents(overlay);
    }

    const triggers = document.querySelectorAll('#addr-trigger, .nav-address');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', open);
    });
  }

  return {
    init,
    open,
    close,
    onSave: null
  };
})();
window.AddressModal = AddressModal;

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

const BRAND_LOGOS = {
  'Amul': 'images/logos/grocery_logo/amul.png',
  'Nestle': 'images/logos/grocery_logo/nestle.jpg',
  'Britannia': 'images/logos/grocery_logo/britannia.jpg',
  'Tata': 'images/logos/grocery_logo/tata.jpg',
  'MotherDairy': 'images/logos/grocery_logo/motherdairy.png',
  'ITC': 'images/logos/grocery_logo/ITC.jpg',
  'HUL': 'images/logos/grocery_logo/HUL.jpg',
  'Apple': 'images/logos/electronics_logo/apple.jpg',
  'Nothing': 'images/logos/electronics_logo/nothing.jpg',
  'Samsung': 'images/logos/electronics_logo/samsung.jpg',
  'Sony': 'images/logos/electronics_logo/sony.jpg',
  'OnePlus': 'images/logos/electronics_logo/oneplus.jpg',
  'Xiaomi': 'images/logos/electronics_logo/xiaomi.jpg',
  'Vivo': 'images/logos/electronics_logo/vivo.jpg',
  'Philips': 'images/logos/gadgets_logo/philips.jpg',
  'LG': 'images/logos/gadgets_logo/lg.jpg',
  'Boat': 'images/logos/gadgets_logo/boat.jpg',
  'JBL': 'images/logos/gadgets_logo/jbl.jpg',
  'Noise': 'images/logos/gadgets_logo/noise.jpg',
  'Boult': 'images/logos/gadgets_logo/boult.png',
  'Logitech': 'images/logos/gadgets_logo/logitech.jpg',
  'Levis': "images/logos/clothing_logo/levi's.jpg",
  'Zara': 'images/logos/clothing_logo/zara.jpg',
  'HM': 'images/logos/clothing_logo/H&M.jpg',
  'Tommy': 'images/logos/clothing_logo/tommy hilfiger.jpg',
  'USPolo': 'images/logos/clothing_logo/us polo assn.jpg',
  'AllenSolly': 'images/logos/clothing_logo/allen solly.jpg',
  'Nike': 'images/logos/shoes_logo/nike.jpg',
  'Adidas': 'images/logos/shoes_logo/adidas.jpg',
  'Campus': 'images/logos/shoes_logo/campus.jpg',
  'Puma': 'images/logos/shoes_logo/puma.jpg',
  'Comet': 'images/logos/shoes_logo/comet.png',
  'NewBalance': 'images/logos/shoes_logo/new balance.jpg',
  'Reebok': 'images/logos/shoes_logo/reebok.jpg',
  'LOreal': 'images/logos/beauty_logo/loreal.jpg',
  'Maybelline': 'images/logos/beauty_logo/mayberlline.jpg',
  'Nykaa': 'images/logos/beauty_logo/nykaa.jpg',
  'MAC': 'images/logos/beauty_logo/mac.png',
  'Mamaearth': 'images/logos/beauty_logo/mamaearth.jpg',
  'Cetaphil': 'images/logos/beauty_logo/cetaphil.jpg',
  'Prestige': 'images/logos/home & kitchen/prestige.jpg',
  'Hawkins': 'images/logos/home & kitchen/hawkins.jpg',
  'Pigeon': 'images/logos/home & kitchen/pigeon.png',
  'Milton': 'images/logos/home & kitchen/milton.png',
  'Borosil': 'images/logos/home & kitchen/borosil.png',
  'Bajaj': 'images/logos/home & kitchen/bajaj.jpg',
  'Decathlon': 'images/logos/sports_logo/decathlon.jpg',
  'Yonex': 'images/logos/sports_logo/yonex.jpg',
  'Cosco': 'images/logos/sports_logo/cosco.jpg',
  'Nivia': 'images/logos/sports_logo/nivia.jpg',
  'Speedo': 'images/logos/sports_logo/Speedo.jpg',
  'Spalding': 'images/logos/sports_logo/spalding.jpg'
};

function getCategoryForBrand(brand) {
  for (const [cat, data] of Object.entries(CATEGORY_MAP)) {
    if (cat !== 'all' && data.brands && data.brands.includes(brand)) {
      return cat;
    }
  }
  return 'beauty'; // default fallback
}

const MASTER_PRODUCTS = [
  {
    "id": "app_101",
    "title": "Apple iPhone 15 Pro Max (256GB, Natural Titanium)",
    "description": "Forged in titanium with A17 Pro chip, customizable Action button, and 5x Telephoto camera.",
    "price": 159900,
    "originalPrice": 169900,
    "discount": "6%",
    "rating": 4.9,
    "reviews": 5820,
    "brand": "Apple",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    "badge": "hot",
    "sales": 3200
  },
  {
    "id": "app_102",
    "title": "Apple MacBook Air M3 15-inch (16GB, 512GB SSD)",
    "description": "Incredibly thin laptop powered by M3 chip with liquid retina display and up to 18 hours battery life.",
    "price": 134900,
    "originalPrice": 144900,
    "discount": "7%",
    "rating": 4.8,
    "reviews": 2450,
    "brand": "Apple",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    "badge": "new",
    "sales": 1500
  },
  {
    "id": "app_103",
    "title": "Apple AirPods Pro (2nd Generation with USB-C)",
    "description": "Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio.",
    "price": 24900,
    "originalPrice": 26900,
    "discount": "7%",
    "rating": 4.8,
    "reviews": 9400,
    "brand": "Apple",
    "category": "electronics",
    "image": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800",
    "badge": "hot",
    "sales": 8400
  },
  {
    "id": "app_104",
    "title": "Apple Watch Series 9 GPS 45mm Midnight Aluminum",
    "description": "Powerful S9 SiP chip, Double Tap gesture, brighter display, and advanced health sensors.",
    "price": 44900,
    "originalPrice": 48900,
    "discount": "8%",
    "rating": 4.7,
    "reviews": 1890,
    "brand": "Apple",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
    "badge": "new",
    "sales": 1900
  },
  {
    "id": "sam_201",
    "title": "Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB)",
    "description": "Galaxy AI powered flagship phone with 200MP camera, Snapdragon 8 Gen 3, and built-in S Pen.",
    "price": 129999,
    "originalPrice": 139999,
    "discount": "7%",
    "rating": 4.8,
    "reviews": 4200,
    "brand": "Samsung",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
    "badge": "hot",
    "sales": 2900
  },
  {
    "id": "sam_202",
    "title": "Samsung 55-inch 4K Ultra HD Smart QLED TV",
    "description": "Quantum Dot color technology, Quantum HDR, AirSlim design, and Tizen OS with Voice Control.",
    "price": 64990,
    "originalPrice": 84900,
    "discount": "23%",
    "rating": 4.6,
    "reviews": 1850,
    "brand": "Samsung",
    "category": "electronics",
    "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
    "badge": "sale",
    "sales": 1100
  },
  {
    "id": "sony_301",
    "title": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    "description": "Industry-leading noise cancellation, 30-hour battery life, and crystal clear hands-free calling.",
    "price": 29990,
    "originalPrice": 34990,
    "discount": "14%",
    "rating": 4.8,
    "reviews": 6700,
    "brand": "Sony",
    "category": "electronics",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "badge": "hot",
    "sales": 4500
  },
  {
    "id": "nike_501",
    "title": "Nike Air Jordan 1 Retro High OG Chicago",
    "description": "Iconic high-top sneaker with premium leather upper, encapsulated Air cushioning, and rubber outsole.",
    "price": 16995,
    "originalPrice": 19995,
    "discount": "15%",
    "rating": 4.9,
    "reviews": 8400,
    "brand": "Nike",
    "category": "shoes",
    "image": "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
    "badge": "hot",
    "sales": 6200
  },
  {
    "id": "nike_502",
    "title": "Nike Air Max 270 Running Shoes Black/White",
    "description": "Big Air unit underfoot delivers responsive cushioning while breathable mesh keeps feet cool.",
    "price": 12995,
    "originalPrice": 14995,
    "discount": "13%",
    "rating": 4.7,
    "reviews": 5100,
    "brand": "Nike",
    "category": "shoes",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "badge": "sale",
    "sales": 4100
  },
  {
    "id": "adi_601",
    "title": "Adidas Ultraboost Light Running Shoes",
    "description": "Lightest Ultraboost ever made with Light BOOST cushioning and Primeknit+ upper.",
    "price": 15999,
    "originalPrice": 18999,
    "discount": "16%",
    "rating": 4.8,
    "reviews": 3900,
    "brand": "Adidas",
    "category": "shoes",
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
    "badge": "new",
    "sales": 2800
  },
  {
    "id": "amul_801",
    "title": "Amul Pure Cow Ghee 1 Litre Tin",
    description: "100% pure cow ghee made from fresh cream with rich aroma and granular texture.",
    "price": 650,
    "originalPrice": 699,
    "discount": "7%",
    "rating": 4.9,
    "reviews": 14200,
    "brand": "Amul",
    "category": "groceries",
    "image": "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800",
    "badge": "hot",
    "sales": 12500
  },
  {
    "id": "nestle_901",
    "title": "Nestle Maggi 2-Minute Masala Noodles (Pack of 12)",
    description: "India's favorite instant noodles infused with signature aromatic spices.",
    "price": 168,
    "originalPrice": 180,
    "discount": "7%",
    "rating": 4.8,
    "reviews": 28000,
    "brand": "Nestle",
    "category": "groceries",
    "image": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800",
    "badge": "hot",
    "sales": 22000
  },
  {
    "id": "custom_50",
    "title": "Levi's 511 Slim Fit Jeans",
    "description": "Classic slim fit denim with stretch for everyday comfort and modern style.",
    "price": 2999,
    "originalPrice": 3599,
    "discount": "16%",
    "rating": 4.6,
    "reviews": 3200,
    "brand": "Levi's",
    "category": "bottoms",
    "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    "badge": "hot",
    "sales": 850
  },
  {
    "id": "custom_51",
    "title": "Zara High-Rise Wide Leg Pants",
    "description": "Elegant tailored trousers with a high waist and wide leg cut.",
    "price": 2490,
    "originalPrice": 2990,
    "discount": "16%",
    "rating": 4.5,
    "reviews": 1200,
    "brand": "Zara",
    "category": "bottoms",
    "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
    "badge": "",
    "sales": 640
  },
  {
    "id": "custom_52",
    "title": "H&M Oversized Premium Hoodie",
    "description": "Thick, soft cotton blend hoodie with dropped shoulders and a kangaroo pocket.",
    "price": 1999,
    "originalPrice": 2499,
    "discount": "20%",
    "rating": 4.7,
    "reviews": 4500,
    "brand": "H&M",
    "category": "tops",
    "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    "badge": "sale",
    "sales": 1200
  },
  {
    "id": "custom_53",
    "title": "Uniqlo Cashmere V-Neck Sweater",
    "description": "100% pure cashmere for a luxurious, warm, and feather-light feel.",
    "price": 5990,
    "originalPrice": 6990,
    "discount": "14%",
    "rating": 4.9,
    "reviews": 890,
    "brand": "Uniqlo",
    "category": "tops",
    "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    "badge": "new",
    "sales": 340
  },
  {
    "id": "custom_54",
    "title": "House of CB Satin Bodycon Dress",
    "description": "Figure-hugging draped satin dress perfect for evening parties.",
    "price": 12500,
    "originalPrice": 15000,
    "discount": "16%",
    "rating": 4.8,
    "reviews": 420,
    "brand": "House of CB",
    "category": "womens-dresses",
    "image": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800",
    "badge": "hot",
    "sales": 210
  },
  {
    "id": "custom_55",
    "title": "Mango Floral Maxi Onepiece",
    "description": "Breezy chiffon maxi dress featuring a vibrant floral print and tiered skirt.",
    "price": 4590,
    "originalPrice": 5590,
    "discount": "17%",
    "rating": 4.4,
    "reviews": 670,
    "brand": "Mango",
    "category": "womens-dresses",
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
    "badge": "",
    "sales": 450
  },
  {
    "id": "custom_56",
    "title": "FabIndia Pure Silk Zari Saree",
    "description": "Handwoven Banarasi silk saree with intricate gold zari detailing.",
    "price": 18999,
    "originalPrice": 22999,
    "discount": "17%",
    "rating": 4.9,
    "reviews": 180,
    "brand": "FabIndia",
    "category": "traditional",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
    "badge": "new",
    "sales": 90
  },
  {
    "id": "custom_57",
    "title": "Biba Embroidered Salwar Suit Set",
    "description": "Elegant 3-piece cotton suit set with heavy threadwork dupatta.",
    "price": 3999,
    "originalPrice": 4999,
    "discount": "20%",
    "rating": 4.5,
    "reviews": 1200,
    "brand": "Biba",
    "category": "traditional",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
    "badge": "sale",
    "sales": 650
  },
  {
    "id": "custom_58",
    "title": "Raymond Fine Wool Three-Piece Suit",
    "description": "Impeccably tailored slim-fit suit for weddings and formal occasions.",
    "price": 14999,
    "originalPrice": 18999,
    "discount": "21%",
    "rating": 4.7,
    "reviews": 310,
    "brand": "Raymond",
    "category": "traditional",
    "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
    "badge": "hot",
    "sales": 180
  },
  {
    "id": "custom_59",
    "title": "Nike Air Force 1 '07 Sneakers",
    "description": "The iconic low-top sneaker featuring crisp leather and classic AF1 cushioning.",
    "price": 8495,
    "originalPrice": 9495,
    "discount": "10%",
    "rating": 4.9,
    "reviews": 8500,
    "brand": "Nike",
    "category": "mens-shoes",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "badge": "",
    "sales": 3200
  },
  {
    "id": "custom_60",
    "title": "Christian Louboutin Pigalle Pumps",
    "description": "Signature red soles and a classic pointed toe for timeless elegance.",
    "price": 65000,
    "originalPrice": 70000,
    "discount": "7%",
    "rating": 4.8,
    "reviews": 140,
    "brand": "Christian Louboutin",
    "category": "womens-shoes",
    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    "badge": "hot",
    "sales": 80
  },
  {
    "id": "custom_61",
    "title": "Adidas Ultraboost 1.0",
    "description": "Incredible energy return and a Primeknit upper for adaptive support.",
    "price": 15999,
    "originalPrice": 18999,
    "discount": "15%",
    "rating": 4.7,
    "reviews": 4100,
    "brand": "Adidas",
    "category": "mens-shoes",
    "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    "badge": "new",
    "sales": 1500
  },
  {
    "id": "custom_62",
    "title": "Zara Sequin Crop Top",
    "description": "Catch the light in this stunning evening crop top.",
    "price": 2290,
    "originalPrice": 2790,
    "discount": "17%",
    "rating": 4.3,
    "reviews": 320,
    "brand": "Zara",
    "category": "tops",
    "image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
    "badge": "sale",
    "sales": 400
  },
  {
    "id": "custom_40",
    "title": "LG 1.5 Ton 5 Star AI DUAL Inverter AC",
    "description": "AI Convertible 6-in-1 cooling, 4-way swing, and HD filter with anti-virus protection.",
    "price": 45990,
    "originalPrice": 52990,
    "discount": "13%",
    "rating": 4.8,
    "reviews": 1450,
    "brand": "LG",
    "category": "appliances",
    "image": "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=800",
    "badge": "hot",
    "sales": 120
  },
  {
    "id": "custom_41",
    "title": "Daikin 1.5 Ton 5 Star Inverter Split AC",
    "description": "Dew clean technology, Coanda airflow for uniform cooling, and ultra-quiet operation.",
    "price": 49999,
    "originalPrice": 55999,
    "discount": "11%",
    "rating": 4.7,
    "reviews": 980,
    "brand": "Daikin",
    "category": "appliances",
    "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    "badge": "sale",
    "sales": 85
  },
  {
    "id": "custom_42",
    "title": "Symphony Diet 3D 55i+ Air Cooler",
    "description": "55L tower cooler with 3D honeycomb pads, i-Pure technology, and magnetic remote.",
    "price": 10999,
    "originalPrice": 13999,
    "discount": "21%",
    "rating": 4.3,
    "reviews": 2100,
    "brand": "Symphony",
    "category": "appliances",
    "image": "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=800",
    "badge": "",
    "sales": 300
  },
  {
    "id": "custom_43",
    "title": "Bajaj PX 97 Torque New 36L Air Cooler",
    "description": "Turbo fan technology, powerful air throw, and multi-directional castor wheels.",
    "price": 5999,
    "originalPrice": 7999,
    "discount": "25%",
    "rating": 4.1,
    "reviews": 4500,
    "brand": "Bajaj",
    "category": "appliances",
    "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    "badge": "new",
    "sales": 500
  },
  {
    "id": "custom_20",
    "title": "Samsung 65\" Neo QLED 8K Smart TV",
    "description": "True 8K resolution with Neural Quantum Processor 8K and Infinity One Design.",
    "price": 249990,
    "originalPrice": 299990,
    "discount": "16%",
    "rating": 4.8,
    "reviews": 420,
    "brand": "Samsung",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
    "badge": "sale",
    "sales": 12
  },
  {
    "id": "custom_21",
    "title": "LG OLED evo G4 77\" 4K TV",
    "description": "The pinnacle of OLED technology. Brightness Booster Max and Alpha 11 AI processor.",
    "price": 349990,
    "originalPrice": 389990,
    "discount": "10%",
    "rating": 4.9,
    "reviews": 215,
    "brand": "LG",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800",
    "badge": "hot",
    "sales": 8
  },
  {
    "id": "custom_22",
    "title": "Sony Bravia XR Master Series 85\"",
    "description": "Incredible Cognitive Processor XR for lifelike picture and sound matching human perception.",
    "price": 499990,
    "originalPrice": 549990,
    "discount": "9%",
    "rating": 4.9,
    "reviews": 95,
    "brand": "Sony",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
    "badge": "new",
    "sales": 3
  },
  {
    "id": "custom_23",
    "title": "Samsung Bespoke 4-Door Refrigerator",
    "description": "Customizable door colors, FlexZone, and Beverage Center with dual ice maker.",
    "price": 185000,
    "originalPrice": 210000,
    "discount": "11%",
    "rating": 4.7,
    "reviews": 840,
    "brand": "Samsung",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
    "badge": "",
    "sales": 25
  },
  {
    "id": "custom_24",
    "title": "LG InstaView Door-in-Door Fridge",
    "description": "Knock twice to see inside. Hygiene Fresh+ and linear cooling for extended freshness.",
    "price": 165000,
    "originalPrice": 185000,
    "discount": "10%",
    "rating": 4.6,
    "reviews": 530,
    "brand": "LG",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
    "badge": "sale",
    "sales": 40
  },
  {
    "id": "custom_25",
    "title": "Whirlpool 500L Multi-Door Refrigerator",
    "description": "Adaptive intelligence technology, 3D airflow, and Zeolite technology to prevent over-ripening.",
    "price": 95000,
    "originalPrice": 105000,
    "discount": "9%",
    "rating": 4.5,
    "reviews": 1200,
    "brand": "Whirlpool",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
    "badge": "",
    "sales": 65
  },
  {
    "id": "custom_26",
    "title": "AMD Ryzen 9 9950X CPU",
    "description": "16-core, 32-thread ultimate processor built on Zen 5 architecture for peak performance.",
    "price": 65990,
    "originalPrice": 72990,
    "discount": "9%",
    "rating": 4.9,
    "reviews": 210,
    "brand": "AMD",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
    "badge": "new",
    "sales": 85
  },
  {
    "id": "custom_27",
    "title": "Intel Core Ultra 9 285K Processor",
    "description": "24 cores, AI accelerated NPU, and massive turbo boost frequencies up to 6.2GHz.",
    "price": 68990,
    "originalPrice": 74990,
    "discount": "8%",
    "rating": 4.8,
    "reviews": 190,
    "brand": "Intel",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800",
    "badge": "hot",
    "sales": 110
  },
  {
    "id": "custom_28",
    "title": "Nvidia GeForce RTX 5090 GPU",
    "description": "The undisputed king of graphics. 32GB GDDR7, DLSS 4.0, and unparalleled ray tracing.",
    "price": 189990,
    "originalPrice": 199990,
    "discount": "5%",
    "rating": 5,
    "reviews": 88,
    "brand": "Nvidia",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800",
    "badge": "new",
    "sales": 300
  },
  {
    "id": "custom_29",
    "title": "Apple Mac Studio M3 Ultra",
    "description": "Unbelievable power in a compact form factor. Perfect for 8K video editing and heavy 3D rendering.",
    "price": 399900,
    "originalPrice": 419900,
    "discount": "4%",
    "rating": 4.9,
    "reviews": 140,
    "brand": "Apple",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800",
    "badge": "",
    "sales": 15
  },
  {
    "id": "custom_30",
    "title": "HP Omen 45L Gaming Desktop CPU",
    "description": "Patented Cryo Chamber cooling, RTX 4090, and i9 processor packed in a sleek chassis.",
    "price": 299990,
    "originalPrice": 329990,
    "discount": "9%",
    "rating": 4.7,
    "reviews": 310,
    "brand": "HP",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=800",
    "badge": "sale",
    "sales": 45
  },
  {
    "id": "custom_31",
    "title": "ASUS ROG Swift OLED 32\" Monitor",
    "description": "4K 240Hz QD-OLED gaming monitor with 0.03ms response time and G-Sync.",
    "price": 129990,
    "originalPrice": 149990,
    "discount": "13%",
    "rating": 4.9,
    "reviews": 620,
    "brand": "ASUS",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800",
    "badge": "hot",
    "sales": 120
  },
  {
    "id": "custom_32",
    "title": "Alienware 34\" QD-OLED Monitor",
    "description": "Ultrawide curved gaming perfection. Infinite contrast ratio and true blacks.",
    "price": 109990,
    "originalPrice": 129990,
    "discount": "15%",
    "rating": 4.8,
    "reviews": 840,
    "brand": "Alienware",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    "badge": "",
    "sales": 90
  },
  {
    "id": "custom_33",
    "title": "Samsung Galaxy S26+",
    "description": "Perfect balance of size and battery. Galaxy AI, Armor Aluminum, and flat dynamic AMOLED 2X.",
    "price": 105999,
    "originalPrice": 115999,
    "discount": "8%",
    "rating": 4.7,
    "reviews": 1250,
    "brand": "Samsung",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800",
    "badge": "",
    "sales": 85
  },
  {
    "id": "custom_34",
    "title": "Apple iPhone 17 Pro",
    "description": "Titanium design, A19 Pro chip, and a revolutionary Action Button with spatial video capture.",
    "price": 134900,
    "originalPrice": 139900,
    "discount": "3%",
    "rating": 4.9,
    "reviews": 3200,
    "brand": "Apple",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1537589376225-5405c60a5bd8?w=800",
    "badge": "hot",
    "sales": 500
  },
  {
    "id": "custom_35",
    "title": "Vivo X100 Pro",
    "description": "Zeiss APO floating telephoto camera, Dimensity 9300, and pro-level cinematic videography.",
    "price": 89999,
    "originalPrice": 99999,
    "discount": "10%",
    "rating": 4.8,
    "reviews": 940,
    "brand": "Vivo",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800",
    "badge": "new",
    "sales": 75
  },
  {
    "id": "custom_36",
    "title": "Oppo Find X8 Pro",
    "description": "Hasselblad master cameras, dual-periscope lens, and incredibly fast 100W SuperVOOC charging.",
    "price": 94999,
    "originalPrice": 104999,
    "discount": "9%",
    "rating": 4.8,
    "reviews": 810,
    "brand": "Oppo",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    "badge": "sale",
    "sales": 60
  },
  {
    "id": "custom_37",
    "title": "Xiaomi 15 Ultra",
    "description": "Leica Summilux optics, 1-inch type sensor, and ultra-bright 3000 nits display.",
    "price": 99999,
    "originalPrice": 109999,
    "discount": "9%",
    "rating": 4.7,
    "reviews": 1100,
    "brand": "Xiaomi",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800",
    "badge": "",
    "sales": 100
  },
  {
    "id": "custom_38",
    "title": "OnePlus Open 2",
    "description": "The thinnest foldable gets thinner. Dual LTPO OLEDs and Hasselblad cameras on a hinge built for 1M folds.",
    "price": 139999,
    "originalPrice": 149999,
    "discount": "6%",
    "rating": 4.9,
    "reviews": 520,
    "brand": "OnePlus",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    "badge": "new",
    "sales": 45
  },
  {
    "id": "custom_39",
    "title": "Samsung Galaxy Z Fold 7",
    "description": "The ultimate multitasking machine. Integrated S-Pen slot, under-display camera, and Snapdragon 8 Gen 4.",
    "price": 154999,
    "originalPrice": 164999,
    "discount": "6%",
    "rating": 4.8,
    "reviews": 1400,
    "brand": "Samsung",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800",
    "badge": "hot",
    "sales": 110
  },
  {
    "id": "custom_8",
    "title": "Samsung Galaxy M55 5G",
    "description": "Monster 6000mAh battery, 120Hz sAMOLED display, and Snapdragon 7 Gen 1.",
    "price": 26999,
    "originalPrice": 30999,
    "discount": "12%",
    "rating": 4.4,
    "reviews": 2150,
    "brand": "Samsung",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "badge": "sale",
    "sales": 42
  },
  {
    "id": "custom_9",
    "title": "Vivo T3 Pro 5G",
    "description": "Turbo performance with MediaTek Dimensity 7200, 3D Curved AMOLED, and 66W fast charge.",
    "price": 24999,
    "originalPrice": 28999,
    "discount": "13%",
    "rating": 4.5,
    "reviews": 1300,
    "brand": "Vivo",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    "badge": "new",
    "sales": 30
  },
  {
    "id": "custom_10",
    "title": "Oppo F27 Pro+ 5G",
    "description": "India's first IP69 rated waterproof phone with Cosmos Ring camera design.",
    "price": 27999,
    "originalPrice": 32999,
    "discount": "15%",
    "rating": 4.3,
    "reviews": 890,
    "brand": "Oppo",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
    "badge": "",
    "sales": 22
  },
  {
    "id": "custom_11",
    "title": "Xiaomi Redmi Note 15 Pro",
    "description": "200MP camera, 1.5K 120Hz OLED, and Snapdragon 7s Gen 2 for ultimate midrange experience.",
    "price": 25999,
    "originalPrice": 29999,
    "discount": "13%",
    "rating": 4.6,
    "reviews": 4500,
    "brand": "Xiaomi",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&auto=format&fit=crop&q=80",
    "badge": "hot",
    "sales": 150
  },
  {
    "id": "custom_12",
    "title": "Motorola Edge 50 Fusion",
    "description": "Pantone validated colors, ultra-slim curved design, and pure Android experience.",
    "price": 22999,
    "originalPrice": 25999,
    "discount": "11%",
    "rating": 4.7,
    "reviews": 1800,
    "brand": "Motorola",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "badge": "sale",
    "sales": 55
  },
  {
    "id": "custom_13",
    "title": "Apple Vision Pro (Smart Goggles)",
    "description": "Spatial computing headset blending digital content seamlessly with your physical space.",
    "price": 349900,
    "originalPrice": 359900,
    "discount": "2%",
    "rating": 4.8,
    "reviews": 310,
    "brand": "Apple",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&auto=format&fit=crop&q=80",
    "badge": "new",
    "sales": 8
  },
  {
    "id": "custom_14",
    "title": "Samsung Galaxy Watch 7",
    "description": "Advanced health tracking, BioActive sensor, and AI sleep coaching on your wrist.",
    "price": 29999,
    "originalPrice": 34999,
    "discount": "14%",
    "rating": 4.7,
    "reviews": 2100,
    "brand": "Samsung",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    "badge": "hot",
    "sales": 75
  },
  {
    "id": "custom_15",
    "title": "Garmin Fenix 8 Smartwatch",
    "description": "Ultimate multisport GPS smartwatch with solar charging and rugged titanium build.",
    "price": 85990,
    "originalPrice": 89990,
    "discount": "4%",
    "rating": 4.9,
    "reviews": 580,
    "brand": "Garmin",
    "category": "gadgets",
    "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80",
    "badge": "",
    "sales": 12
  },
  {
    "id": "custom_16",
    "title": "Samsung Galaxy F54 5G",
    "description": "Astounding 108MP No Shake Cam with nightography and massive battery for endless usage.",
    "price": 28999,
    "originalPrice": 31999,
    "discount": "9%",
    "rating": 4.5,
    "reviews": 1420,
    "brand": "Samsung",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    "badge": "new",
    "sales": 27
  },
  {
    "id": "custom_1",
    "title": "Apple iPhone 17 Pro Max",
    "description": "The ultimate 2026 flagship with the A19 Pro Bionic chip, holographic display, and titanium body.",
    "price": 159900,
    "originalPrice": 169900,
    "discount": "6%",
    "rating": 4.9,
    "reviews": 1240,
    "brand": "Apple",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
    "badge": "new",
    "sales": 15
  },
  {
    "id": "custom_2",
    "title": "Samsung Galaxy S26 Ultra",
    "description": "Experience the next era of Galaxy AI with a 300MP camera and infinity glass design.",
    "price": 145000,
    "originalPrice": 155000,
    "discount": "6%",
    "rating": 4.8,
    "reviews": 950,
    "brand": "Samsung",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&auto=format&fit=crop&q=80",
    "badge": "hot",
    "sales": 12
  },
  {
    "id": "custom_3",
    "title": "Google Pixel 10 Pro",
    "description": "Google's most advanced AI phone yet, featuring the Tensor G5 chip and pro-level photography.",
    "price": 99999,
    "originalPrice": 109999,
    "discount": "9%",
    "rating": 4.7,
    "reviews": 820,
    "brand": "Google",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "badge": "new",
    "sales": 8
  },
  {
    "id": "custom_4",
    "title": "Sony PlayStation 6 Pro",
    "description": "Next-gen immersive gaming with 8K 120Hz support, haptic VR integration, and instantaneous loading.",
    "price": 65000,
    "originalPrice": 70000,
    "discount": "7%",
    "rating": 4.9,
    "reviews": 2100,
    "brand": "Sony",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&auto=format&fit=crop&q=80",
    "badge": "hot",
    "sales": 25
  },
  {
    "id": "custom_5",
    "title": "Apple MacBook Pro M5 Max",
    "description": "Unmatched performance with the new M5 Max chip, 36-hour battery life, and true-black OLED display.",
    "price": 349900,
    "originalPrice": 359900,
    "discount": "3%",
    "rating": 4.9,
    "reviews": 512,
    "brand": "Apple",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    "badge": "new",
    "sales": 5
  },
  {
    "id": "custom_6",
    "title": "Samsung Odyssey OLED G10",
    "description": "49-inch curved 500Hz gaming monitor with AI upscaling and absolute color accuracy.",
    "price": 180000,
    "originalPrice": 200000,
    "discount": "10%",
    "rating": 4.8,
    "reviews": 340,
    "brand": "Samsung",
    "category": "laptops",
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "custom_7",
    "title": "OnePlus 14",
    "description": "The absolute flagship killer in 2026, delivering blazing speeds and a Hasselblad Quad camera.",
    "price": 74999,
    "originalPrice": 79999,
    "discount": "6%",
    "rating": 4.6,
    "reviews": 670,
    "brand": "OnePlus",
    "category": "smartphones",
    "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    "badge": "sale",
    "sales": 9
  },
  {
    "id": "1",
    "title": "Essence Mascara Lash Princess",
    "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    "price": 799,
    "originalPrice": 959,
    "discount": "10%",
    "rating": 2.56,
    "reviews": 3,
    "brand": "Essence",
    "category": "beauty",
    "image": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    "badge": "new",
    "sales": 1
  },
  {
    "id": "2",
    "title": "Eyeshadow Palette with Mirror",
    "description": "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
    "price": 1599,
    "originalPrice": 1919,
    "discount": "18%",
    "rating": 2.86,
    "reviews": 3,
    "brand": "Glamour Beauty",
    "category": "beauty",
    "image": "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
    "badge": "sale",
    "sales": 2
  },
  {
    "id": "3",
    "title": "Powder Canister",
    "description": "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
    "price": 1199,
    "originalPrice": 1439,
    "discount": "10%",
    "rating": 4.64,
    "reviews": 3,
    "brand": "Velvet Touch",
    "category": "beauty",
    "image": "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
    "badge": "sale",
    "sales": 1
  },
  {
    "id": "4",
    "title": "Red Lipstick",
    "description": "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
    "price": 1039,
    "originalPrice": 1247,
    "discount": "12%",
    "rating": 4.36,
    "reviews": 3,
    "brand": "Chic Cosmetics",
    "category": "beauty",
    "image": "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
    "badge": "new",
    "sales": 9
  },
  {
    "id": "5",
    "title": "Red Nail Polish",
    "description": "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.",
    "price": 719,
    "originalPrice": 863,
    "discount": "11%",
    "rating": 4.32,
    "reviews": 3,
    "brand": "Nail Couture",
    "category": "beauty",
    "image": "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
    "badge": "new",
    "sales": 9
  },
  {
    "id": "6",
    "title": "Calvin Klein CK One",
    "description": "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
    "price": 3999,
    "originalPrice": 4799,
    "discount": "2%",
    "rating": 4.37,
    "reviews": 3,
    "brand": "Calvin Klein",
    "category": "fragrances",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
    "badge": "new",
    "sales": 6
  },
  {
    "id": "7",
    "title": "Chanel Coco Noir Eau De",
    "description": "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.",
    "price": 10399,
    "originalPrice": 12479,
    "discount": "17%",
    "rating": 4.26,
    "reviews": 3,
    "brand": "Chanel",
    "category": "fragrances",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
    "badge": "hot",
    "sales": 6
  },
  {
    "id": "8",
    "title": "Dior J'adore",
    "description": "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
    "price": 7199,
    "originalPrice": 8639,
    "discount": "15%",
    "rating": 3.8,
    "reviews": 3,
    "brand": "Dior",
    "category": "fragrances",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
    "badge": "hot",
    "sales": 4
  },
  {
    "id": "9",
    "title": "Dolce Shine Eau de",
    "description": "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.",
    "price": 5599,
    "originalPrice": 6719,
    "discount": "1%",
    "rating": 3.96,
    "reviews": 3,
    "brand": "Dolce & Gabbana",
    "category": "fragrances",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
    "badge": "sale",
    "sales": 2
  },
  {
    "id": "10",
    "title": "Gucci Bloom Eau de",
    "description": "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
    "price": 6399,
    "originalPrice": 7679,
    "discount": "14%",
    "rating": 2.74,
    "reviews": 3,
    "brand": "Gucci",
    "category": "fragrances",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "11",
    "title": "Annibale Colombo Bed",
    "description": "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.",
    "price": 151999,
    "originalPrice": 182399,
    "discount": "9%",
    "rating": 4.77,
    "reviews": 3,
    "brand": "Annibale Colombo",
    "category": "furniture",
    "image": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
    "badge": "sale",
    "sales": 8
  },
  {
    "id": "12",
    "title": "Annibale Colombo Sofa",
    "description": "The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.",
    "price": 199999,
    "originalPrice": 239999,
    "discount": "14%",
    "rating": 3.92,
    "reviews": 3,
    "brand": "Annibale Colombo",
    "category": "furniture",
    "image": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "13",
    "title": "Bedside Table African Cherry",
    "description": "The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.",
    "price": 23999,
    "originalPrice": 28799,
    "discount": "19%",
    "rating": 2.87,
    "reviews": 3,
    "brand": "Furniture Co.",
    "category": "furniture",
    "image": "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
    "badge": "sale",
    "sales": 1
  },
  {
    "id": "14",
    "title": "Knoll Saarinen Executive Conference Chair",
    "description": "The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.",
    "price": 39999,
    "originalPrice": 47999,
    "discount": "2%",
    "rating": 4.88,
    "reviews": 3,
    "brand": "Knoll",
    "category": "furniture",
    "image": "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "15",
    "title": "Wooden Bathroom Sink With Mirror",
    "description": "The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.",
    "price": 63999,
    "originalPrice": 76799,
    "discount": "9%",
    "rating": 3.59,
    "reviews": 3,
    "brand": "Bath Trends",
    "category": "furniture",
    "image": "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
    "badge": "hot",
    "sales": 1
  },
  {
    "id": "16",
    "title": "Apple",
    "description": "Fresh and crisp apples, perfect for snacking or incorporating into various recipes.",
    "price": 159,
    "originalPrice": 191,
    "discount": "13%",
    "rating": 4.19,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
    "badge": "sale",
    "sales": 5
  },
  {
    "id": "17",
    "title": "Beef Steak",
    "description": "High-quality beef steak, great for grilling or cooking to your preferred level of doneness.",
    "price": 1039,
    "originalPrice": 1247,
    "discount": "10%",
    "rating": 4.47,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
    "badge": "hot",
    "sales": 6
  },
  {
    "id": "18",
    "title": "Cat Food",
    "description": "Nutritious cat food formulated to meet the dietary needs of your feline friend.",
    "price": 719,
    "originalPrice": 863,
    "discount": "10%",
    "rating": 3.13,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "19",
    "title": "Chicken Meat",
    "description": "Fresh and tender chicken meat, suitable for various culinary preparations.",
    "price": 799,
    "originalPrice": 959,
    "discount": "14%",
    "rating": 3.19,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
    "badge": "new",
    "sales": 6
  },
  {
    "id": "20",
    "title": "Cooking Oil",
    "description": "Versatile cooking oil suitable for frying, sautéing, and various culinary applications.",
    "price": 399,
    "originalPrice": 479,
    "discount": "9%",
    "rating": 4.8,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
    "badge": "hot",
    "sales": 10
  },
  {
    "id": "21",
    "title": "Cucumber",
    "description": "Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.",
    "price": 119,
    "originalPrice": 143,
    "discount": "0%",
    "rating": 4.07,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
    "badge": "new",
    "sales": 9
  },
  {
    "id": "22",
    "title": "Dog Food",
    "description": "Specially formulated dog food designed to provide essential nutrients for your canine companion.",
    "price": 879,
    "originalPrice": 1055,
    "discount": "10%",
    "rating": 4.55,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "23",
    "title": "Eggs",
    "description": "Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.",
    "price": 239,
    "originalPrice": 287,
    "discount": "11%",
    "rating": 2.53,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "24",
    "title": "Fish Steak",
    "description": "Quality fish steak, suitable for grilling, baking, or pan-searing.",
    "price": 1199,
    "originalPrice": 1439,
    "discount": "4%",
    "rating": 3.78,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
    "badge": "sale",
    "sales": 7
  },
  {
    "id": "25",
    "title": "Green Bell Pepper",
    "description": "Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.",
    "price": 103,
    "originalPrice": 124,
    "discount": "0%",
    "rating": 3.25,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
    "badge": "sale",
    "sales": 2
  },
  {
    "id": "26",
    "title": "Green Chili Pepper",
    "description": "Spicy green chili pepper, ideal for adding heat to your favorite recipes.",
    "price": 79,
    "originalPrice": 95,
    "discount": "1%",
    "rating": 3.66,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
    "badge": "new",
    "sales": 10
  },
  {
    "id": "27",
    "title": "Honey Jar",
    "description": "Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.",
    "price": 559,
    "originalPrice": 671,
    "discount": "14%",
    "rating": 3.97,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
    "badge": "sale",
    "sales": 8
  },
  {
    "id": "28",
    "title": "Ice Cream",
    "description": "Creamy and delicious ice cream, available in various flavors for a delightful treat.",
    "price": 439,
    "originalPrice": 527,
    "discount": "9%",
    "rating": 3.39,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp",
    "badge": "new",
    "sales": 10
  },
  {
    "id": "29",
    "title": "Juice",
    "description": "Refreshing fruit juice, packed with vitamins and great for staying hydrated.",
    "price": 319,
    "originalPrice": 383,
    "discount": "12%",
    "rating": 3.94,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
    "badge": "sale",
    "sales": 4
  },
  {
    "id": "30",
    "title": "Kiwi",
    "description": "Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.",
    "price": 199,
    "originalPrice": 239,
    "discount": "15%",
    "rating": 4.93,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
    "badge": "sale",
    "sales": 2
  },
  {
    "id": "31",
    "title": "Lemon",
    "description": "Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.",
    "price": 63,
    "originalPrice": 76,
    "discount": "10%",
    "rating": 3.53,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp",
    "badge": "sale",
    "sales": 6
  },
  {
    "id": "32",
    "title": "Milk",
    "description": "Fresh and nutritious milk, a staple for various recipes and daily consumption.",
    "price": 279,
    "originalPrice": 335,
    "discount": "14%",
    "rating": 2.61,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
    "badge": "sale",
    "sales": 1
  },
  {
    "id": "33",
    "title": "Mulberry",
    "description": "Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.",
    "price": 399,
    "originalPrice": 479,
    "discount": "13%",
    "rating": 4.95,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "34",
    "title": "Nescafe Coffee",
    "description": "Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.",
    "price": 639,
    "originalPrice": 767,
    "discount": "2%",
    "rating": 4.82,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp",
    "badge": "new",
    "sales": 8
  },
  {
    "id": "35",
    "title": "Potatoes",
    "description": "Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.",
    "price": 183,
    "originalPrice": 220,
    "discount": "5%",
    "rating": 4.81,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp",
    "badge": "hot",
    "sales": 10
  },
  {
    "id": "36",
    "title": "Protein Powder",
    "description": "Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.",
    "price": 1599,
    "originalPrice": 1919,
    "discount": "8%",
    "rating": 4.18,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp",
    "badge": "hot",
    "sales": 6
  },
  {
    "id": "37",
    "title": "Red Onions",
    "description": "Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.",
    "price": 159,
    "originalPrice": 191,
    "discount": "10%",
    "rating": 4.2,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp",
    "badge": "new",
    "sales": 6
  },
  {
    "id": "38",
    "title": "Rice",
    "description": "High-quality rice, a staple for various cuisines and a versatile base for many dishes.",
    "price": 479,
    "originalPrice": 575,
    "discount": "9%",
    "rating": 3.18,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
    "badge": "sale",
    "sales": 9
  },
  {
    "id": "39",
    "title": "Soft Drinks",
    "description": "Assorted soft drinks in various flavors, perfect for refreshing beverages.",
    "price": 159,
    "originalPrice": 191,
    "discount": "17%",
    "rating": 4.75,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp",
    "badge": "new",
    "sales": 6
  },
  {
    "id": "40",
    "title": "Strawberry",
    "description": "Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.",
    "price": 319,
    "originalPrice": 383,
    "discount": "1%",
    "rating": 3.08,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "41",
    "title": "Tissue Paper Box",
    "description": "Convenient tissue paper box for everyday use, providing soft and absorbent tissues.",
    "price": 199,
    "originalPrice": 239,
    "discount": "13%",
    "rating": 2.69,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "42",
    "title": "Water",
    "description": "Pure and refreshing bottled water, essential for staying hydrated throughout the day.",
    "price": 79,
    "originalPrice": 95,
    "discount": "15%",
    "rating": 4.96,
    "reviews": 3,
    "brand": "Generic",
    "category": "groceries",
    "image": "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "43",
    "title": "Decoration Swing",
    "description": "The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.",
    "price": 4799,
    "originalPrice": 5759,
    "discount": "10%",
    "rating": 3.16,
    "reviews": 3,
    "brand": "Generic",
    "category": "home-decoration",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp",
    "badge": "sale",
    "sales": 6
  },
  {
    "id": "44",
    "title": "Family Tree Photo Frame",
    "description": "The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.",
    "price": 2399,
    "originalPrice": 2879,
    "discount": "15%",
    "rating": 4.53,
    "reviews": 3,
    "brand": "Generic",
    "category": "home-decoration",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp",
    "badge": "new",
    "sales": 3
  },
  {
    "id": "45",
    "title": "House Showpiece Plant",
    "description": "The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.",
    "price": 3199,
    "originalPrice": 3839,
    "discount": "7%",
    "rating": 4.67,
    "reviews": 3,
    "brand": "Generic",
    "category": "home-decoration",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "46",
    "title": "Plant Pot",
    "description": "The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.",
    "price": 1199,
    "originalPrice": 1439,
    "discount": "7%",
    "rating": 3.01,
    "reviews": 3,
    "brand": "Generic",
    "category": "home-decoration",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp",
    "badge": "sale",
    "sales": 4
  },
  {
    "id": "47",
    "title": "Table Lamp",
    "description": "The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.",
    "price": 3999,
    "originalPrice": 4799,
    "discount": "7%",
    "rating": 3.55,
    "reviews": 3,
    "brand": "Generic",
    "category": "home-decoration",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
    "badge": "hot",
    "sales": 1
  },
  {
    "id": "48",
    "title": "Bamboo Spatula",
    "description": "The Bamboo Spatula is a versatile kitchen tool made from eco-friendly bamboo. Ideal for flipping, stirring, and serving various dishes.",
    "price": 639,
    "originalPrice": 767,
    "discount": "3%",
    "rating": 3.27,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "49",
    "title": "Black Aluminium Cup",
    "description": "The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.",
    "price": 479,
    "originalPrice": 575,
    "discount": "16%",
    "rating": 4.46,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp",
    "badge": "sale",
    "sales": 2
  },
  {
    "id": "50",
    "title": "Black Whisk",
    "description": "The Black Whisk is a kitchen essential for whisking and beating ingredients. Its ergonomic handle and sleek design make it a practical and stylish tool.",
    "price": 799,
    "originalPrice": 959,
    "discount": "10%",
    "rating": 3.9,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp",
    "badge": "sale",
    "sales": 8
  },
  {
    "id": "51",
    "title": "Boxed Blender",
    "description": "The Boxed Blender is a powerful and compact blender perfect for smoothies, shakes, and more. Its convenient design and multiple functions make it a versatile kitchen appliance.",
    "price": 3199,
    "originalPrice": 3839,
    "discount": "7%",
    "rating": 4.56,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/thumbnail.webp",
    "badge": "hot",
    "sales": 2
  },
  {
    "id": "52",
    "title": "Carbon Steel Wok",
    "description": "The Carbon Steel Wok is a versatile cooking pan suitable for stir-frying, sautéing, and deep frying. Its sturdy construction ensures even heat distribution for delicious meals.",
    "price": 2399,
    "originalPrice": 2879,
    "discount": "7%",
    "rating": 4.05,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "53",
    "title": "Chopping Board",
    "description": "The Chopping Board is an essential kitchen accessory for food preparation. Made from durable material, it provides a safe and hygienic surface for cutting and chopping.",
    "price": 1039,
    "originalPrice": 1247,
    "discount": "8%",
    "rating": 3.7,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp",
    "badge": "sale",
    "sales": 6
  },
  {
    "id": "54",
    "title": "Citrus Squeezer Yellow",
    "description": "The Citrus Squeezer in Yellow is a handy tool for extracting juice from citrus fruits. Its vibrant color adds a cheerful touch to your kitchen gadgets.",
    "price": 719,
    "originalPrice": 863,
    "discount": "12%",
    "rating": 4.63,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp",
    "badge": "sale",
    "sales": 1
  },
  {
    "id": "55",
    "title": "Egg Slicer",
    "description": "The Egg Slicer is a convenient tool for slicing boiled eggs evenly. It's perfect for salads, sandwiches, and other dishes where sliced eggs are desired.",
    "price": 559,
    "originalPrice": 671,
    "discount": "15%",
    "rating": 3.09,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/thumbnail.webp",
    "badge": "sale",
    "sales": 6
  },
  {
    "id": "56",
    "title": "Electric Stove",
    "description": "The Electric Stove provides a portable and efficient cooking solution. Ideal for small kitchens or as an additional cooking surface for various culinary needs.",
    "price": 3999,
    "originalPrice": 4799,
    "discount": "14%",
    "rating": 4.11,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/thumbnail.webp",
    "badge": "new",
    "sales": 2
  },
  {
    "id": "57",
    "title": "Fine Mesh Strainer",
    "description": "The Fine Mesh Strainer is a versatile tool for straining liquids and sifting dry ingredients. Its fine mesh ensures efficient filtering for smooth cooking and baking.",
    "price": 799,
    "originalPrice": 959,
    "discount": "4%",
    "rating": 3.04,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/thumbnail.webp",
    "badge": "hot",
    "sales": 5
  },
  {
    "id": "58",
    "title": "Fork",
    "description": "The Fork is a classic utensil for various dining and serving purposes. Its durable and ergonomic design makes it a reliable choice for everyday use.",
    "price": 319,
    "originalPrice": 383,
    "discount": "8%",
    "rating": 3.11,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/thumbnail.webp",
    "badge": "new",
    "sales": 9
  },
  {
    "id": "59",
    "title": "Glass",
    "description": "The Glass is a versatile and elegant drinking vessel suitable for a variety of beverages. Its clear design allows you to enjoy the colors and textures of your drinks.",
    "price": 399,
    "originalPrice": 479,
    "discount": "8%",
    "rating": 4.02,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/thumbnail.webp",
    "badge": "new",
    "sales": 3
  },
  {
    "id": "60",
    "title": "Grater Black",
    "description": "The Grater in Black is a handy kitchen tool for grating cheese, vegetables, and more. Its sleek design and sharp blades make food preparation efficient and easy.",
    "price": 879,
    "originalPrice": 1055,
    "discount": "4%",
    "rating": 3.21,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp",
    "badge": "new",
    "sales": 5
  },
  {
    "id": "61",
    "title": "Hand Blender",
    "description": "The Hand Blender is a versatile kitchen appliance for blending, pureeing, and mixing. Its compact design and powerful motor make it a convenient tool for various recipes.",
    "price": 2799,
    "originalPrice": 3359,
    "discount": "17%",
    "rating": 3.86,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/hand-blender/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "62",
    "title": "Ice Cube Tray",
    "description": "The Ice Cube Tray is a practical accessory for making ice cubes in various shapes. Perfect for keeping your drinks cool and adding a fun element to your beverages.",
    "price": 479,
    "originalPrice": 575,
    "discount": "1%",
    "rating": 4.71,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/ice-cube-tray/thumbnail.webp",
    "badge": "new",
    "sales": 7
  },
  {
    "id": "63",
    "title": "Kitchen Sieve",
    "description": "The Kitchen Sieve is a versatile tool for sifting and straining dry and wet ingredients. Its fine mesh design ensures smooth results in your cooking and baking.",
    "price": 639,
    "originalPrice": 767,
    "discount": "19%",
    "rating": 3.09,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/kitchen-sieve/thumbnail.webp",
    "badge": "sale",
    "sales": 5
  },
  {
    "id": "64",
    "title": "Knife",
    "description": "The Knife is an essential kitchen tool for chopping, slicing, and dicing. Its sharp blade and ergonomic handle make it a reliable choice for food preparation.",
    "price": 1199,
    "originalPrice": 1439,
    "discount": "19%",
    "rating": 3.26,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/knife/thumbnail.webp",
    "badge": "sale",
    "sales": 7
  },
  {
    "id": "65",
    "title": "Lunch Box",
    "description": "The Lunch Box is a convenient and portable container for packing and carrying your meals. With compartments for different foods, it's perfect for on-the-go dining.",
    "price": 1039,
    "originalPrice": 1247,
    "discount": "10%",
    "rating": 4.93,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "66",
    "title": "Microwave Oven",
    "description": "The Microwave Oven is a versatile kitchen appliance for quick and efficient cooking, reheating, and defrosting. Its compact size makes it suitable for various kitchen setups.",
    "price": 7199,
    "originalPrice": 8639,
    "discount": "12%",
    "rating": 4.82,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/microwave-oven/thumbnail.webp",
    "badge": "new",
    "sales": 4
  },
  {
    "id": "67",
    "title": "Mug Tree Stand",
    "description": "The Mug Tree Stand is a stylish and space-saving solution for organizing your mugs. Keep your favorite mugs easily accessible and neatly displayed in your kitchen.",
    "price": 1279,
    "originalPrice": 1535,
    "discount": "9%",
    "rating": 2.64,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/mug-tree-stand/thumbnail.webp",
    "badge": "sale",
    "sales": 9
  },
  {
    "id": "68",
    "title": "Pan",
    "description": "The Pan is a versatile and essential cookware item for frying, sautéing, and cooking various dishes. Its non-stick coating ensures easy food release and cleanup.",
    "price": 1999,
    "originalPrice": 2399,
    "discount": "3%",
    "rating": 2.79,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/pan/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "69",
    "title": "Plate",
    "description": "The Plate is a classic and essential dishware item for serving meals. Its durable and stylish design makes it suitable for everyday use or special occasions.",
    "price": 319,
    "originalPrice": 383,
    "discount": "7%",
    "rating": 3.65,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/plate/thumbnail.webp",
    "badge": "new",
    "sales": 8
  },
  {
    "id": "70",
    "title": "Red Tongs",
    "description": "The Red Tongs are versatile kitchen tongs suitable for various cooking and serving tasks. Their vibrant color adds a pop of excitement to your kitchen utensils.",
    "price": 559,
    "originalPrice": 671,
    "discount": "15%",
    "rating": 4.42,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/red-tongs/thumbnail.webp",
    "badge": "new",
    "sales": 3
  },
  {
    "id": "71",
    "title": "Silver Pot With Glass Cap",
    "description": "The Silver Pot with Glass Cap is a stylish and functional cookware item for boiling, simmering, and preparing delicious meals. Its glass cap allows you to monitor cooking progress.",
    "price": 3199,
    "originalPrice": 3839,
    "discount": "6%",
    "rating": 3.22,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp",
    "badge": "sale",
    "sales": 3
  },
  {
    "id": "72",
    "title": "Slotted Turner",
    "description": "The Slotted Turner is a kitchen utensil designed for flipping and turning food items. Its slotted design allows excess liquid to drain, making it ideal for frying and sautéing.",
    "price": 719,
    "originalPrice": 863,
    "discount": "13%",
    "rating": 3.4,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/slotted-turner/thumbnail.webp",
    "badge": "new",
    "sales": 2
  },
  {
    "id": "73",
    "title": "Spice Rack",
    "description": "The Spice Rack is a convenient organizer for your spices and seasonings. Keep your kitchen essentials within reach and neatly arranged with this stylish spice rack.",
    "price": 1599,
    "originalPrice": 1919,
    "discount": "12%",
    "rating": 4.87,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/spice-rack/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "74",
    "title": "Spoon",
    "description": "The Spoon is a versatile kitchen utensil for stirring, serving, and tasting. Its ergonomic design and durable construction make it an essential tool for every kitchen.",
    "price": 399,
    "originalPrice": 479,
    "discount": "2%",
    "rating": 4.03,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/spoon/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "75",
    "title": "Tray",
    "description": "The Tray is a functional and decorative item for serving snacks, appetizers, or drinks. Its stylish design makes it a versatile accessory for entertaining guests.",
    "price": 1359,
    "originalPrice": 1631,
    "discount": "7%",
    "rating": 4.62,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/tray/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "76",
    "title": "Wooden Rolling Pin",
    "description": "The Wooden Rolling Pin is a classic kitchen tool for rolling out dough for baking. Its smooth surface and sturdy handles make it easy to achieve uniform thickness.",
    "price": 959,
    "originalPrice": 1151,
    "discount": "10%",
    "rating": 2.92,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/wooden-rolling-pin/thumbnail.webp",
    "badge": "hot",
    "sales": 7
  },
  {
    "id": "77",
    "title": "Yellow Peeler",
    "description": "The Yellow Peeler is a handy tool for peeling fruits and vegetables with ease. Its bright yellow color adds a cheerful touch to your kitchen gadgets.",
    "price": 479,
    "originalPrice": 575,
    "discount": "12%",
    "rating": 4.24,
    "reviews": 3,
    "brand": "Generic",
    "category": "kitchen-accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/yellow-peeler/thumbnail.webp",
    "badge": "hot",
    "sales": 5
  },
  {
    "id": "83",
    "title": "Blue & Black Check Shirt",
    "description": "The Blue & Black Check Shirt is a stylish and comfortable men's shirt featuring a classic check pattern. Made from high-quality fabric, it's suitable for both casual and semi-formal occasions.",
    "price": 2399,
    "originalPrice": 2879,
    "discount": "15%",
    "rating": 3.64,
    "reviews": 3,
    "brand": "Fashion Trends",
    "category": "mens-shirts",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp",
    "badge": "new",
    "sales": 10
  },
  {
    "id": "84",
    "title": "Gigabyte Aorus Men Tshirt",
    "description": "The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it's perfect for expressing your gaming style.",
    "price": 1999,
    "originalPrice": 2399,
    "discount": "1%",
    "rating": 3.18,
    "reviews": 3,
    "brand": "Gigabyte",
    "category": "mens-shirts",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp",
    "badge": "new",
    "sales": 2
  },
  {
    "id": "85",
    "title": "Man Plaid Shirt",
    "description": "The Man Plaid Shirt is a timeless and versatile men's shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.",
    "price": 2799,
    "originalPrice": 3359,
    "discount": "20%",
    "rating": 3.46,
    "reviews": 3,
    "brand": "Classic Wear",
    "category": "mens-shirts",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp",
    "badge": "hot",
    "sales": 9
  },
  {
    "id": "86",
    "title": "Man Short Sleeve Shirt",
    "description": "The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it's perfect for a laid-back yet polished look.",
    "price": 1599,
    "originalPrice": 1919,
    "discount": "7%",
    "rating": 2.9,
    "reviews": 3,
    "brand": "Casual Comfort",
    "category": "mens-shirts",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp",
    "badge": "new",
    "sales": 6
  },
  {
    "id": "87",
    "title": "Men Check Shirt",
    "description": "The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.",
    "price": 2239,
    "originalPrice": 2687,
    "discount": "11%",
    "rating": 2.72,
    "reviews": 3,
    "brand": "Urban Chic",
    "category": "mens-shirts",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp",
    "badge": "new",
    "sales": 5
  },
  {
    "id": "88",
    "title": "Nike Air Jordan 1 Red And Black",
    "description": "The Nike Air Jordan 1 in Red and Black is an iconic basketball sneaker known for its stylish design and high-performance features, making it a favorite among sneaker enthusiasts and athletes.",
    "price": 11999,
    "originalPrice": 14399,
    "discount": "4%",
    "rating": 4.77,
    "reviews": 3,
    "brand": "Nike",
    "category": "mens-shoes",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp",
    "badge": "sale",
    "sales": 1
  },
  {
    "id": "89",
    "title": "Nike Baseball Cleats",
    "description": "Nike Baseball Cleats are designed for maximum traction and performance on the baseball field. They provide stability and support for players during games and practices.",
    "price": 6399,
    "originalPrice": 7679,
    "discount": "18%",
    "rating": 3.88,
    "reviews": 3,
    "brand": "Nike",
    "category": "mens-shoes",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp",
    "badge": "sale",
    "sales": 9
  },
  {
    "id": "90",
    "title": "Puma Future Rider Trainers",
    "description": "The Puma Future Rider Trainers offer a blend of retro style and modern comfort. Perfect for casual wear, these trainers provide a fashionable and comfortable option for everyday use.",
    "price": 7199,
    "originalPrice": 8639,
    "discount": "4%",
    "rating": 4.9,
    "reviews": 3,
    "brand": "Puma",
    "category": "mens-shoes",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp",
    "badge": "hot",
    "sales": 5
  },
  {
    "id": "91",
    "title": "Sports Sneakers Off White & Red",
    "description": "The Sports Sneakers in Off White and Red combine style and functionality, making them a fashionable choice for sports enthusiasts. The red and off-white color combination adds a bold and energetic touch.",
    "price": 9599,
    "originalPrice": 11519,
    "discount": "5%",
    "rating": 4.77,
    "reviews": 3,
    "brand": "Off White",
    "category": "mens-shoes",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp",
    "badge": "sale",
    "sales": 4
  },
  {
    "id": "92",
    "title": "Sports Sneakers Off White Red",
    "description": "Another variant of the Sports Sneakers in Off White Red, featuring a unique design. These sneakers offer style and comfort for casual occasions.",
    "price": 8799,
    "originalPrice": 10559,
    "discount": "0%",
    "rating": 4.69,
    "reviews": 3,
    "brand": "Off White",
    "category": "mens-shoes",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp",
    "badge": "new",
    "sales": 3
  },
  {
    "id": "93",
    "title": "Brown Leather Belt Watch",
    "description": "The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.",
    "price": 7199,
    "originalPrice": 8639,
    "discount": "6%",
    "rating": 4.19,
    "reviews": 3,
    "brand": "Fashion Timepieces",
    "category": "mens-watches",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
    "badge": "sale",
    "sales": 10
  },
  {
    "id": "94",
    "title": "Longines Master Collection",
    "description": "The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it's a symbol of luxury and sophistication.",
    "price": 119999,
    "originalPrice": 143999,
    "discount": "17%",
    "rating": 3.87,
    "reviews": 3,
    "brand": "Longines",
    "category": "mens-watches",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp",
    "badge": "new",
    "sales": 3
  },
  {
    "id": "95",
    "title": "Rolex Cellini Date Black Dial",
    "description": "The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex's heritage.",
    "price": 719999,
    "originalPrice": 863999,
    "discount": "9%",
    "rating": 4.97,
    "reviews": 3,
    "brand": "Rolex",
    "category": "mens-watches",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp",
    "badge": "sale",
    "sales": 4
  },
  {
    "id": "96",
    "title": "Rolex Cellini Moonphase",
    "description": "The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex's commitment to precision and elegance.",
    "price": 1039999,
    "originalPrice": 1247999,
    "discount": "18%",
    "rating": 2.58,
    "reviews": 3,
    "brand": "Rolex",
    "category": "mens-watches",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp",
    "badge": "sale",
    "sales": 9
  },
  {
    "id": "97",
    "title": "Rolex Datejust",
    "description": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",
    "price": 879999,
    "originalPrice": 1055999,
    "discount": "4%",
    "rating": 3.66,
    "reviews": 3,
    "brand": "Rolex",
    "category": "mens-watches",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp",
    "badge": "sale",
    "sales": 6
  },
  {
    "id": "98",
    "title": "Rolex Submariner Watch",
    "description": "The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it's a symbol of adventure and exploration.",
    "price": 1119999,
    "originalPrice": 1343999,
    "discount": "5%",
    "rating": 2.69,
    "reviews": 3,
    "brand": "Rolex",
    "category": "mens-watches",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp",
    "badge": "hot",
    "sales": 2
  },
  {
    "id": "99",
    "title": "Amazon Echo Plus",
    "description": "The Amazon Echo Plus is a smart speaker with built-in Alexa voice control. It features premium sound quality and serves as a hub for controlling smart home devices.",
    "price": 7999,
    "originalPrice": 9599,
    "discount": "12%",
    "rating": 4.99,
    "reviews": 3,
    "brand": "Amazon",
    "category": "mobile-accessories",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
    "badge": "sale",
    "sales": 2
  },
  {
    "id": "100",
    "title": "Apple Airpods",
    "description": "The Apple Airpods offer a seamless wireless audio experience. With easy pairing, high-quality sound, and Siri integration, they are perfect for on-the-go listening.",
    "price": 10399,
    "originalPrice": 12479,
    "discount": "16%",
    "rating": 4.15,
    "reviews": 3,
    "brand": "Apple",
    "category": "mobile-accessories",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
    "badge": "new",
    "sales": 5
  }
,
  {
    "id": "custom_2000",
    "title": "Samsung Galaxy M34 5G",
    "price": 16999,
    "originalPrice": 22098.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Samsung"
  },
  {
    "id": "custom_2001",
    "title": "Samsung Galaxy F54 5G",
    "price": 24999,
    "originalPrice": 32498.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Samsung"
  },
  {
    "id": "custom_2002",
    "title": "Vivo T2 Pro 5G",
    "price": 23999,
    "originalPrice": 31198.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Vivo"
  },
  {
    "id": "custom_2003",
    "title": "Vivo T2x 5G",
    "price": 12999,
    "originalPrice": 16898.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Vivo"
  },
  {
    "id": "custom_2004",
    "title": "Oppo F23 5G",
    "price": 24999,
    "originalPrice": 32498.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Oppo"
  },
  {
    "id": "custom_2005",
    "title": "Oppo F21s Pro",
    "price": 21999,
    "originalPrice": 28598.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Oppo"
  },
  {
    "id": "custom_2006",
    "title": "Redmi Note 13 Pro",
    "price": 25999,
    "originalPrice": 33798.700000000004,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Xiaomi"
  },
  {
    "id": "custom_2007",
    "title": "Redmi Note 12 5G",
    "price": 15999,
    "originalPrice": 20798.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Xiaomi"
  },
  {
    "id": "custom_2008",
    "title": "Motorola Edge 40 Neo",
    "price": 22999,
    "originalPrice": 29898.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Motorola"
  },
  {
    "id": "custom_2009",
    "title": "Moto G84 5G",
    "price": 18999,
    "originalPrice": 24698.7,
    "badge": "new",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80",
    "category": "smartphones",
    "brand": "Motorola"
  },
  {
    "id": "custom_2010",
    "title": "Samsung Galaxy S24 Ultra",
    "price": 129999,
    "originalPrice": 168998.7,
    "badge": "hot",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    "category": "smartphones",
    "brand": "Samsung"
  },
  {
    "id": "custom_2011",
    "title": "Samsung Galaxy S23",
    "price": 64999,
    "originalPrice": 84498.7,
    "badge": "hot",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    "category": "smartphones",
    "brand": "Samsung"
  },
  {
    "id": "custom_2012",
    "title": "Apple iPhone 15 Pro Max",
    "price": 159900,
    "originalPrice": 207870,
    "badge": "hot",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    "category": "smartphones",
    "brand": "Apple"
  },
  {
    "id": "custom_2013",
    "title": "Apple iPhone 15",
    "price": 79900,
    "originalPrice": 103870,
    "badge": "hot",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    "category": "smartphones",
    "brand": "Apple"
  },
  {
    "id": "custom_2014",
    "title": "Vivo X100 Pro",
    "price": 89999,
    "originalPrice": 116998.7,
    "badge": "hot",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    "category": "smartphones",
    "brand": "Vivo"
  },
  {
    "id": "custom_2015",
    "title": "Oppo Find N3 Flip",
    "price": 94999,
    "originalPrice": 123498.7,
    "badge": "hot",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    "category": "smartphones",
    "brand": "Oppo"
  },
  {
    "id": "custom_2016",
    "title": "Apple Watch Series 9",
    "price": 41900,
    "originalPrice": 54470,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "Apple"
  },
  {
    "id": "custom_2017",
    "title": "Samsung Galaxy Watch 6",
    "price": 29999,
    "originalPrice": 38998.700000000004,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "Samsung"
  },
  {
    "id": "custom_2018",
    "title": "boAt Lunar Connect Smartwatch",
    "price": 1999,
    "originalPrice": 2598.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "boAt"
  },
  {
    "id": "custom_2019",
    "title": "Noise ColorFit Pro 4",
    "price": 2499,
    "originalPrice": 3248.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "Noise"
  },
  {
    "id": "custom_2020",
    "title": "Fire-Boltt Visionary",
    "price": 2999,
    "originalPrice": 3898.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "Fire-Boltt"
  },
  {
    "id": "custom_2021",
    "title": "Meta Quest 3 Smart Goggles",
    "price": 49999,
    "originalPrice": 64998.700000000004,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "Meta"
  },
  {
    "id": "custom_2022",
    "title": "Ray-Ban Meta Smart Glasses",
    "price": 32999,
    "originalPrice": 42898.700000000004,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    "category": "gadgets",
    "brand": "Meta"
  },
  {
    "id": "custom_2023",
    "title": "Sony Bravia 55 inch 4K Ultra HD TV",
    "price": 62990,
    "originalPrice": 81887,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "Sony"
  },
  {
    "id": "custom_2024",
    "title": "Samsung 65 inch QLED 4K TV",
    "price": 89990,
    "originalPrice": 116987,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "Samsung"
  },
  {
    "id": "custom_2025",
    "title": "LG 1.5 Ton 5 Star AI DUAL Inverter AC",
    "price": 45990,
    "originalPrice": 59787,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "LG"
  },
  {
    "id": "custom_2026",
    "title": "Voltas 1.5 Ton 3 Star Split AC",
    "price": 32990,
    "originalPrice": 42887,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "Voltas"
  },
  {
    "id": "custom_2027",
    "title": "Symphony Diet 3D 55i+ Cooler",
    "price": 10499,
    "originalPrice": 13648.7,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "Symphony"
  },
  {
    "id": "custom_2028",
    "title": "Samsung 236 L 3 Star Refrigerator",
    "price": 24490,
    "originalPrice": 31837,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "Samsung"
  },
  {
    "id": "custom_2029",
    "title": "Whirlpool 240 L Frost Free Refrigerator",
    "price": 25990,
    "originalPrice": 33787,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "appliances",
    "brand": "Whirlpool"
  },
  {
    "id": "custom_2030",
    "title": "Intel Core i9-13900K Processor CPU",
    "price": 52999,
    "originalPrice": 68898.7,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "gadgets",
    "brand": "Intel"
  },
  {
    "id": "custom_2031",
    "title": "AMD Ryzen 9 7950X Processor CPU",
    "price": 55999,
    "originalPrice": 72798.7,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "gadgets",
    "brand": "AMD"
  },
  {
    "id": "custom_2032",
    "title": "LG 27 inch 4K UHD Monitor",
    "price": 32000,
    "originalPrice": 41600,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "gadgets",
    "brand": "LG"
  },
  {
    "id": "custom_2033",
    "title": "BenQ 32 inch 4K Designer Monitor",
    "price": 45000,
    "originalPrice": 58500,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "gadgets",
    "brand": "BenQ"
  },
  {
    "id": "custom_2034",
    "title": "Apple MacBook Air M2",
    "price": 99900,
    "originalPrice": 129870,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "laptops",
    "brand": "Apple"
  },
  {
    "id": "custom_2035",
    "title": "Dell XPS 15 Laptop",
    "price": 189990,
    "originalPrice": 246987,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "laptops",
    "brand": "Dell"
  },
  {
    "id": "custom_2036",
    "title": "HP Pavilion 14 Laptop",
    "price": 62990,
    "originalPrice": 81887,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "laptops",
    "brand": "HP"
  },
  {
    "id": "custom_2037",
    "title": "Asus ROG Zephyrus G14",
    "price": 139990,
    "originalPrice": 181987,
    "badge": "sale",
    "image": "https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80",
    "category": "laptops",
    "brand": "Asus"
  },
  {
    "id": "custom_2038",
    "title": "Levis Mens 511 Slim Fit Jeans",
    "price": 2599,
    "originalPrice": 3378.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "bottoms",
    "brand": "Levis"
  },
  {
    "id": "custom_2039",
    "title": "Wrangler Mens Regular Fit Jeans",
    "price": 1999,
    "originalPrice": 2598.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "bottoms",
    "brand": "Wrangler"
  },
  {
    "id": "custom_2040",
    "title": "H&M Mens Cotton Chino Pants",
    "price": 1499,
    "originalPrice": 1948.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "bottoms",
    "brand": "H&M"
  },
  {
    "id": "custom_2041",
    "title": "Allen Solly Mens Casual Trousers",
    "price": 1799,
    "originalPrice": 2338.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "bottoms",
    "brand": "Allen Solly"
  },
  {
    "id": "custom_2042",
    "title": "Zara Mens Turtleneck Sweater",
    "price": 2999,
    "originalPrice": 3898.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-shirts",
    "brand": "Zara"
  },
  {
    "id": "custom_2043",
    "title": "Puma Mens Essential Hoodie",
    "price": 2299,
    "originalPrice": 2988.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-shirts",
    "brand": "Puma"
  },
  {
    "id": "custom_2044",
    "title": "Nike Sportswear Club Fleece Hoodie",
    "price": 3499,
    "originalPrice": 4548.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-shirts",
    "brand": "Nike"
  },
  {
    "id": "custom_2045",
    "title": "Urbanic Womens Bodycon Dress",
    "price": 1299,
    "originalPrice": 1688.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-dresses",
    "brand": "Urbanic"
  },
  {
    "id": "custom_2046",
    "title": "Zara Ribbed Bodycon Midi Dress",
    "price": 2599,
    "originalPrice": 3378.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-dresses",
    "brand": "Zara"
  },
  {
    "id": "custom_2047",
    "title": "H&M Womens Floral Onepiece",
    "price": 1999,
    "originalPrice": 2598.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-dresses",
    "brand": "H&M"
  },
  {
    "id": "custom_2048",
    "title": "Mango Womens A-Line Onepiece",
    "price": 3499,
    "originalPrice": 4548.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-dresses",
    "brand": "Mango"
  },
  {
    "id": "custom_2049",
    "title": "Forever 21 Womens Crop Top",
    "price": 799,
    "originalPrice": 1038.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "tops",
    "brand": "Forever 21"
  },
  {
    "id": "custom_2050",
    "title": "FabIndia Womens Silk Saree",
    "price": 5999,
    "originalPrice": 7798.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "traditional",
    "brand": "FabIndia"
  },
  {
    "id": "custom_2051",
    "title": "Biba Womens Cotton Salwar Suit",
    "price": 2499,
    "originalPrice": 3248.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "traditional",
    "brand": "Biba"
  },
  {
    "id": "custom_2052",
    "title": "Manyavar Mens Kurta Set",
    "price": 3999,
    "originalPrice": 5198.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "traditional",
    "brand": "Manyavar"
  },
  {
    "id": "custom_2053",
    "title": "Nike Air Max Sneakers",
    "price": 8999,
    "originalPrice": 11698.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-shoes",
    "brand": "Nike"
  },
  {
    "id": "custom_2054",
    "title": "Puma RS-X Sneakers",
    "price": 7499,
    "originalPrice": 9748.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-shoes",
    "brand": "Puma"
  },
  {
    "id": "custom_2055",
    "title": "Steve Madden Womens Stiletto Heels",
    "price": 4599,
    "originalPrice": 5978.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-shoes",
    "brand": "Steve Madden"
  },
  {
    "id": "custom_2056",
    "title": "Van Heusen Mens Office Wear Shirt",
    "price": 1599,
    "originalPrice": 2078.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "office-wear",
    "brand": "Van Heusen"
  },
  {
    "id": "custom_2057",
    "title": "Arrow Womens Formal Trousers",
    "price": 1899,
    "originalPrice": 2468.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "office-wear",
    "brand": "Arrow"
  },
  {
    "id": "custom_2058",
    "title": "Calvin Klein Womens Push-Up Bra",
    "price": 2499,
    "originalPrice": 3248.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-innerwear",
    "brand": "Calvin Klein"
  },
  {
    "id": "custom_2059",
    "title": "Calvin Klein Womens Panty Briefs",
    "price": 999,
    "originalPrice": 1298.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-innerwear",
    "brand": "Calvin Klein"
  },
  {
    "id": "custom_2060",
    "title": "Victoria Secret Lace Bralette",
    "price": 3599,
    "originalPrice": 4678.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-innerwear",
    "brand": "Victoria Secret"
  },
  {
    "id": "custom_2061",
    "title": "Victoria Secret Cotton Panty",
    "price": 1299,
    "originalPrice": 1688.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "womens-innerwear",
    "brand": "Victoria Secret"
  },
  {
    "id": "custom_2062",
    "title": "Calvin Klein Mens Trunks 3-Pack",
    "price": 2999,
    "originalPrice": 3898.7000000000003,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-innerwear",
    "brand": "Calvin Klein"
  },
  {
    "id": "custom_2063",
    "title": "Calvin Klein Mens Cotton Vest",
    "price": 1499,
    "originalPrice": 1948.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-innerwear",
    "brand": "Calvin Klein"
  },
  {
    "id": "custom_2064",
    "title": "Macho Mens Sporto Vest",
    "price": 299,
    "originalPrice": 388.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-innerwear",
    "brand": "Macho"
  },
  {
    "id": "custom_2065",
    "title": "Macho Mens Innerwear Briefs",
    "price": 249,
    "originalPrice": 323.7,
    "badge": "",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    "category": "mens-innerwear",
    "brand": "Macho"
  }

];

function generateMockProductsForCategory(catId) {
  if (catId === 'all' || catId === 'trending' || catId === 'new-arrivals') return MASTER_PRODUCTS.slice(0, 36);
  const filtered = MASTER_PRODUCTS.filter(p => p.category === catId);
  return filtered.length > 0 ? filtered : MASTER_PRODUCTS.slice(0, 36);
}

function generateBrandProducts(brand, catId) {
  const filtered = MASTER_PRODUCTS.filter(p => p.brand === brand);
  return filtered.length > 0 ? filtered : MASTER_PRODUCTS.slice(0, 48);
}

function makeStars(rating) {
  return Array.from({length:5},(_,i)=>{
    const f = i < Math.floor(rating) ? 'currentColor' : (i - .5 < rating ? 'currentColor' : 'none');
    const op = i < Math.floor(rating) ? '1' : (i - .5 < rating ? '.5' : '.2');
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="1.5" opacity="${op}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }).join('');
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
window.makeSVG = makeSVG;

function buildCard(p) {
  if (!p) return '';
  const title = p.title || p.name || 'Product';
  const desc = p.description || p.desc || '';
  const brand = p.brand || 'E-Bazaar';
  const rating = p.rating || 4.0;
  const reviews = p.reviews || 0;
  const bCls = { new:'b-new', sale:'b-sale', hot:'b-hot' }[p.badge] || '';
  const bLbl = { new:'New', sale:'Sale', hot:'🔥 Hot' }[p.badge] || '';
  const isWished = typeof window.ebWishlist !== 'undefined' && Array.isArray(window.ebWishlist) ? window.ebWishlist.some(item => item.id === p.id) : false;
  const stroke = isWished ? '#E03E3E' : '#999';
  const wishCls = isWished ? 'cat-wish-btn wished' : 'cat-wish-btn';
  const pStr = encodeURIComponent(JSON.stringify(p)).replace(/'/g, "%27");
  const imgSrc = p.image || p.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80';
  const salesDisplay = p.sales ? (String(p.sales).includes('bought') ? p.sales : `${p.sales} bought in past month`) : '';

  const numPrice = typeof p.price === 'number' ? p.price : (parseInt(String(p.price || 0).replace(/[^\d]/g, '')) || 0);
  const numOrig = typeof p.originalPrice === 'number' ? p.originalPrice : (parseInt(String(p.originalPrice || numPrice).replace(/[^\d]/g, '')) || numPrice);
  const discText = p.discount || p.disc || '0%';
  
  return `<article class="cat-card" role="listitem">
    <a href="product-detail.html?id=${p.id || 'P01'}" class="cat-img" style="display:block; text-decoration:none;">
      <img src="${imgSrc}" alt="${String(title).replace(/"/g, '&quot;')}" loading="lazy" style="width:100%; height:100%; object-fit:cover; background:#f9f9f9;">
      ${p.badge ? `<span class="card-badge ${bCls}">${bLbl}</span>` : ``}
    </a>
    <button class="${wishCls}" style="position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:var(--bg-white);border:1px solid var(--border);display:grid;place-items:center;cursor:pointer;z-index:2;" aria-label="Add to wishlist" onclick="toggleWish('w_${p.id || 'P01'}', '${String(title).replace(/'/g, "\\'")}', '${pStr}')" id="w_${p.id || 'P01'}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </button>
    <div class="cat-body">
      <div class="cat-brand">${brand}</div>
      <a href="product-detail.html?id=${p.id || 'P01'}" class="cat-name" style="display:block;">${title}</a>
      <p class="product-desc-snippet" style="font-size:12px; color:var(--text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; margin-top:4px; margin-bottom:8px; line-height: 1.4;">${desc}</p>
      <div class="cat-prices"><span class="cat-price">₹${numPrice.toLocaleString('en-IN')}</span><span class="cat-orig">₹${numOrig.toLocaleString('en-IN')}</span><span class="cat-disc">${discText} off</span></div>
      <div class="cat-rating"><div class="cat-stars" aria-label="${rating} out of 5">${makeStars(rating)}</div><span class="cat-reviews">${rating} (${reviews})</span></div>
      ${salesDisplay ? `<div class="cat-transactions" style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${salesDisplay}</div>` : ''}
      <button class="cat-add-btn" onclick="addToCart('${pStr}')">+ Add to Cart</button>
    </div>
  </article>`;
}
/* Category Page Specific Logic */
function getBrandLogoSVG(brand) {
    const safeBrand = brand.toLowerCase();
    const imgSrc = BRAND_LOGOS[brand] || `images/logos/${safeBrand}.png`;
    return `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; border-radius:12px; overflow:hidden; background-color:#ffffff;">
      <img src="${imgSrc}" 
      onerror="this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.com'; this.onerror=function(){this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.coop'; this.onerror=function(){this.onerror=null; this.src='https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33'};};" 
      alt="${brand} Logo" style="width:80%; height:80%; object-fit:contain;">
    </div>`;
}

function initDynamicCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');

  if (qParam) {
    const qLower = qParam.trim().toLowerCase();
    const searchWords = qLower.split(/\s+/).filter(Boolean);
    const allPool = (window.MASTER_PRODUCTS || []).concat(window.allProducts || []);
    const uniquePool = Array.from(new Map(allPool.map(item => [item.id || item.title, item])).values());
    const matches = uniquePool.filter(p => {
      const haystack = `${p.title || p.name || ''} ${p.brand || ''} ${p.category || ''} ${p.description || p.desc || ''}`.toLowerCase();
      return searchWords.every(w => haystack.includes(w));
    });

    document.title = `Search Results for "${qParam}" — E-Bazaar`;
    const parentBC = document.getElementById('bc-parent-cat');
    if (parentBC) {
      parentBC.textContent = `Search: "${qParam}"`;
      parentBC.href = `category.html?q=${encodeURIComponent(qParam)}`;
    }

    const searchBrands = Array.from(new Set(matches.map(p => p.brand).filter(Boolean)));
    const brandListEl = document.getElementById('filter-brand-list');
    if (brandListEl) {
      brandListEl.innerHTML = searchBrands.map(brand => `
        <label class="brand-check">
          <input type="checkbox" value="${brand}" checked/>
          <span class="brand-check-name">${brand}</span>
        </label>
      `).join('');
    }

    const grid = document.getElementById('main-cat-grid');
    if (grid) {
      window.currentCategoryProducts = matches;
      grid.innerHTML = matches.length 
        ? matches.map(buildCard).join('') 
        : `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted)">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;opacity:.4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <p style="font-size:16px;margin:0 0 8px">No products found matching "<strong>${qParam}</strong>"</p>
            <p style="font-size:13px;color:var(--text-sub)">Try checking spelling or using more generic search terms.</p>
          </div>`;
    }

    const countEl = document.getElementById('result-count');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${matches.length} products</strong> for "${qParam}"`;
    }
    return;
  }

  let catId = urlParams.get('cat') || 'clothing';
  
  // Default fallback if category not mapped
  if (!CATEGORY_MAP[catId]) catId = 'clothing';
  
  const categoryData = CATEGORY_MAP[catId];

  // Highlight active category in header
  document.querySelectorAll('.mega-item > a').forEach(a => {
    if (a.getAttribute('href') && a.getAttribute('href').includes('cat=' + catId)) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  
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
      <a href="brand-store.html?brand=${brand}&cat=${catId}" class="brand-showcase-card" title="Shop ${brand}">
        ${getBrandLogoSVG(brand)}
      </a>
    `).join('');
  }

  // Generate Products
  const grid = document.getElementById('main-cat-grid');
  if (grid) {
    window.currentCategoryProducts = generateMockProductsForCategory(catId);
    const products = window.currentCategoryProducts;
    grid.innerHTML = products.map(buildCard).join('');
  }

  // Update Result Count
  const countEl = document.getElementById('result-count');
  if (countEl) {
    countEl.innerHTML = `Showing <strong>${categoryData.brands.length * 34} products</strong>`;
  }
}

function initCategoryFilters() {
  initDynamicCategory();

  // Filter accordions
  document.querySelectorAll('.f-section-head').forEach(head => {
    head.addEventListener('click', () => {
      head.closest('.f-section').classList.toggle('open');
    });
  });

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

  function renderFilteredProducts() {
    if (!window.currentCategoryProducts) return;
    let filtered = [...window.currentCategoryProducts];
    
    // Helper to safely extract price as number
    const getNumericPrice = (p) => {
      if (typeof p.price === 'number') return p.price;
      if (!p.price) return 0;
      return parseInt(String(p.price).replace(/[^\d]/g, '')) || 0;
    };

    // Helper to safely extract discount percentage
    const getNumericDiscount = (p) => {
      const discStr = p.discount || p.disc || '0%';
      return parseInt(String(discStr).replace(/[^\d]/g, '')) || 0;
    };

    // Brand filter — only filter if checked brands overlap with current category pool
    const checkedBrands = [...document.querySelectorAll('.brand-check input:checked')].map(cb => cb.value);
    const validPoolBrands = new Set(window.currentCategoryProducts.map(p => p.brand).filter(Boolean));
    const activeRelevantBrands = checkedBrands.filter(b => validPoolBrands.has(b));

    if (activeRelevantBrands.length > 0) {
      filtered = filtered.filter(p => activeRelevantBrands.includes(p.brand));
    }
    
    // Rating filter
    const ratingInput = document.querySelector('.rating-row input:checked');
    if (ratingInput) {
      const minRating = parseFloat(ratingInput.value);
      filtered = filtered.filter(p => parseFloat(p.rating || 0) >= minRating);
    }

    // Discount filter
    const checkedDiscounts = [...document.querySelectorAll('.discount-row input:checked')].map(cb => parseInt(cb.value));
    if (checkedDiscounts.length > 0) {
      const minDiscount = Math.min(...checkedDiscounts);
      filtered = filtered.filter(p => getNumericDiscount(p) >= minDiscount);
    }
    
    // Price filter
    if (minInput && maxInput) {
      const minPrice = parseInt(minInput.value || 0);
      const maxPrice = parseInt(maxInput.value || 1000000);
      filtered = filtered.filter(p => {
        const priceNum = getNumericPrice(p);
        return priceNum >= minPrice && priceNum <= maxPrice;
      });
    }

    // Sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'price-asc') {
        filtered.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
      } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
      } else if (sortVal === 'newest') {
        filtered.sort((a, b) => (b.badge === 'new' ? -1 : (a.badge === 'new' ? 1 : 0)));
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortVal === 'discount') {
        filtered.sort((a, b) => getNumericDiscount(b) - getNumericDiscount(a));
      }
    }

    // Render with Pagination
    window.allFilteredProducts = filtered;
    
    const itemsPerPage = 12;
    if (typeof window.currentPage === 'undefined') window.currentPage = 1;
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    if (window.currentPage > totalPages) window.currentPage = 1;
    
    const startIndex = (window.currentPage - 1) * itemsPerPage;
    const endIndex = window.currentPage * itemsPerPage;
    const visibleProducts = filtered.slice(startIndex, endIndex);
    
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
      grid.innerHTML = visibleProducts.length ? visibleProducts.map(buildCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No products found matching filters.</div>';
    }
    
    const countEl = document.getElementById('result-count');
    if (countEl) {
      const displayStart = visibleProducts.length ? startIndex + 1 : 0;
      const displayEnd = startIndex + visibleProducts.length;
      countEl.innerHTML = `Showing <strong>${displayStart} - ${displayEnd}</strong> of <strong>${filtered.length}</strong> products`;
    }
    
    renderPaginationControls(totalPages);
  }

  window.goToPage = function(page) {
    window.currentPage = page;
    renderFilteredProducts();
    // Scroll to top of grid slightly smoothly
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
       const y = grid.getBoundingClientRect().top + window.scrollY - 150;
       window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  function renderPaginationControls(totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    
    // Start & Prev
    html += `<button class="page-btn" ${window.currentPage === 1 ? 'disabled' : ''} onclick="goToPage(1)">Start</button>`;
    html += `<button class="page-btn" ${window.currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${window.currentPage - 1})">Prev</button>`;
    
    // Page Numbers (Show window of +/- 2)
    let startPage = Math.max(1, window.currentPage - 2);
    let endPage = Math.min(totalPages, window.currentPage + 2);
    
    // Adjust window if near edges
    if (endPage - startPage < 4) {
      if (startPage === 1) endPage = Math.min(totalPages, startPage + 4);
      else if (endPage === totalPages) startPage = Math.max(1, endPage - 4);
    }
    
    if (startPage > 1) {
       html += `<span style="padding: 0 4px; color: var(--text-muted)">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
      html += `<button class="page-btn ${window.currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
       html += `<span style="padding: 0 4px; color: var(--text-muted)">...</span>`;
    }

    // Next & End
    html += `<button class="page-btn" ${window.currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${window.currentPage + 1})">Next</button>`;
    html += `<button class="page-btn" ${window.currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${totalPages})">End</button>`;

    container.innerHTML = html;
    }

  if (minInput) { minInput.addEventListener('input', () => { if (parseInt(minInput.value) >= parseInt(maxInput.value)) minInput.value = parseInt(maxInput.value) - 500; updatePriceUI(); window.currentPage = 1; renderFilteredProducts(); }); }
  if (maxInput) { maxInput.addEventListener('input', () => { if (parseInt(maxInput.value) <= parseInt(minInput.value)) maxInput.value = parseInt(minInput.value) + 500; updatePriceUI(); window.currentPage = 1; renderFilteredProducts(); }); }
  updatePriceUI();

  // Brand checkboxes
  document.getElementById('filter-brand-list')?.addEventListener('change', () => {
    updateFilterTags();
    window.currentPage = 1; renderFilteredProducts();
  });

  document.querySelector('.sort-select')?.addEventListener('change', () => { window.currentPage = 1; renderFilteredProducts(); });

  document.querySelectorAll('.rating-row input').forEach(input => input.addEventListener('change', () => { window.currentPage = 1; renderFilteredProducts(); }));
  document.querySelectorAll('.discount-row input').forEach(input => input.addEventListener('change', () => { window.currentPage = 1; renderFilteredProducts(); }));


  const clearBtn = document.querySelector('.filter-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.brand-check input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.rating-row input, .discount-row input').forEach(i => i.checked = false);
    if (minInput) { minInput.value = minInput.min; }
    if (maxInput) { maxInput.value = maxInput.max; }
    updatePriceUI();
    updateFilterTags();
    window.currentPage = 1; renderFilteredProducts();
    showToast('🔄 Filters cleared');
  });

  // Filter tag removal
  document.addEventListener('click', e => {
    if (e.target.closest('.filter-tag-rm')) {
      const brand = e.target.closest('.filter-tag')?.dataset.brand;
      const cb = document.querySelector(`.brand-check input[value="${brand}"]`);
      if (cb) cb.checked = false;
      e.target.closest('.filter-tag')?.remove();
      window.currentPage = 1; renderFilteredProducts();
    }
  });
  
  // Grid / List toggling
  const viewGridBtn = document.querySelector('.view-btn[aria-label="Grid view"]');
  const viewListBtn = document.querySelector('.view-btn[aria-label="List view"]');
  const mainGrid = document.getElementById('main-cat-grid');
  if (viewGridBtn && viewListBtn && mainGrid) {
    viewGridBtn.addEventListener('click', () => {
      mainGrid.classList.remove('list-view');
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      viewGridBtn.style.color = 'var(--text)';
      viewListBtn.style.color = 'var(--text-muted)';
    });
    viewListBtn.addEventListener('click', () => {
      mainGrid.classList.add('list-view');
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      viewListBtn.style.color = 'var(--text)';
      viewGridBtn.style.color = 'var(--text-muted)';
    });
  }

  updateFilterTags();
  window.currentPage = 1;
  renderFilteredProducts();
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

const API_BASE = 'http://localhost:5000/api';

async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams({ limit: 200, ...params }).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    if (!res.ok) throw new Error(`API responded with status ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    console.error('[E-Bazaar API] fetchProducts failed:', err);
    
    const fallbackHTML = `<div style="padding: 20px; text-align: center; color: red; grid-column: 1/-1;">Backend server is offline or unreachable. Please start the Node.js server.</div>`;
    const gridIds = ['main-cat-grid', 'tr-new', 'tr-trend', 'disc-row-1', 'disc-row-2', 'disc-row-3'];
    gridIds.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = fallbackHTML;
    });
    document.querySelectorAll('.products-grid, .tr-grid').forEach(el => {
      el.innerHTML = fallbackHTML;
    });
    
    return [];
  }
}
window.fetchProducts = fetchProducts;

/* ═══════════════════════════════════════════════════════════════════════
   CART & WISHLIST
   ═══════════════════════════════════════════════════════════════════════ */
function normalizeProduct(p) {
  if (!p) return p;
  const normalized = { ...p };
  normalized.id = p.id;
  normalized.title = p.title || p.name || '';
  normalized.name = p.title || p.name || '';
  
  const rawPrice = p.price;
  const rawOrig = p.originalPrice || p.orig || p.price || 0;
  
  normalized.price = typeof rawPrice === 'number' ? `₹${rawPrice.toLocaleString('en-IN')}` : rawPrice;
  normalized.orig = typeof rawOrig === 'number' ? `₹${rawOrig.toLocaleString('en-IN')}` : rawOrig;
  normalized.originalPrice = typeof rawOrig === 'number' ? rawOrig : (parseInt(String(rawOrig).replace(/[^\d]/g, '')) || 0);
  
  normalized.disc = p.discount || p.disc || '0%';
  normalized.discount = p.discount || p.disc || '0%';
  
  normalized.image = p.image || p.imageUrl || '';
  normalized.imageUrl = p.image || p.imageUrl || '';
  normalized.color = p.color || '#4a4a4a';
  normalized.shape = p.shape || 'tech';
  normalized.brand = p.brand || 'E-Bazaar';
  normalized.rating = p.rating || 5;
  normalized.reviews = p.reviews || 0;
  normalized.description = p.description || '';
  
  return normalized;
}
window.normalizeProduct = normalizeProduct;

var ebCart = [];
try {
  ebCart = JSON.parse(localStorage.getItem('eb_cart_items') || localStorage.getItem('cart') || '[]').map(normalizeProduct);
} catch(e) {
  ebCart = [];
}
window.ebCart = ebCart;
window.cart = ebCart;
var cartCount = ebCart.length;
window.cartCount = cartCount;

var ebWishlist = [];
if (!localStorage.getItem('eb_wishlist')) {
  ebWishlist = [
    { id: 'prod_electronics_0', brand: 'Apple', name: 'Apple iPhone 15 Pro Max', price: '₹1,59,900', orig: '₹1,59,900', disc: '0%', badge: 'hot', color: '#4a4a4a', shape: 'tech', rating: 4.9, reviews: 3421 },
    { id: 'prod_clothing_2', brand: 'Zara', name: 'Zara Premium Wool Jacket', price: '₹7,990', orig: '₹9,990', disc: '20%', badge: 'sale', color: '#B23A48', shape: 'fashion', rating: 4.5, reviews: 856 },
    { id: 'prod_shoes_1', brand: 'Nike', name: 'Nike Air Jordan 1 Retro', price: '₹16,995', orig: '₹18,995', disc: '10%', badge: 'new', color: '#005f73', shape: 'home', rating: 4.8, reviews: 2310 }
  ].map(normalizeProduct);
  localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
} else {
  ebWishlist = JSON.parse(localStorage.getItem('eb_wishlist')).map(normalizeProduct);
}
window.ebWishlist = ebWishlist;
window.wishlist = ebWishlist;

function syncCartBadge() {
  if (window.ebCart) ebCart = window.ebCart;
  cartCount = ebCart.reduce((sum, item) => sum + (item.qty || 1), 0);
  window.cartCount = cartCount;
  document.querySelectorAll('.cart-count-el').forEach(el => el.textContent = cartCount);
  localStorage.setItem('eb_cart_items', JSON.stringify(ebCart));
  localStorage.setItem('cart', JSON.stringify(ebCart));
  if (typeof syncWishlistBadge === 'function') syncWishlistBadge();
}
window.syncCartBadge = syncCartBadge;


function addToCart(pStrEncoded) {
  try {
    const rawP = JSON.parse(decodeURIComponent(pStrEncoded));
    const p = normalizeProduct(rawP);
    const existing = ebCart.find(item => item.id === p.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      p.qty = 1;
      ebCart.push(p);
    }
    syncCartBadge();
    showToast('🛒 Added to cart!');
  } catch(e) {
    console.error('Failed to add to cart', e);
  }
}
window.addToCart = addToCart;

function toggleWish(btnId, title, pStrEncoded) {
  const btn = document.getElementById(btnId);
  const on = btn ? btn.classList.toggle('wished') : true;
  if (btn) {
    btn.querySelector('svg')?.setAttribute('stroke', on ? '#E03E3E' : '#999');
  }
  
  if (pStrEncoded) {
    try {
      const rawP = JSON.parse(decodeURIComponent(pStrEncoded));
      const p = normalizeProduct(rawP);
      if (on) {
        if (!ebWishlist.some(item => item.id === p.id)) {
          ebWishlist.push(p);
          localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
        }
      } else {
        ebWishlist = ebWishlist.filter(item => item.id !== p.id);
        localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
        window.ebWishlist = ebWishlist;
        window.wishlist = ebWishlist;
        if (document.body.dataset.page === 'wishlist') {
            initWishlist();
        }
      }
      window.ebWishlist = ebWishlist;
      window.wishlist = ebWishlist;
    } catch(e) {
      console.error("Error parsing product for wishlist", e);
    }
  }
  
  showToast(on ? '❤️ Added to wishlist' : 'Removed from wishlist');
  if (typeof syncWishlistBadge === 'function') syncWishlistBadge();
}
window.toggleWish = toggleWish;

function syncWishlistBadge() {
  if (window.ebWishlist) ebWishlist = window.ebWishlist;
  const count = (window.ebWishlist || ebWishlist || []).length;
  document.querySelectorAll('.wl-count-el, #wishlist-badge-el').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'grid' : 'none';
  });
}
window.syncWishlistBadge = syncWishlistBadge;

function initWishlistBadge() {
  const wlBtn = document.getElementById('wl-nav-btn');
  if (wlBtn) {
    wlBtn.classList.add('cart-wrap');
    let badge = document.getElementById('wishlist-badge-el');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge wl-count-el';
      badge.id = 'wishlist-badge-el';
      badge.ariaLive = 'polite';
      badge.style.display = 'none';
      wlBtn.appendChild(badge);
    }
    syncWishlistBadge();
  }
}
window.initWishlistBadge = initWishlistBadge;

// Click Event Delegation for global actions (like logout)
document.addEventListener('click', (e) => {
  // Intercept any onclick logout actions globally
  const logoutBtn = e.target.closest('#btn-logout, .logout-btn, [onclick*="logout"]');
  if (logoutBtn) {
    e.preventDefault();
    localStorage.removeItem('ebazaar_token');
    localStorage.removeItem('ebazaar_user');
    localStorage.removeItem('eb_user');
    showToast('👋 Logged out successfully');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }
});

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

let currentBrandProducts = [];
let brandCurrentPage = 1;
const BRAND_ITEMS_PER_PAGE = 12;

function initBrandStore() {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand') || 'Maybelline';
    let cat = urlParams.get('cat');
    if (!cat) {
        cat = getCategoryForBrand(brand);
    }
    
    document.title = `${brand} Official Store — E-Bazaar`;

    const brandHero = document.getElementById('brand-hero');
    if (brandHero) {
        if (cat) {
            const safeCat = cat.toLowerCase();
            let bgImg = `images/banners/banner_${safeCat}.png`;
            brandHero.style.backgroundImage = `url("${bgImg}")`;
        } else {
            brandHero.style.backgroundImage = 'url("images/brand-banner.png")';
        }
    }
    
    // Breadcrumbs
    const bcParentCat = document.getElementById('bc-parent-cat');
    const bcSep2 = document.getElementById('bc-sep-2');
    const bcChildCat = document.getElementById('bc-child-cat');
    
    if (bcParentCat && bcSep2 && bcChildCat) {
        const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
        bcParentCat.textContent = catName;
        bcParentCat.href = `category.html?cat=${cat}`;
        bcSep2.style.display = 'inline-block';
        bcChildCat.style.display = 'inline-block';
        bcChildCat.textContent = brand;
    }
    
    const titleEl = document.getElementById('brand-title');
    if (titleEl) titleEl.textContent = brand;
    
    const logoEl = document.getElementById('brand-logo-large');
    if (logoEl) {
        const safeBrand = brand.toLowerCase();
        const imgSrc = BRAND_LOGOS[brand] || `images/logos/${safeBrand}.png`;
        logoEl.innerHTML = `<img src="${imgSrc}" 
        onerror="this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.com'; this.onerror=function(){this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.coop'; this.onerror=function(){this.onerror=null; this.src='https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33'};};" 
          alt="${brand} Logo" style="width:100%; height:100%; object-fit:contain; border-radius:50%; background-color:#ffffff;">`;
    }
    
    currentBrandProducts = generateBrandProducts(brand, cat);
    brandCurrentPage = 1;
    renderBrandPage();
}

function renderBrandPage() {
    const grid = document.getElementById('main-cat-grid');
    const countEl = document.getElementById('result-count');
    
    if (!grid) return;
    
    const startIndex = (brandCurrentPage - 1) * BRAND_ITEMS_PER_PAGE;
    const endIndex = startIndex + BRAND_ITEMS_PER_PAGE;
    const paginatedItems = currentBrandProducts.slice(startIndex, endIndex);
    
    grid.innerHTML = paginatedItems.map(buildCard).join('');
    
    if (countEl) {
        countEl.innerHTML = `Showing <strong>${startIndex + 1} - ${Math.min(endIndex, currentBrandProducts.length)}</strong> of <strong>${currentBrandProducts.length}</strong> products`;
    }
    
    renderBrandPagination();
}

function populateHomeTracks() {
  if (document.body.dataset.page === 'category') return; // Skip if on category page
  
  const nr = document.getElementById('tr-new');
  if (nr) nr.innerHTML = [...MASTER_PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, 36).map(buildCard).join('');
  
  const tr = document.getElementById('tr-trend');
  if (tr) {
    const trendCats = ['smartphones', 'laptops', 'mens-shirts', 'womens-dresses', 'fragrances'];
    const trendProds = MASTER_PRODUCTS.filter(p => trendCats.includes(p.category)).sort(() => 0.5 - Math.random());
    const otherProds = MASTER_PRODUCTS.filter(p => !trendCats.includes(p.category)).sort(() => 0.5 - Math.random());
    tr.innerHTML = [...trendProds, ...otherProds].slice(0, 36).map(buildCard).join('');
  }
  
  ['row1','row2','row3'].forEach((k,i) => {
    const el = document.getElementById(`disc-row-${i+1}`);
    if (el) {
        const catMap = [['smartphones', 'laptops', 'motorcycle', 'gadgets', 'appliances'], ['mens-shoes', 'womens-shoes', 'mens-shirts', 'womens-dresses', 'tops', 'mens-watches', 'womens-watches', 'bottoms', 'traditional'], ['smartphones', 'laptops', 'gadgets', 'appliances']];
        const prods = MASTER_PRODUCTS.filter(p => catMap[i].includes(p.category)).sort(() => 0.5 - Math.random());
        const fb = MASTER_PRODUCTS.sort(() => 0.5 - Math.random());
        el.innerHTML = (prods.length > 0 ? prods : fb).slice(0, 36).map(buildCard).join('');
    }
  });
}

function renderBrandPagination() {
    const container = document.getElementById('brand-pagination');
    if (!container) return;
    
    const totalPages = Math.ceil(currentBrandProducts.length / BRAND_ITEMS_PER_PAGE);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Start button
    html += `<button class="page-btn" onclick="changeBrandPage(1)" ${brandCurrentPage === 1 ? 'disabled' : ''}>Start</button>`;
    
    // Prev button
    html += `<button class="page-btn" onclick="changeBrandPage(${brandCurrentPage - 1})" ${brandCurrentPage === 1 ? 'disabled' : ''}>Prev</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 5) {
            if (i === 1 || i === totalPages || (i >= brandCurrentPage - 1 && i <= brandCurrentPage + 1)) {
                html += `<button class="page-btn ${i === brandCurrentPage ? 'active' : ''}" onclick="changeBrandPage(${i})">${i}</button>`;
            } else if (i === brandCurrentPage - 2 || i === brandCurrentPage + 2) {
                html += `<span class="page-dots">...</span>`;
            }
        } else {
            html += `<button class="page-btn ${i === brandCurrentPage ? 'active' : ''}" onclick="changeBrandPage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    html += `<button class="page-btn" onclick="changeBrandPage(${brandCurrentPage + 1})" ${brandCurrentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    
    // End button
    html += `<button class="page-btn" onclick="changeBrandPage(${totalPages})" ${brandCurrentPage === totalPages ? 'disabled' : ''}>End</button>`;
    
    container.innerHTML = html;
}

window.changeBrandPage = function(page) {
    const totalPages = Math.ceil(currentBrandProducts.length / BRAND_ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    brandCurrentPage = page;
    renderBrandPage();
    
    const hero = document.getElementById('brand-hero');
    if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
    }
}

// Generate simple mock products for home page tracks if on index

/* ═══════════════════════════════════════════════════════════════════════
   SHARED UTILITIES
   ═══════════════════════════════════════════════════════════════════════ */
// Shared Utilities

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
  document.getElementById('cart-btn')?.addEventListener('click', () => window.location.href = 'cart.html');
  
  const accBtn = document.getElementById('acc-btn');
  if (accBtn) {
    accBtn.addEventListener('click', (e) => {
      // Toggle dropdown if user is logged in
      const isLoggedIn = localStorage.getItem('ebazaar_token') || localStorage.getItem('eb_user');
      if (isLoggedIn) {
        e.preventDefault();
        e.stopPropagation();
        
        let dropdown = document.getElementById('user-dropdown-menu');
        if (!dropdown) {
          dropdown = document.createElement('div');
          dropdown.id = 'user-dropdown-menu';
          dropdown.style.cssText = `
            position: absolute;
            top: 60px;
            right: 20px;
            width: 220px;
            background: var(--bg-dropdown, #FFFFFF);
            border: 1px solid var(--border, #E2CDAF);
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            padding: 8px 0;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
          `;
          
          const style = document.createElement('style');
          style.textContent = `
            #user-dropdown-menu.active {
              display: flex !important;
            }
            .dropdown-item {
              display: flex;
              align-items: center;
              padding: 10px 16px;
              font-size: 14px;
              color: var(--text, #333);
              text-decoration: none;
              transition: background 0.2s ease, color 0.2s ease;
              cursor: pointer;
            }
            .dropdown-item:hover {
              background: var(--bg-alt, #FAF5E1);
              color: var(--accent, #A88C6D);
            }
            .dropdown-divider {
              height: 1px;
              background: var(--border, #E2CDAF);
              margin: 6px 0;
            }
            .dropdown-header {
              padding: 8px 16px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: var(--text-muted, #888);
            }
          `;
          document.head.appendChild(style);
          
          const headerInner = document.querySelector('.nav-top') || document.body;
          headerInner.appendChild(dropdown);
        }
        
        const user = JSON.parse(localStorage.getItem('eb_user') || '{}');
        const userName = (user.name || 'User').toUpperCase();
        dropdown.innerHTML = `
          <div class="dropdown-header">HELLO, ${userName}</div>
          <div class="dropdown-divider"></div>
          <a href="account.html?panel=profile" class="dropdown-item" id="btn-dropdown-profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:10px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </a>
          <a href="account.html?panel=wallet" class="dropdown-item" id="btn-dropdown-wallet">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:10px;"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            My Wallet
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item" id="btn-dropdown-logout" style="color: var(--danger, #D11A2A);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:10px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </a>
        `;
        
        dropdown.classList.toggle('active');

        // Bind profile click
        document.getElementById('btn-dropdown-profile')?.addEventListener('click', (ev) => {
          dropdown.classList.remove('active');
          if (window.location.pathname.includes('account.html')) {
            ev.preventDefault();
            if (typeof window.openAccountPanel === 'function') {
              window.openAccountPanel('profile');
            } else {
              window.location.href = 'account.html?panel=profile';
            }
          }
        });

        // Bind wallet click
        document.getElementById('btn-dropdown-wallet')?.addEventListener('click', (ev) => {
          dropdown.classList.remove('active');
          if (window.location.pathname.includes('account.html')) {
            ev.preventDefault();
            if (typeof window.openAccountPanel === 'function') {
              window.openAccountPanel('wallet');
            } else {
              window.location.href = 'account.html?panel=wallet';
            }
          }
        });

        // Bind logout inside dropdown
        document.getElementById('btn-dropdown-logout')?.addEventListener('click', (ev) => {
          ev.preventDefault();
          localStorage.removeItem('ebazaar_token');
          localStorage.removeItem('ebazaar_user');
          localStorage.removeItem('eb_user');
          if (typeof showToast === 'function') showToast('Logged out successfully');
          setTimeout(() => {
            window.location.href = 'auth.html';
          }, 600);
        });
      }
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown && accBtn && !accBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  document.getElementById('wl-nav-btn')?.addEventListener('click', () => window.location.href = 'wishlist.html');
}

/* ═══════════════════════════════════════════════════════════════════════
   SEARCH ENGINE & AUTOCOMPLETE
   ═══════════════════════════════════════════════════════════════════════ */
function initSearch() {
  const searchInputs = [document.getElementById('q'), document.getElementById('mobile-search')].filter(Boolean);
  const searchBtns = document.querySelectorAll('.search-btn');

  function performSearch(query) {
    const term = (query || '').trim();
    if (!term) {
      if (typeof showToast === 'function') showToast('🔍 Please enter a search term');
      return;
    }
    window.location.href = `category.html?q=${encodeURIComponent(term)}`;
  }

  // Pre-fill query input if currently on category.html with q param
  const currentParams = new URLSearchParams(window.location.search);
  const activeQuery = currentParams.get('q');
  if (activeQuery) {
    searchInputs.forEach(input => { input.value = activeQuery; });
  }

  // Bind keydown (Enter) & submit
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(input.value);
      }
    });
  });

  searchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentInput = btn.closest('.nav-search')?.querySelector('input') || document.getElementById('q');
      if (parentInput) performSearch(parentInput.value);
    });
  });

  // Autocomplete Live Suggestions Dropdown
  const desktopInput = document.getElementById('q');
  if (desktopInput) {
    const parent = desktopInput.closest('.nav-search');
    if (parent) {
      parent.style.position = 'relative';

      let autoBox = document.getElementById('search-autocomplete-dropdown');
      if (!autoBox) {
        autoBox = document.createElement('div');
        autoBox.id = 'search-autocomplete-dropdown';
        autoBox.style.cssText = `
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 6px;
          background: var(--bg-surface, #ffffff);
          border: 1px solid var(--border-line, #e2d9cf);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          z-index: 2000;
          display: none;
          flex-direction: column;
          overflow: hidden;
          max-height: 420px;
          overflow-y: auto;
        `;
        parent.appendChild(autoBox);
      }

      desktopInput.addEventListener('input', () => {
        const val = desktopInput.value.trim().toLowerCase();
        if (val.length < 2) {
          autoBox.style.display = 'none';
          return;
        }

        const pool = (window.MASTER_PRODUCTS || []).concat(window.allProducts || []);
        const uniquePool = Array.from(new Map(pool.map(item => [item.id || item.title, item])).values());
        const searchWords = val.split(/\s+/).filter(Boolean);

        const matches = uniquePool.filter(p => {
          const haystack = `${p.title || p.name || ''} ${p.brand || ''} ${p.category || ''} ${p.description || p.desc || ''}`.toLowerCase();
          return searchWords.every(w => haystack.includes(w));
        }).slice(0, 8);

        if (matches.length === 0) {
          autoBox.innerHTML = `
            <div style="padding: 16px; font-size: 13px; color: var(--text-sub, #666); text-align: center;">
              No matching products found for "<strong>${val}</strong>"
            </div>
          `;
          autoBox.style.display = 'flex';
          return;
        }

        autoBox.innerHTML = matches.map(p => {
          const title = p.title || p.name || 'Product';
          const price = typeof p.price === 'number' ? `₹${p.price.toLocaleString('en-IN')}` : (p.price || '₹0');
          const img = p.image || p.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80';
          const link = p.id ? `product-detail.html?id=${p.id}` : `category.html?q=${encodeURIComponent(title)}`;
          return `
            <a href="${link}" class="auto-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border-line, #e2d9cf); text-decoration: none; color: var(--text-primary, #111); transition: background 0.2s ease;">
              <img src="${img}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #fff; padding: 2px; border: 1px solid #eee;" alt="${title}" />
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</div>
                <div style="font-size: 11px; color: var(--text-sub, #666);">${p.brand || 'E-Bazaar'} &middot; <strong style="color: var(--accent-caramel, #A88C6D);">${price}</strong></div>
              </div>
            </a>
          `;
        }).join('') + `
          <div style="padding: 10px 16px; background: var(--bg-canvas, #faf8f5); text-align: center;">
            <a href="category.html?q=${encodeURIComponent(val)}" style="font-size: 12px; font-weight: 700; color: var(--accent-caramel, #A88C6D); text-decoration: none;">View all results for "${val}" &rarr;</a>
          </div>
        `;

        autoBox.style.display = 'flex';
      });

      document.addEventListener('click', (e) => {
        if (!parent.contains(e.target)) {
          autoBox.style.display = 'none';
        }
      });
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT DETAIL
   ═══════════════════════════════════════════════════════════════════════ */

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
        <button class="btn-add-cart" onclick="addToCart('${encodeURIComponent(JSON.stringify(p)).replace(/'/g, "%27")}')">Add to Cart</button>
        <button class="btn-wishlist ${ebWishlist.some(item => item.id === p.id) ? 'wished' : ''}" onclick="toggleWish('w_pd_${p.id}', '${p.name.replace(/'/g, "\\'")}', '${encodeURIComponent(JSON.stringify(p)).replace(/'/g, "%27")}')" id="w_pd_${p.id}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${ebWishlist.some(item => item.id === p.id) ? '#E03E3E' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
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
  if (typeof initWishlistBadge === 'function') initWishlistBadge();
  populateHomeTracks();
  HeroSlider.init();
  initHamburger();
  initMegaMenu();
    // Brand Directory Active State & Initialization
    if (window.location.pathname.includes('brand-directory.html')) {
      const brandLink = document.getElementById('link-brand-store');
      if (brandLink) {
        brandLink.classList.add('active');
        brandLink.style.borderBottom = '2px solid #A88C6D';
        brandLink.style.paddingBottom = '4px';
      }
      if (typeof initBrandDirectory === 'function') {
        initBrandDirectory();
      }
    }
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
  } else if (document.body.dataset.page === 'orders') {
    initOrders();
  } else if (document.body.dataset.page === 'auth') {
    initAuth();
  } else if (document.body.dataset.page === 'wishlist') {
    initWishlist();
  }
});

// --- WISHLIST PAGE LOGIC ---
function initWishlist() {
  const grid = document.getElementById('wishlist-grid');
  const countEl = document.getElementById('wishlist-count');
  const emptyState = document.getElementById('wishlist-empty');
  const actions = document.getElementById('wishlist-actions');
  
  if (!grid || !emptyState) return;
  
  if (ebWishlist.length === 0) {
    grid.style.display = 'none';
    if (actions) actions.style.display = 'none';
    emptyState.style.display = 'flex';
    if (countEl) countEl.innerText = '(0 Items)';
  } else {
    emptyState.style.display = 'none';
    grid.style.display = 'grid';
    if (actions) actions.style.display = 'flex';
    if (countEl) countEl.innerText = `(${ebWishlist.length} Item${ebWishlist.length !== 1 ? 's' : ''})`;
    grid.innerHTML = ebWishlist.map(buildCard).join('');
  }
}

window.clearWishlist = function() {
  ebWishlist = [];
  localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
  window.ebWishlist = ebWishlist;
  window.wishlist = ebWishlist;
  initWishlist();
  if (typeof syncWishlistBadge === 'function') syncWishlistBadge();
  showToast('Wishlist cleared');
};

window.addAllToCart = function() {
  if (ebWishlist.length === 0) return;
  const count = ebWishlist.length;
  
  // Push all wishlist items to ebCart
  ebWishlist.forEach(item => {
    const existing = ebCart.find(c => c.id === item.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      // Set default quantity if not present
      item.qty = 1;
      ebCart.push(item);
    }
  });
  
  syncCartBadge();
  
  ebWishlist = [];
  localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
  window.ebWishlist = ebWishlist;
  window.wishlist = ebWishlist;
  
  if (document.body.dataset.page === 'wishlist') {
    initWishlist();
  }
  if (typeof syncWishlistBadge === 'function') syncWishlistBadge();
  showToast(`🛒 Moved ${count} items to cart!`);
};

// --- ORDERS PAGE LOGIC ---
function initOrders() {
  const tabs = document.querySelectorAll('.orders-tab');
  const panels = document.querySelectorAll('.tab-panel');

  if (tabs.length && panels.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active to clicked tab
        tab.classList.add('active');

        // Show target panel
        const targetId = tab.dataset.target;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // Invoice Buttons
  const invoiceBtns = document.querySelectorAll('.btn-invoice');
  invoiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.order-card-wrapper');
      let status = 'delivered'; // default
      if (card) {
        if (card.querySelector('.status-shipped')) {
          status = 'pending';
        }
      }
      
      if (typeof showToast === 'function') {
        showToast('Generating invoice... Please wait.');
      }
      
      setTimeout(() => {
        window.open('invoice.html?status=' + status + '&print=true', '_blank');
      }, 600);
    });
  });

  // Return/Replace Modal Logic
  const returnBtns = document.querySelectorAll('.btn-return');
  const returnModal = document.getElementById('return-modal');
  const returnClose = document.getElementById('return-close-btn');
  const returnCancel = document.getElementById('return-form-cancel');
  const returnForm = document.getElementById('return-form');

  if (returnModal) {
    const openReturnModal = (e) => {
      e.preventDefault();
      returnModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeReturnModal = () => {
      returnModal.classList.remove('active');
      document.body.style.overflow = '';
      if (returnForm) returnForm.reset();
    };

    returnBtns.forEach(btn => btn.addEventListener('click', openReturnModal));
    if (returnClose) returnClose.addEventListener('click', closeReturnModal);
    if (returnCancel) returnCancel.addEventListener('click', closeReturnModal);

    // Close on overlay click
    returnModal.addEventListener('click', (e) => {
      if (e.target === returnModal) closeReturnModal();
    });

    // Handle Form Submit
    if (returnForm) {
      returnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeReturnModal();
        if (typeof showToast === 'function') {
          showToast('Return request initiated successfully.');
        }
      });
    }
  }
}

// Global Toast System
window.showToast = function(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'eb-toast';
  toast.innerText = msg;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
};

/* ═══════════════════════════════════════════════════════════════════════
   BRAND DIRECTORY
   ═══════════════════════════════════════════════════════════════════════ */
window.initBrandDirectory = function() {
  const sidebar = document.getElementById('dir-sidebar');
  const contentRoot = document.getElementById('dir-content-root');
  if (!sidebar || !contentRoot) return;

  const FOLDER_TO_CAT = {
    'grocery_logo': { title: 'Groceries', slug: 'groceries' },
    'electronics_logo': { title: 'Electronics', slug: 'electronics' },
    'gadgets_logo': { title: 'Gadgets', slug: 'gadgets' },
    'clothing_logo': { title: 'Clothing', slug: 'clothing' },
    'shoes_logo': { title: 'Shoes', slug: 'shoes' },
    'beauty_logo': { title: 'Beauty', slug: 'beauty' },
    'sports_logo': { title: 'Sports', slug: 'sports' },
    'home & kitchen': { title: 'Home & Kitchen', slug: 'home-kitchen' }
  };

  const categories = {};
  
  // Parse BRAND_LOGOS
  for (const [brandName, path] of Object.entries(BRAND_LOGOS)) {
    const match = path.match(/images\/logos\/([^\/]+)\//);
    if (match) {
      const folder = match[1];
      const catInfo = FOLDER_TO_CAT[folder];
      if (catInfo) {
        if (!categories[catInfo.slug]) {
          categories[catInfo.slug] = { title: catInfo.title, slug: catInfo.slug, brands: [] };
        }
        categories[catInfo.slug].brands.push({ name: brandName, path: path });
      }
    }
  }

  // Generate HTML
  let sidebarHTML = '';
  let contentHTML = '';

  for (const cat of Object.values(categories)) {
    sidebarHTML += `<a href="#${cat.slug}">${cat.title}</a>`;
    
    let gridHTML = '';
    for (const brand of cat.brands) {
      gridHTML += `<a href="brand-store.html?brand=${brand.name}" class="brand-card">
        <img src="${brand.path}" alt="${brand.name}">
      </a>`;
    }

    contentHTML += `
      <div class="dir-cat-block" id="${cat.slug}">
        <h2 class="dir-cat-title">${cat.title}</h2>
        <div class="dir-grid">
          ${gridHTML}
        </div>
      </div>
    `;
  }

  sidebar.innerHTML = sidebarHTML;
  contentRoot.innerHTML = contentHTML;

  // Active state for sidebar on scroll
  const links = sidebar.querySelectorAll('a');
  const sections = document.querySelectorAll('.dir-cat-block');

  // Manual scroll handler to guarantee correct offset
  const scrollToTarget = (targetId, isSmooth = true) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 140; // Height of the sticky header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
           top: offsetPosition,
           behavior: isSmooth ? "smooth" : "auto"
      });
    }
  };

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const targetId = href.substring(1);
      
      // Update URL without native jump
      if (history.pushState) {
          history.pushState(null, null, href);
      } else {
          window.location.hash = href;
      }
      
      scrollToTarget(targetId, true);
    });
  });

  // Handle initial page load with a hash
  if (window.location.hash) {
    setTimeout(() => {
      scrollToTarget(window.location.hash.substring(1), false);
    }, 100);
  }

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      if (pageYOffset >= secTop - 150) {
        current = sec.getAttribute('id');
      }
    });
    
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
};

