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

// Mock product generator based on category parameters

// Mock product generator based on category parameters
function generateMockProductsForCategory(catId) {
  const products = [];
  const categoryData = CATEGORY_MAP[catId] || CATEGORY_MAP['all'];
  const allBrands = Object.values(CATEGORY_MAP).filter(c => c.brands).flatMap(c => c.brands);
  
  const productNames = {
    'electronics': ['Smartphone', 'OLED Smart TV', 'Laptop Pro', 'Tablet Ultra', 'Noise Cancelling Earbuds', 'Mirrorless Camera', 'Drone 4K', 'Smartwatch Series', 'Gaming Console', 'VR Headset'],
    'gadgets': ['Wireless Earbuds', 'Smart Speaker', 'Power Bank 20000mAh', 'Fitness Tracker', '4K Webcam', 'Gaming Mouse', 'Mechanical Keyboard', 'Smart Ring', 'Portable Projector', 'Dash Cam'],
    'clothing': ['T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Cashmere Sweater', 'Summer Dress', 'Cargo Shorts', 'Puffer Coat', 'Athleisure Set', 'Formal Blazer', 'Linen Shirt'],
    'shoes': ['Sneakers', 'Running Shoes', 'Formal Oxfords', 'Trekking Boots', 'Slip-on Loafers', 'High-Top Kicks', 'Basketball Shoes', 'Flip Flops', 'Chelsea Boots', 'Trainers'],
    'beauty': ['Face Wash', 'Hydrating Moisturizer', 'Matte Lipstick', 'SPF 50 Sunscreen', 'Eau De Parfum', 'Vitamin C Serum', 'Anti-aging Cream', 'Eye Contour Gel', 'Hair Treatment Mask', 'Foundation'],
    'sports': ['Badminton Racket', 'Pro Football', 'Eco Yoga Mat', 'Adjustable Dumbbells', 'Tennis Ball Pack', 'Skipping Rope', 'Resistance Bands', 'Protein Shaker', 'Cycling Helmet', 'Treadmill'],
    'home-kitchen': ['Blender Pro', 'Non-stick Cookware Set', 'Ceramic Dinner Set', 'Insulated Water Bottle', 'Glass Storage Container', 'Mixer Grinder', 'Air Fryer', 'Smart Coffee Maker', 'Vacuum Cleaner', 'Microwave Oven'],
    'groceries': ['Premium Atta', 'Basmati Rice', 'Organic Dal', 'Olive Oil', 'Green Tea', 'Instant Coffee', 'Dry Fruits Mix', 'Dark Chocolate', 'Quinoa', 'Peanut Butter']
  };
  const categoryNames = productNames[catId] || ['Premium Item', 'Signature Product', 'Exclusive Collection', 'Limited Edition', 'Bestseller'];
  
  // Assign brands correctly based on category context
  for(let i=0; i<36; i++) {
    let brand;
    if (catId === 'all' || catId === 'trending' || catId === 'new-arrivals') {
      brand = allBrands[Math.floor(Math.random() * allBrands.length)] || 'E-Bazaar Exclusive';
    } else if (categoryData.brands && categoryData.brands.length > 0) {
      brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
    } else {
      brand = 'E-Bazaar Exclusive';
    }
    
    const itemName = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    products.push({
      id: `prod_${catId}_${i}`,
      brand: brand,
      name: `${brand} ${itemName} - Edition ${i+1}`,
      price: `₹${(Math.floor(Math.random() * 80) + 10) * 100}`,
      orig: `₹${(Math.floor(Math.random() * 120) + 90) * 100}`,
      disc: `${Math.floor(Math.random() * 50) + 10}%`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: `${Math.floor(Math.random() * 1500) + 50}`,
      badge: Math.random() > 0.8 ? 'new' : (Math.random() > 0.6 ? 'sale' : (Math.random() > 0.9 ? 'hot' : '')),
      color: `hsl(${Math.floor(Math.random() * 360)}, 25%, 35%)`,
      shape: ['circle','oval','diamond','hexagon','rect'][Math.floor(Math.random()*5)]
    });
  }
  return products;
}

