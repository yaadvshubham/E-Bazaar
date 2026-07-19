import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

head_header = content.split('<!-- ═══════════════════ MAIN ═══════════════════ -->')[0]
head_header = head_header.replace('<title id="page-title">E-Bazaar — Your everyday and everything store</title>', '<title id="page-title">Today\'s Deals — E-Bazaar</title>')

footer_split = content.split('</main>')
footer = '</main>' + footer_split[1]

main_content = """<!-- ═══════════════════ MAIN ═══════════════════ -->
<style>
  .deals-hero {
    background: linear-gradient(135deg, #111827 0%, #374151 100%);
    color: white;
    padding: 60px 24px;
    text-align: center;
    border-radius: var(--r-md);
    margin: 24px auto;
    max-width: var(--max-w);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    position: relative;
    overflow: hidden;
  }
  .deals-hero::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    animation: rotate 20s linear infinite;
  }
  @keyframes rotate { 100% { transform: rotate(360deg); } }
  .deals-title { font-size: 48px; font-weight: 800; margin-bottom: 16px; position: relative; z-index: 1; }
  .deals-title span { color: #facc15; }
  .deals-subtitle { font-size: 18px; color: #d1d5db; margin-bottom: 32px; position: relative; z-index: 1; }
  
  .timer-box {
    display: inline-flex;
    gap: 16px;
    position: relative;
    z-index: 1;
  }
  .timer-segment {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 12px 20px;
    border-radius: var(--r-sm);
    min-width: 80px;
  }
  .timer-num { font-size: 32px; font-weight: 700; line-height: 1; }
  .timer-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; color: #9ca3af; }

  .deals-section { max-width: var(--max-w); margin: 0 auto; padding: 40px var(--side-pad); }
  .deals-sec-title { font-size: 28px; font-weight: 800; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .deals-sec-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  
  .deals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .cat-card {
    background: var(--bg-white);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 16px;
    position: relative;
    transition: transform var(--ease), box-shadow var(--ease);
    display: flex;
    flex-direction: column;
  }
  .cat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
  }
  .cat-img-box {
    width: 100%;
    aspect-ratio: 1;
    background: #f3f4f6;
    border-radius: var(--r-sm);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .deal-badge {
    position: absolute;
    top: -8px; left: -8px;
    background: #ef4444;
    color: white;
    font-size: 13px;
    font-weight: 800;
    padding: 6px 12px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
    z-index: 2;
  }
  .wl-btn {
    position: absolute; top: 12px; right: 12px;
    background: white; border: none; width: 32px; height: 32px; border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer;
    display: flex; align-items: center; justify-content: center; z-index: 2;
  }
  .wl-btn:hover { background: #f9fafb; }
  .wl-btn.active svg { fill: #ef4444; stroke: #ef4444; }
  
  .cat-brand { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 600; }
  .cat-name { font-size: 15px; font-weight: 600; color: var(--text); line-height: 1.4; margin-bottom: 8px; text-decoration: none; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
  .cat-prices { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .cat-price { font-size: 18px; font-weight: 800; color: var(--text); }
  .cat-orig { font-size: 13px; color: var(--text-muted); text-decoration: line-through; }
  .cat-disc { font-size: 12px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 2px 6px; border-radius: 4px; }
  
  .cat-add-btn {
    width: 100%; padding: 10px; background: var(--text); color: var(--bg);
    border: none; border-radius: var(--r-sm); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background var(--ease);
  }
  .cat-add-btn:hover { background: var(--accent); }
</style>

<main id="main-content">
  
  <div class="deals-hero">
    <h1 class="deals-title">Midnight <span>Flash Sale</span></h1>
    <p class="deals-subtitle">Unbeatable prices on the most sought-after products. Hurry, offers end soon!</p>
    
    <div class="timer-box">
      <div class="timer-segment">
        <div class="timer-num" id="t-hrs">04</div>
        <div class="timer-label">Hours</div>
      </div>
      <div class="timer-segment">
        <div class="timer-num" id="t-min">23</div>
        <div class="timer-label">Mins</div>
      </div>
      <div class="timer-segment">
        <div class="timer-num" id="t-sec">12</div>
        <div class="timer-label">Secs</div>
      </div>
    </div>
  </div>

  <section class="deals-section">
    <h2 class="deals-sec-title">Blockbuster Tech Deals</h2>
    <div class="deals-grid" id="tech-deals-grid">
      <!-- Injected by JS -->
    </div>
  </section>

  <section class="deals-section">
    <h2 class="deals-sec-title">Fashion Drops</h2>
    <div class="deals-grid" id="fashion-deals-grid">
      <!-- Injected by JS -->
    </div>
  </section>

  <section class="deals-section" style="margin-bottom: 60px;">
    <h2 class="deals-sec-title">Home & Decor Bargains</h2>
    <div class="deals-grid" id="home-deals-grid">
      <!-- Injected by JS -->
    </div>
  </section>
  
</main>

<script>
  // Countdown Timer Logic
  let time = 4 * 3600 + 23 * 60 + 12; // 4h 23m 12s
  setInterval(() => {
    time--;
    if(time < 0) time = 24 * 3600; // loop back
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    
    document.getElementById('t-hrs').textContent = h.toString().padStart(2, '0');
    document.getElementById('t-min').textContent = m.toString().padStart(2, '0');
    document.getElementById('t-sec').textContent = s.toString().padStart(2, '0');
  }, 1000);

  // Render Deals
  function renderDeals() {
    const techDeals = [
      { id: 'd1', brand: 'Nothing', name: 'Nothing Phone (4a) Pro - 12GB RAM, 256GB', price: '₹54,999', orig: '₹69,999', disc: '21%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
      { id: 'd2', brand: 'MorningBlues', name: 'SonicGlass A1 Transparent Speaker', price: '₹39,999', orig: '₹54,500', disc: '26%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="6" r="1"/></svg>' },
      { id: 'd3', brand: 'Lenovo', name: 'ThinkTab X11 Rugged Tablet - 11" 2.5K', price: '₹34,999', orig: '₹42,000', disc: '16%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
      { id: 'd4', brand: 'Realme', name: 'Realme P4 Power - 6000mAh Battery', price: '₹22,999', orig: '₹28,999', disc: '20%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' }
    ];

    const fashionDeals = [
      { id: 'd5', brand: 'Zara', name: 'Pre-Draped Silk Blend Saree', price: '₹2,499', orig: '₹5,999', disc: '58%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' },
      { id: 'd6', brand: 'H&M', name: 'Eco-conscious Athleisure Co-ord Set', price: '₹1,299', orig: '₹2,999', disc: '56%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' },
      { id: 'd7', brand: 'Levis', name: 'Soft Tailoring Wide Leg Trousers', price: '₹1,899', orig: '₹3,499', disc: '45%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' },
      { id: 'd8', brand: 'Nike', name: 'Air Zoom Pegasus 41', price: '₹6,499', orig: '₹10,999', disc: '40%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' }
    ];

    const homeDeals = [
      { id: 'd9', brand: 'Vaaree', name: 'Black Spiral Ceramic Vase', price: '₹899', orig: '₹2,499', disc: '64%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M6 2L18 2M8 22L16 22M10 2L8 8C8 12 6 16 6 18C6 20 8 22 10 22M14 2L16 8C16 12 18 16 18 18C18 20 16 22 14 22"/></svg>' },
      { id: 'd10', brand: 'Pepperfry', name: 'Ribbed Cream Planter (Set of 2)', price: '₹1,199', orig: '₹3,000', disc: '60%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M8 22h8c2.5 0 3-2 3-5L17 5H7L5 17c0 3 .5 5 3 5zM5 5h14v3H5z"/></svg>' },
      { id: 'd11', brand: 'Urban Ladder', name: 'Minimalist Metal Wall Clock', price: '₹1,499', orig: '₹3,599', disc: '58%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="14"/></svg>' },
      { id: 'd12', brand: 'Philips', name: 'Smart Air Purifier Diffuser combo', price: '₹8,999', orig: '₹14,999', disc: '40%', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' }
    ];

    function generateCards(arr, containerId) {
      const container = document.getElementById(containerId);
      if(!container) return;
      
      let wl = JSON.parse(localStorage.getItem('eb_wishlist') || '[]');
      
      container.innerHTML = arr.map(p => {
        const pStr = encodeURIComponent(JSON.stringify(p));
        const inWl = wl.some(w => w.id === p.id);
        const stroke = inWl ? 'none' : 'currentColor';
        const fill = inWl ? '#ef4444' : 'none';
        
        return `
        <article class="cat-card">
          <div class="cat-img-box">
            <span class="deal-badge">${p.disc} OFF</span>
            <button class="wl-btn ${inWl ? 'active' : ''}" onclick="toggleWishlist(this, '${pStr}')" aria-label="Toggle wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            ${p.img}
          </div>
          <div class="cat-brand">${p.brand}</div>
          <div class="cat-name">${p.name}</div>
          <div class="cat-prices"><span class="cat-price">${p.price}</span><span class="cat-orig">${p.orig}</span></div>
          <button class="cat-add-btn" onclick="addToCart('${pStr}')">+ Add to Cart</button>
        </article>`;
      }).join('');
    }

    generateCards(techDeals, 'tech-deals-grid');
    generateCards(fashionDeals, 'fashion-deals-grid');
    generateCards(homeDeals, 'home-deals-grid');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Wait for script.js functions (toggleWishlist, addToCart) to be ready
    setTimeout(renderDeals, 100);
  });
</script>
"""

final_html = head_header + main_content + footer
with open('deals.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Created deals.html successfully")
