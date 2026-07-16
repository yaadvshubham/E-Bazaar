/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — script.js  v3
   Central Engine: Theme · Slider · Hamburger · Mega-Menu · Address Modal
                   Category Filters · Order Tracker · Return Modal
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
   MEGA-MENU — keyboard + touch support
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
      closeTimer = setTimeout(() => deactivate(item), 180);
    });
    const drop = item.querySelector('.mega-drop');
    if (drop) {
      drop.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      drop.addEventListener('mouseleave', () => {
        closeTimer = setTimeout(() => deactivate(item), 180);
      });
    }
    // Keyboard
    const link = item.querySelector('> a');
    if (link) {
      link.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.contains('active') ? deactivate(item) : activate(item);
        }
        if (e.key === 'Escape') deactivate(item);
      });
    }
  });

  // Click outside closes
  document.addEventListener('click', e => {
    if (!e.target.closest('.mega-item') && activeItem) deactivate(activeItem);
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
   PRODUCT DATA (30 items across categories)
   ═══════════════════════════════════════════════════════════════════════ */
const PRODUCTS = {
  newReleases: [
    { id:'n1', brand:'Apple',     name:'AirPods Pro (3rd Gen) — Active Noise Cancellation', price:'₹24,900', orig:'₹29,900', disc:'16%', rating:4.8, reviews:'2.4k', badge:'new',  color:'#1A1A2E', shape:'circle'  },
    { id:'n2', brand:'Nike',      name:'Air Max 270 React — Breathable Running Shoes',       price:'₹9,995',  orig:'₹12,995', disc:'23%', rating:4.7, reviews:'1.8k', badge:'sale', color:'#1C4A2E', shape:'rect'    },
    { id:'n3', brand:'Sony',      name:'WH-1000XM5 Over-Ear Wireless Headphones',            price:'₹27,990', orig:'₹34,990', disc:'20%', rating:4.9, reviews:'5.1k', badge:'hot',  color:'#1C1C1C', shape:'oval'    },
    { id:'n4', brand:'Zara',      name:'Premium Linen Oversized Blazer — Sand Beige',        price:'₹4,490',  orig:'₹5,990',  disc:'25%', rating:4.5, reviews:'890',  badge:'new',  color:'#5C4A2E', shape:'diamond' },
    { id:'n5', brand:'Samsung',   name:'Galaxy Watch 7 Ultra — 47mm Sapphire Crystal',       price:'₹34,999', orig:'₹39,999', disc:'12%', rating:4.6, reviews:'3.2k', badge:'new',  color:'#1A2A4A', shape:'hexagon' },
    { id:'n6', brand:"L'Oréal",   name:'Revitalift 1.5% Hyaluronic Acid Serum 30ml',         price:'₹1,299',  orig:'₹1,699',  disc:'23%', rating:4.4, reviews:'1.5k', badge:'sale', color:'#4A1C2E', shape:'triangle'},
    { id:'n7', brand:'Puma',      name:'Essentials Logo Hoodie — Premium Heavyweight Fleece', price:'₹2,799',  orig:'₹3,999',  disc:'30%', rating:4.3, reviews:'672',  badge:'sale', color:'#2E1A1A', shape:'rect'    },
    { id:'n8', brand:'boAt',      name:'Rockerz 550 Wireless Over-Ear — Bluetooth 5.3',      price:'₹1,499',  orig:'₹3,990',  disc:'62%', rating:4.2, reviews:'9.8k', badge:'hot',  color:'#1A2A1A', shape:'oval'    },
  ],
  trending: [
    { id:'t1', brand:"Levi's",    name:"511 Slim Fit Stretch Jeans — Dark Wash Indigo",      price:'₹3,299',    orig:'₹4,499',   disc:'27%', rating:4.6, reviews:'3.4k', badge:'hot',  color:'#1A2040', shape:'rect'    },
    { id:'t2', brand:'Apple',     name:'MacBook Air M3 — 15-inch Midnight Aluminium',         price:'₹1,34,900', orig:'₹1,49,900',disc:'10%', rating:4.9, reviews:'7.2k', badge:'new',  color:'#1A1A1A', shape:'rect'    },
    { id:'t3', brand:'Nestlé',    name:'KitKat Chunky Choco Bars — 24-pack Box',              price:'₹799',      orig:'₹999',     disc:'20%', rating:4.7, reviews:'4.1k', badge:'hot',  color:'#3A1010', shape:'circle'  },
    { id:'t4', brand:'Nike',      name:'Tech Fleece Full-Zip Hoodie — Carbon Heather Grey',   price:'₹6,995',    orig:'₹8,995',   disc:'22%', rating:4.8, reviews:'2.9k', badge:'hot',  color:'#181818', shape:'rect'    },
    { id:'t5', brand:'Dyson',     name:'V15 Detect Cordless Vacuum — Whole Machine Filter',   price:'₹52,900',   orig:'₹62,900',  disc:'16%', rating:4.8, reviews:'1.1k', badge:'new',  color:'#3A1A4A', shape:'oval'    },
    { id:'t6', brand:'Zara',      name:'Structured Shoulder Midi Dress — Deep Forest Green',  price:'₹3,290',    orig:'₹4,290',   disc:'23%', rating:4.4, reviews:'561',  badge:'new',  color:'#1A3A28', shape:'diamond' },
    { id:'t7', brand:'GoPro',     name:'Hero 13 Black — 5.3K60 HyperSmooth 6.0 Bundle',      price:'₹38,500',   orig:'₹43,500',  disc:'11%', rating:4.7, reviews:'2.3k', badge:'new',  color:'#111111', shape:'hexagon' },
    { id:'t8', brand:'Puma',      name:'Velocity Nitro 3 Running Shoes — Knit Upper',         price:'₹8,499',    orig:'₹10,999',  disc:'23%', rating:4.5, reviews:'1.4k', badge:'sale', color:'#3A2A0A', shape:'circle'  },
  ],
  discovery: {
    row1: [
      { id:'d1',  brand:'OnePlus',     name:'Watch 2R — AMOLED Display, GPS',              price:'₹3,999',  orig:'₹5,499',  disc:'27%', rating:4.3, reviews:'1.2k', badge:'new',  color:'#1A0A0A', shape:'circle'  },
      { id:'d2',  brand:'H&M',         name:'Relaxed Fit Linen Shirt — Summer White',      price:'₹1,499',  orig:'₹2,299',  disc:'35%', rating:4.2, reviews:'845',  badge:'sale', color:'#3A3028', shape:'rect'    },
      { id:'d3',  brand:'Philips',     name:'Air Fryer HD9200 — 4.1L Rapid Air Tech',      price:'₹5,499',  orig:'₹7,999',  disc:'31%', rating:4.5, reviews:'2.8k', badge:'hot',  color:'#1A1A3A', shape:'oval'    },
      { id:'d4',  brand:'Adidas',      name:'Ultraboost 23 — Boost Cushioning',            price:'₹12,999', orig:'₹16,999', disc:'23%', rating:4.7, reviews:'3.1k', badge:'new',  color:'#0A0A1A', shape:'hexagon' },
      { id:'d5',  brand:'Forest',      name:"Men's Canvas Shoes — Olive Green",            price:'₹1,799',  orig:'₹2,999',  disc:'40%', rating:4.1, reviews:'5.6k', badge:'hot',  color:'#1C3020', shape:'circle'  },
      { id:'d6',  brand:'Lakme',       name:'9to5 Primer + Matte Lipstick — Mauve',        price:'₹499',    orig:'₹699',    disc:'29%', rating:4.4, reviews:'4.2k', badge:'sale', color:'#3A1028', shape:'rect'    },
      { id:'d7',  brand:'Campus',      name:'Spirit 3.0 Running Shoes — Navy Blue',        price:'₹2,499',  orig:'₹3,499',  disc:'29%', rating:4.3, reviews:'7.8k', badge:'hot',  color:'#0A1A3A', shape:'diamond' },
      { id:'d8',  brand:'boAt',        name:'Airdopes 181 TWS — IPX4 Water Resistant',     price:'₹899',    orig:'₹2,499',  disc:'64%', rating:4.0, reviews:'11k',  badge:'hot',  color:'#1A0A1A', shape:'circle'  },
      { id:'d9',  brand:'Titan',       name:'Analog-Digital Smartwatch — NXT Pro',         price:'₹7,495',  orig:'₹9,995',  disc:'25%', rating:4.6, reviews:'988',  badge:'new',  color:'#2A2010', shape:'hexagon' },
      { id:'d10', brand:'Maybelline',  name:'Fit Me Matte + Poreless Foundation — 120',    price:'₹299',    orig:'₹399',    disc:'25%', rating:4.3, reviews:'8.9k', badge:'sale', color:'#3A1C18', shape:'oval'    },
    ],
    row2: [
      { id:'d11', brand:'Fossil',      name:'Gen 6 Smartwatch — 44mm Smoke Stainless',     price:'₹14,995', orig:'₹19,995', disc:'25%', rating:4.5, reviews:'1.4k', badge:'new',  color:'#2A2018', shape:'circle'  },
      { id:'d12', brand:'US Polo',     name:'Regular Fit Polo T-Shirt — Cobalt Blue',      price:'₹1,299',  orig:'₹1,999',  disc:'35%', rating:4.4, reviews:'3.2k', badge:'sale', color:'#0A1A3A', shape:'rect'    },
      { id:'d13', brand:'LG',          name:'2-Ton Dual Inverter Window AC — 5 Star',      price:'₹38,990', orig:'₹46,990', disc:'17%', rating:4.6, reviews:'920',  badge:'hot',  color:'#0A0A2A', shape:'hexagon' },
      { id:'d14', brand:'New Balance', name:'Fresh Foam X 1080v13 Running Shoe',           price:'₹16,995', orig:'₹19,995', disc:'15%', rating:4.8, reviews:'2.1k', badge:'new',  color:'#1A1A2A', shape:'oval'    },
      { id:'d15', brand:'Himalaya',    name:'Purifying Neem Face Wash 200ml — Combo',      price:'₹179',    orig:'₹249',    disc:'28%', rating:4.5, reviews:'15k',  badge:'hot',  color:'#0A2010', shape:'circle'  },
      { id:'d16', brand:'Nike',        name:'Pro Dri-FIT Training Shorts — Black',         price:'₹3,295',  orig:'₹4,295',  disc:'23%', rating:4.6, reviews:'1.7k', badge:'sale', color:'#0A0A0A', shape:'rect'    },
      { id:'d17', brand:'Noise',       name:'ColorFit Pro 5 Smartwatch — Ultra Bright',    price:'₹2,499',  orig:'₹4,999',  disc:'50%', rating:4.1, reviews:'6.2k', badge:'hot',  color:'#1A1A1A', shape:'hexagon' },
      { id:'d18', brand:'Bata',        name:'North Star Sneakers — White & Black',         price:'₹1,499',  orig:'₹2,199',  disc:'32%', rating:4.2, reviews:'9.1k', badge:'sale', color:'#1A1A1A', shape:'circle'  },
      { id:'d19', brand:'Mamaearth',   name:'Vitamin C Daily Glow Face Cream 80g',         price:'₹299',    orig:'₹449',    disc:'33%', rating:4.4, reviews:'12k',  badge:'sale', color:'#2A1A08', shape:'oval'    },
      { id:'d20', brand:'Samsung',     name:'Galaxy Buds FE — Active Noise Cancellation',  price:'₹5,999',  orig:'₹8,999',  disc:'33%', rating:4.4, reviews:'3.5k', badge:'new',  color:'#101828', shape:'diamond' },
    ],
    row3: [
      { id:'d21', brand:'Oppo',        name:'Reno 12 Pro 5G — 64MP Portrait Camera',       price:'₹34,999', orig:'₹39,999', disc:'12%', rating:4.5, reviews:'1.8k', badge:'new',  color:'#1A0A2A', shape:'circle'  },
      { id:'d22', brand:'Allen Solly', name:'Slim Fit Formal Trousers — Charcoal',         price:'₹1,799',  orig:'₹2,799',  disc:'36%', rating:4.3, reviews:'2.4k', badge:'sale', color:'#1A1A1A', shape:'rect'    },
      { id:'d23', brand:'Sony',        name:'WF-1000XM5 TWS — Industry Best NC',           price:'₹18,990', orig:'₹24,990', disc:'24%', rating:4.9, reviews:'4.3k', badge:'hot',  color:'#0A0A1A', shape:'oval'    },
      { id:'d24', brand:'Puma',        name:'Suede Classic XXI Sneakers — Black/White',    price:'₹5,999',  orig:'₹7,999',  disc:'25%', rating:4.6, reviews:'3.7k', badge:'new',  color:'#0A0A0A', shape:'hexagon' },
      { id:'d25', brand:'Vivo',        name:'V40 5G — Zeiss Co-Engineered Camera',         price:'₹32,999', orig:'₹37,999', disc:'13%', rating:4.4, reviews:'1.1k', badge:'new',  color:'#1A1028', shape:'circle'  },
      { id:'d26', brand:'H&M',         name:'Wide-Leg Tailored Trousers — Ecru White',     price:'₹2,499',  orig:'₹3,499',  disc:'29%', rating:4.3, reviews:'678',  badge:'new',  color:'#2A2820', shape:'rect'    },
      { id:'d27', brand:'Philips',     name:'3000 Series 43" LED TV — 4K UHD Android',    price:'₹26,990', orig:'₹34,990', disc:'23%', rating:4.5, reviews:'1.5k', badge:'hot',  color:'#0A0A1A', shape:'diamond' },
      { id:'d28', brand:'Comet',       name:'Runner Pro 2.0 — Lightweight EVA Sole',       price:'₹1,999',  orig:'₹2,999',  disc:'33%', rating:4.0, reviews:'3.2k', badge:'sale', color:'#0A1A1A', shape:'oval'    },
      { id:'d29', brand:'Nothing',     name:'CMF Watch Pro 2 — Curved AMOLED, GPS',        price:'₹4,999',  orig:'₹5,999',  disc:'17%', rating:4.6, reviews:'890',  badge:'new',  color:'#101010', shape:'hexagon' },
      { id:'d30', brand:'Mi',          name:'Smart Band 9 — 1.62" AMOLED, 14-day Battery',price:'₹1,999',  orig:'₹2,999',  disc:'33%', rating:4.5, reviews:'22k',  badge:'hot',  color:'#0A1A28', shape:'circle'  },
    ],
  },
};

/* ── SVG placeholder ── */
function makeSVG(color, shape, w = 200, h = 190) {
  const cx = w / 2, cy = h / 2, r = Math.min(cx, cy);
  let inner = '';
  switch (shape) {
    case 'circle':  inner = `<circle cx="${cx}" cy="${cy}" r="${r*.52}" fill="${color}" opacity=".14"/><circle cx="${cx}" cy="${cy}" r="${r*.30}" fill="${color}" opacity=".22"/>`; break;
    case 'oval':    inner = `<ellipse cx="${cx}" cy="${cy}" rx="${r*.62}" ry="${r*.36}" fill="${color}" opacity=".14"/>`;  break;
    case 'diamond': inner = `<polygon points="${cx},${cy*.20} ${cx*1.58},${cy} ${cx},${cy*1.80} ${cx*.42},${cy}" fill="${color}" opacity=".15"/>`;  break;
    case 'hexagon': {
      const pts = Array.from({length:6},(_,i)=>{const a=(Math.PI/3)*i-Math.PI/6;return `${cx+r*.52*Math.cos(a)},${cy+r*.52*Math.sin(a)}`;});
      inner = `<polygon points="${pts.join(' ')}" fill="${color}" opacity=".14"/>`;  break;
    }
    case 'triangle': inner = `<polygon points="${cx},${cy*.18} ${cx*1.76},${cy*1.72} ${cx*.24},${cy*1.72}" fill="${color}" opacity=".15"/>`;  break;
    default:        inner = `<rect x="${cx*.28}" y="${cy*.28}" width="${cx*1.44}" height="${cy*1.44}" rx="8" fill="${color}" opacity=".13"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}<ellipse cx="${cx*.65}" cy="${cy*.40}" rx="${r*.16}" ry="${r*.09}" fill="rgba(255,255,255,.20)" style="filter:blur(3px)"/></svg>`;
}

function makeStars(rating) {
  return Array.from({length:5},(_,i)=>{
    const f = i < Math.floor(rating) ? 'currentColor' : (i - .5 < rating ? 'currentColor' : 'none');
    const op = i < Math.floor(rating) ? '1' : (i - .5 < rating ? '.5' : '.2');
    return `<svg width="11" height="11" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="1.5" opacity="${op}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }).join('');
}

function buildCard(p, small = false) {
  const wid = `w-${p.id}`;
  const bCls = { new:'b-new', sale:'b-sale', hot:'b-hot' }[p.badge] || '';
  const bLbl = { new:'New', sale:'Sale', hot:'🔥 Hot' }[p.badge] || '';
  const n = p.name.replace(/'/g,"\\'");
  const sz = small ? 'small' : 'normal';
  return `<article class="p-card" data-size="${sz}" role="listitem" data-id="${p.id}">
    <div class="card-img">${makeSVG(p.color,p.shape)}${p.badge?`<span class="card-badge ${bCls}">${bLbl}</span>`:''}
      <button class="wish-btn" id="${wid}" aria-label="Add to wishlist" onclick="toggleWish('${wid}','${n}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="card-body">
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-prices"><span class="c-price">${p.price}</span><span class="c-orig">${p.orig}</span><span class="c-disc">${p.disc} off</span></div>
      <div class="card-rating"><div class="stars-row" aria-label="${p.rating} out of 5">${makeStars(p.rating)}</div><span class="rating-count">(${p.reviews})</span></div>
      <button class="add-btn" onclick="addToCart('${p.id}','${n}')">+ Add to Cart</button>
    </div>
  </article>`;
}

function populateTracks() {
  const nr = document.getElementById('tr-new');
  if (nr) nr.innerHTML = PRODUCTS.newReleases.map(p => buildCard(p)).join('');
  const tr = document.getElementById('tr-trend');
  if (tr) tr.innerHTML = PRODUCTS.trending.map(p => buildCard(p)).join('');
  ['row1','row2','row3'].forEach((k,i) => {
    const el = document.getElementById(`disc-row-${i+1}`);
    if (el) el.innerHTML = PRODUCTS.discovery[k].map(p => buildCard(p,true)).join('');
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
   TRACK SCROLL ARROWS
   ═══════════════════════════════════════════════════════════════════════ */
function initTrackArrows() {
  document.querySelectorAll('.track-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.track);
      if (track) track.scrollBy({ left: (btn.classList.contains('left') ? -1 : 1) * 640, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   CATEGORY PAGE — Filters
   ═══════════════════════════════════════════════════════════════════════ */
function initCategoryFilters() {
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
    updateResultCount();
  }

  if (minInput) { minInput.addEventListener('input', () => { if (parseInt(minInput.value) >= parseInt(maxInput.value)) minInput.value = parseInt(maxInput.value) - 500; updatePriceUI(); }); }
  if (maxInput) { maxInput.addEventListener('input', () => { if (parseInt(maxInput.value) <= parseInt(minInput.value)) maxInput.value = parseInt(minInput.value) + 500; updatePriceUI(); }); }
  updatePriceUI();

  // Size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      updateResultCount();
    });
  });

  // Brand checkboxes
  document.querySelectorAll('.brand-check input').forEach(cb => {
    cb.addEventListener('change', () => {
      updateResultCount();
      updateFilterTags();
    });
  });

  // Rating
  document.querySelectorAll('.rating-row input').forEach(r => r.addEventListener('change', updateResultCount));

  // Discount
  document.querySelectorAll('.discount-row input').forEach(d => d.addEventListener('change', updateResultCount));

  // Sort
  const sort = document.getElementById('sort-select');
  if (sort) sort.addEventListener('change', () => showToast(`✅ Sorted by: ${sort.options[sort.selectedIndex].text}`));

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
    updateResultCount();
    showToast('🔄 Filters cleared');
  });

  // Filter tag removal
  document.addEventListener('click', e => {
    if (e.target.closest('.filter-tag-rm')) {
      e.target.closest('.filter-tag')?.remove();
      updateResultCount();
    }
  });

  updateResultCount();
}

function updateResultCount() {
  const el = document.getElementById('result-count');
  if (!el) return;
  const count = Math.floor(Math.random() * 80) + 120;
  el.innerHTML = `Showing <strong>${count} products</strong>`;
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
   ORDER TRACKER PAGE
   ═══════════════════════════════════════════════════════════════════════ */
function initOrderTracker() {
  // Tab switching
  document.querySelectorAll('.orders-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.orders-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  // Animate tracker steps on load
  const steps = document.querySelectorAll('.tracker-step');
  steps.forEach((step, i) => {
    setTimeout(() => {
      if (step.dataset.state === 'done' || step.dataset.state === 'active') {
        step.classList.add(step.dataset.state);
      }
    }, i * 200 + 300);
  });

  // Invoice download mock
  document.querySelectorAll('.inv-dl-btn').forEach(btn => {
    btn.addEventListener('click', () => showToast('📄 Invoice downloaded!'));
  });
}

/* ── Return Modal ── */
const ReturnModal = (() => {
  let currentStep = 1;
  const TOTAL = 3;

  function open(orderId) {
    const modal = document.getElementById('return-modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const title = document.getElementById('return-order-id');
    if (title) title.textContent = orderId || '#EB-2025-0042';
    goToStep(1);
  }

  function close() {
    const modal = document.getElementById('return-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function goToStep(n) {
    currentStep = n;
    document.querySelectorAll('.return-step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
    });
    document.querySelectorAll('.wizard-step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === n);
      s.classList.toggle('done', i + 1 < n);
    });
    const prev = document.getElementById('wizard-prev');
    const next = document.getElementById('wizard-next');
    if (prev) prev.style.display = n === 1 ? 'none' : '';
    if (next) next.textContent = n === TOTAL ? '✅ Submit Request' : 'Next →';
  }

  function init() {
    document.querySelectorAll('.open-return-btn').forEach(btn => {
      btn.addEventListener('click', () => open(btn.dataset.order));
    });

    const closeBtn = document.getElementById('return-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    const overlay = document.getElementById('return-modal');
    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const prevBtn = document.getElementById('wizard-prev');
    const nextBtn = document.getElementById('wizard-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentStep > 1) goToStep(currentStep - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (currentStep < TOTAL) goToStep(currentStep + 1);
      else { close(); showToast('✅ Return request submitted! Pickup in 2-3 days.'); }
    });
  }

  return { init, open, close };
})();

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
   BOOT
   ═══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  syncCartBadge();
  populateTracks();
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
  if (document.body.dataset.page === 'category') initCategoryFilters();
  if (document.body.dataset.page === 'orders') { initOrderTracker(); ReturnModal.init(); }
});
