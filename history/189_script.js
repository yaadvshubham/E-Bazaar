/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — js/script.js (Central Controller)
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  
  // ── Global: Header Scroll State ──
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // ── Global: Address Modal Logic ──
  const locTrigger = document.getElementById('loc-trigger');
  const addrModal = document.getElementById('addr-modal');
  const addrClose = document.getElementById('addr-close');
  if (locTrigger && addrModal && addrClose) {
    locTrigger.addEventListener('click', () => addrModal.classList.add('open'));
    addrClose.addEventListener('click', () => addrModal.classList.remove('open'));
    addrModal.addEventListener('click', (e) => {
      if (e.target === addrModal) addrModal.classList.remove('open');
    });
    // Toggle active address
    const cards = addrModal.querySelectorAll('.addr-card');
    cards.forEach(c => {
      c.addEventListener('click', () => {
        cards.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        setTimeout(() => addrModal.classList.remove('open'), 300);
      });
    });
  }

  // ── Data: Category Brands (Expanded) ──
  const catData = {
    groceries: { title: "Groceries & Essentials", brands: ["Amul", "Nestle", "Britannia", "Tata", "Mother Dairy", "ITC", "HUL", "Patanjali"] },
    electronics: { title: "Electronics", brands: ["Apple", "Samsung", "Sony", "LG", "OnePlus", "Dell", "HP", "Lenovo"] },
    clothing: { title: "Fashion & Clothing", brands: ["Zara", "H&M", "Levi's", "Allen Solly", "FabIndia", "Puma", "Biba", "W"] },
    shoes: { title: "Footwear", brands: ["Nike", "Adidas", "Puma", "Reebok", "Skechers", "Clarks", "Woodland", "Bata"] },
    beauty: { title: "Beauty & Personal Care", brands: ["L'Oréal", "Maybelline", "MAC", "Lakme", "Nykaa", "Clinique", "The Body Shop", "Plum"] },
    sports: { title: "Sports & Fitness", brands: ["Decathlon", "Nivia", "Cosco", "Yonex", "Golds Gym", "Quechua", "Wilson", "Speedo"] },
    'home-kitchen': { title: "Home & Kitchen", brands: ["Prestige", "Wonderchef", "Philips", "Pigeon", "Hawkins", "Bombay Dyeing", "Home Centre", "Cello"] },
    gadgets: { title: "Smart Gadgets", brands: ["Boat", "Noise", "Fire-Boltt", "Garmin", "Fitbit", "Realme", "Xiaomi", "DJI"] },
  };

  // ── Page: Index ──
  if (page === 'index') {
    // Hero Slider
    let currentSlide = 0;
    const track = document.getElementById('heroTrack');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = dots.length;

    const updateSlider = () => {
      if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    };

    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentSlide = index;
          updateSlider();
        });
      });
      setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
      }, 5000);
    }

    // Mock Trending Products (Mix of brands)
    const grid = document.getElementById('trending-grid');
    if (grid) {
      const trendingMocks = [
        { brand: 'Apple', name: 'AirPods Pro 2', price: '₹24,900' },
        { brand: 'Nike', name: 'Air Jordan 1', price: '₹14,295' },
        { brand: 'Sony', name: 'PS5 Console', price: '₹54,990' },
        { brand: 'Zara', name: 'Oversized Wool Coat', price: '₹8,990' },
        { brand: 'L\'Oréal', name: 'Revitalift Serum', price: '₹899' },
      ];
      grid.innerHTML = trendingMocks.map(p => `
        <div class="p-card">
          <div class="p-img"><div class="p-badge">Hot</div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
          <div class="p-body">
            <div class="p-brand">${p.brand}</div>
            <div class="p-name">${p.name}</div>
            <div class="p-price">${p.price}</div>
            <button class="p-add">Add to Cart</button>
          </div>
        </div>
      `).join('');
    }
  }

  // ── Page: Category ──
  if (page === 'category') {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('cat') || 'electronics'; // fallback
    const data = catData[catId] || catData['electronics'];

    // Set Title
    document.getElementById('dynamic-cat-title').textContent = data.title;
    document.title = `${data.title} — E-Bazaar`;

    // Render Brands Filter
    const bContainer = document.getElementById('dynamic-brands');
    if (bContainer) {
      bContainer.innerHTML = data.brands.map((b, i) => `
        <label class="brand-check">
          <input type="checkbox" ${i === 0 || i === 2 ? 'checked' : ''} />
          <span>${b}</span>
        </label>
      `).join('');
    }

    // Render Dynamic Grid
    const catGrid = document.getElementById('dynamic-cat-grid');
    if (catGrid) {
      let html = '';
      for (let i = 0; i < 12; i++) {
        const randBrand = data.brands[i % data.brands.length];
        html += `
          <div class="p-card">
            <div class="p-img"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            <div class="p-body">
              <div class="p-brand">${randBrand}</div>
              <div class="p-name">Premium ${data.title} Item ${i + 1}</div>
              <div class="p-price">₹${((i + 1) * 1200).toLocaleString('en-IN')}</div>
              <button class="p-add">Add to Cart</button>
            </div>
          </div>
        `;
      }
      catGrid.innerHTML = html;
    }
  }

  // ── Page: Auth ──
  if (page === 'auth') {
    const reqBtn = document.getElementById('req-otp-btn');
    const formView = document.getElementById('auth-form-view');
    const otpView = document.getElementById('otp-view');
    const backBtn = document.getElementById('back-to-auth');
    const timerText = document.getElementById('otp-countdown');
    
    let timerInt;

    if (reqBtn && formView && otpView) {
      reqBtn.addEventListener('click', () => {
        formView.classList.add('hidden');
        otpView.classList.add('active');
        
        // Start countdown
        let sec = 30;
        timerText.textContent = `00:${sec}`;
        clearInterval(timerInt);
        timerInt = setInterval(() => {
          sec--;
          if(sec >= 0) {
            timerText.textContent = `00:${sec < 10 ? '0'+sec : sec}`;
          } else {
            clearInterval(timerInt);
            timerText.textContent = `Resend Now`;
          }
        }, 1000);
      });
      
      backBtn.addEventListener('click', () => {
        otpView.classList.remove('active');
        formView.classList.remove('hidden');
        clearInterval(timerInt);
      });
    }
  }

  // ── Page: Cart ──
  if (page === 'cart') {
    const applyBtn = document.getElementById('apply-promo');
    const promoIn = document.getElementById('promo-input');
    const dRow = document.getElementById('discount-row');
    const totalEl = document.getElementById('s-total');
    
    if (applyBtn && promoIn && dRow && totalEl) {
      applyBtn.addEventListener('click', () => {
        if (promoIn.value.trim().toUpperCase() === 'LOYALTY') {
          dRow.style.display = 'flex';
          totalEl.textContent = '₹1,51,092';
          applyBtn.textContent = 'Applied';
          applyBtn.style.background = '#2E7D32';
        } else {
          alert('Invalid promo code');
        }
      });
    }
  }

});