function generateBrandProducts(brand, catId) {
    const products = [];
    const productNames = {
        'electronics': ['Smartphone', 'OLED Smart TV', 'Laptop Pro', 'Tablet Ultra', 'Noise Cancelling Earbuds', 'Mirrorless Camera', 'Drone 4K', 'Smartwatch Series', 'Gaming Console', 'VR Headset'],
        'gadgets': ['Wireless Earbuds', 'Smart Speaker', 'Power Bank 20000mAh', 'Fitness Tracker', '4K Webcam', 'Gaming Mouse', 'Mechanical Keyboard', 'Smart Ring', 'Portable Projector', 'Dash Cam'],
        'clothing': ['T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Cashmere Sweater', 'Summer Dress', 'Cargo Shorts', 'Puffer Coat', 'Athleisure Set', 'Formal Blazer', 'Linen Shirt'],
        'shoes': ['Sneakers', 'Running Shoes', 'Formal Oxfords', 'Trekking Boots', 'Slip-on Loafers', 'High-Top Kicks', 'Basketball Shoes', 'Flip Flops', 'Chelsea Boots', 'Trainers'],
        'beauty': ['Face Wash', 'Hydrating Moisturizer', 'Matte Lipstick', 'SPF 50 Sunscreen', 'Eau De Parfum', 'Vitamin C Serum', 'Anti-aging Cream', 'Eye Contour Gel', 'Hair Treatment Mask', 'Foundation'],
        'sports': ['Badminton Racket', 'Pro Football', 'Eco Yoga Mat', 'Adjustable Dumbbells', 'Tennis Ball Pack', 'Skipping Rope', 'Resistance Bands', 'Protein Shaker', 'Cycling Helmet', 'Treadmill'],
        'home-kitchen': ['Blender Pro', 'Non-stick Cookware Set', 'Ceramic Dinner Set', 'Insulated Water Bottle', 'Glass Storage Container', 'Mixer Grinder', 'Air Fryer', 'Smart Coffee Maker', 'Vacuum Cleaner', 'Microwave Oven'],
        'groceries': ['Premium Atta', 'Basmati Rice', 'Organic Dal', 'Olive Oil', 'Green Tea', 'Instant Coffee', 'Dry Fruits Mix', 'Dark Chocolate', 'Quinoa', 'Peanut Butter']
    };
    
    // For brand store, strictly generate only this brand's products
    let catNames = [];
    if (catId && productNames[catId]) {
        catNames = productNames[catId];
    } else {
        // Mix if unknown category
        catNames = Object.values(productNames).flat();
    }
    
    // Generate massive list for brand store (48 items)
    for(let i=0; i<48; i++) {
        const itemName = catNames[Math.floor(Math.random() * catNames.length)];
        products.push({
            id: `prod_brand_${brand}_${i}`,
            brand: brand,
            name: `${brand} ${itemName} - Signature ${i+1}`,
            price: `₹${(Math.floor(Math.random() * 80) + 15) * 100}`,
            orig: `₹${(Math.floor(Math.random() * 120) + 95) * 100}`,
            disc: `${Math.floor(Math.random() * 45) + 5}%`,
            rating: (Math.random() * 1.0 + 4.0).toFixed(1),
            reviews: `${Math.floor(Math.random() * 3000) + 100}`,
            badge: Math.random() > 0.85 ? 'new' : (Math.random() > 0.7 ? 'sale' : (Math.random() > 0.9 ? 'hot' : '')),
            color: `hsl(${Math.floor(Math.random() * 360)}, 25%, 35%)`,
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
  const isWished = ebWishlist.some(item => item.id === p.id);
  const stroke = isWished ? '#E03E3E' : '#999';
  const wishCls = isWished ? 'cat-wish-btn wished' : 'cat-wish-btn';
  const pStr = encodeURIComponent(JSON.stringify(p)).replace(/'/g, "%27");
  return `<article class="cat-card" role="listitem">
    <a href="product-detail.html?id=${p.id}" class="cat-img" style="display:block; text-decoration:none;">${makeSVG(p.color,p.shape)}${p.badge?`<span class="card-badge ${bCls}">${bLbl}</span>`:''}</a>
    <button class="${wishCls}" style="position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:var(--bg-white);border:1px solid var(--border);display:grid;place-items:center;cursor:pointer;z-index:2;" aria-label="Add to wishlist" onclick="toggleWish('w_${p.id}', '${p.name.replace(/'/g, "\\'")}', '${pStr}')" id="w_${p.id}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </button>
    <div class="cat-body">
      <div class="cat-brand">${p.brand}</div>
      <a href="product-detail.html?id=${p.id}" class="cat-name" style="display:block;">${p.name}</a>
      <div class="cat-prices"><span class="cat-price">${p.price}</span><span class="cat-orig">${p.orig}</span><span class="cat-disc">${p.disc} off</span></div>
      <div class="cat-rating"><div class="cat-stars" aria-label="${p.rating} out of 5">${makeStars(p.rating)}</div><span class="cat-reviews">${p.rating} (${p.reviews})</span></div>
      <div class="cat-transactions" style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${p.bought}k+ bought in past month</div>
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
    
    // Brand filter
    const checkedBrands = [...document.querySelectorAll('.brand-check input:checked')].map(cb => cb.value);
    if (checkedBrands.length > 0) {
      filtered = filtered.filter(p => checkedBrands.includes(p.brand));
    }
    
    // Rating filter
    const ratingInput = document.querySelector('.rating-row input:checked');
    if (ratingInput) {
      const minRating = parseInt(ratingInput.value);
      filtered = filtered.filter(p => parseFloat(p.rating) >= minRating);
    }

    // Discount filter
    const checkedDiscounts = [...document.querySelectorAll('.discount-row input:checked')].map(cb => parseInt(cb.value));
    if (checkedDiscounts.length > 0) {
      const minDiscount = Math.min(...checkedDiscounts);
      filtered = filtered.filter(p => {
        const discStr = p.disc || '0%';
        const discNum = parseInt(discStr.replace('%', ''));
        return discNum >= minDiscount;
      });
    }
    
    // Price filter
    if (minInput && maxInput) {
      const minPrice = parseInt(minInput.value || 0);
      const maxPrice = parseInt(maxInput.value || 100000);
      filtered = filtered.filter(p => {
        const priceNum = parseInt(p.price.replace(/[^\d]/g, ''));
        return priceNum >= minPrice && priceNum <= maxPrice;
      });
    }

    // Sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'price-asc') {
        filtered.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, '')));
      } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, '')));
      } else if (sortVal === 'newest') {
        filtered.sort((a, b) => (b.badge === 'new' ? -1 : (a.badge === 'new' ? 1 : 0)));
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortVal === 'discount') {
        filtered.sort((a, b) => parseInt((b.disc || '0%').replace('%','')) - parseInt((a.disc || '0%').replace('%','')));
      }
    }

    // Render
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
      grid.innerHTML = filtered.length ? filtered.map(buildCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No products found matching filters.</div>';
    }
    
    const countEl = document.getElementById('result-count');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filtered.length} products</strong>`;
    }
  }

  if (minInput) { minInput.addEventListener('input', () => { if (parseInt(minInput.value) >= parseInt(maxInput.value)) minInput.value = parseInt(maxInput.value) - 500; updatePriceUI(); renderFilteredProducts(); }); }
  if (maxInput) { maxInput.addEventListener('input', () => { if (parseInt(maxInput.value) <= parseInt(minInput.value)) maxInput.value = parseInt(minInput.value) + 500; updatePriceUI(); renderFilteredProducts(); }); }
  updatePriceUI();

  // Brand checkboxes
  document.getElementById('filter-brand-list')?.addEventListener('change', () => {
    updateFilterTags();
    renderFilteredProducts();
  });

  document.querySelector('.sort-select')?.addEventListener('change', renderFilteredProducts);

  document.querySelectorAll('.rating-row input').forEach(input => input.addEventListener('change', renderFilteredProducts));
  document.querySelectorAll('.discount-row input').forEach(input => input.addEventListener('change', renderFilteredProducts));


  const clearBtn = document.querySelector('.filter-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.brand-check input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.rating-row input, .discount-row input').forEach(i => i.checked = false);
    if (minInput) { minInput.value = minInput.min; }
    if (maxInput) { maxInput.value = maxInput.max; }
    updatePriceUI();
    updateFilterTags();
    renderFilteredProducts();
    showToast('🔄 Filters cleared');
  });

  // Filter tag removal
  document.addEventListener('click', e => {
    if (e.target.closest('.filter-tag-rm')) {
      const brand = e.target.closest('.filter-tag')?.dataset.brand;
      const cb = document.querySelector(`.brand-check input[value="${brand}"]`);
      if (cb) cb.checked = false;
      e.target.closest('.filter-tag')?.remove();
      renderFilteredProducts();
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
let ebCart = [];
if (!localStorage.getItem('eb_cart_items')) {
  ebCart = [];
} else {
  try { ebCart = JSON.parse(localStorage.getItem('eb_cart_items')); } catch(e) { ebCart = []; }
}
let cartCount = ebCart.length;

let ebWishlist = [];
if (!localStorage.getItem('eb_wishlist')) {
  ebWishlist = [
    { id: 'prod_electronics_0', brand: 'Apple', name: 'Apple iPhone 15 Pro Max', price: '₹1,59,900', orig: '₹1,59,900', disc: '0%', badge: 'hot', color: '#4a4a4a', shape: 'tech', rating: 4.9, reviews: 3421 },
    { id: 'prod_clothing_2', brand: 'Zara', name: 'Zara Premium Wool Jacket', price: '₹7,990', orig: '₹9,990', disc: '20%', badge: 'sale', color: '#B23A48', shape: 'fashion', rating: 4.5, reviews: 856 },
    { id: 'prod_shoes_1', brand: 'Nike', name: 'Nike Air Jordan 1 Retro', price: '₹16,995', orig: '₹18,995', disc: '10%', badge: 'new', color: '#005f73', shape: 'home', rating: 4.8, reviews: 2310 }
  ];
  localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
} else {
  ebWishlist = JSON.parse(localStorage.getItem('eb_wishlist'));
}

function syncCartBadge() {
  cartCount = ebCart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll('.cart-count-el').forEach(el => el.textContent = cartCount);
  localStorage.setItem('eb_cart_items', JSON.stringify(ebCart));
}

function addToCart(pStrEncoded) {
  try {
    const p = JSON.parse(decodeURIComponent(pStrEncoded));
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

function toggleWish(btnId, title, pStrEncoded) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const on = btn.classList.toggle('wished');
  btn.querySelector('svg')?.setAttribute('stroke', on ? '#E03E3E' : '#999');
  
  if (pStrEncoded) {
    try {
      const p = JSON.parse(decodeURIComponent(pStrEncoded));
      if (on) {
        if (!ebWishlist.some(item => item.id === p.id)) {
          ebWishlist.push(p);
          localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
        }
      } else {
        ebWishlist = ebWishlist.filter(item => item.id !== p.id);
        localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
        if (document.body.dataset.page === 'wishlist') {
            initWishlist();
        }
      }
    } catch(e) {
      console.error("Error parsing product for wishlist", e);
    }
  }
  
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
function populateHomeTracks() {
  if (document.body.dataset.page === 'category') return; // Skip if on category page
  
  const nr = document.getElementById('tr-new');
  if (nr) nr.innerHTML = generateMockProductsForCategory('electronics').slice(0,36).map(buildCard).join('');
  
  const tr = document.getElementById('tr-trend');
  if (tr) tr.innerHTML = generateMockProductsForCategory('clothing').slice(0,36).map(buildCard).join('');
  
  ['row1','row2','row3'].forEach((k,i) => {
    const el = document.getElementById(`disc-row-${i+1}`);
    if (el) el.innerHTML = generateMockProductsForCategory(i === 0 ? 'gadgets' : i === 1 ? 'shoes' : 'beauty').slice(0,36).map(buildCard).join('');
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
  document.getElementById('cart-btn')?.addEventListener('click', () => window.location.href = 'cart.html');
  document.getElementById('acc-btn')?.addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('eb_user'));
    window.location.href = user ? 'account.html' : 'auth.html';
  });
  document.getElementById('wl-nav-btn')?.addEventListener('click', () => window.location.href = 'wishlist.html');
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
  initWishlist();
  showToast('Wishlist cleared');
};

window.addAllToCart = function() {
  if (ebWishlist.length === 0) return;
  const count = ebWishlist.length;
  cartCount += count;
  syncCartBadge();
  ebWishlist = [];
  localStorage.setItem('eb_wishlist', JSON.stringify(ebWishlist));
  if (document.body.dataset.page === 'wishlist') {
    initWishlist();
  }
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

