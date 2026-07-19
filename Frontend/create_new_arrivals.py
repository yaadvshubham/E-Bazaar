import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

head_header = content.split('<!-- ═══════════════════ MAIN ═══════════════════ -->')[0]
head_header = head_header.replace('<title id="page-title">E-Bazaar — Your everyday and everything store</title>', '<title id="page-title">New Arrivals — E-Bazaar</title>')

footer_split = content.split('</main>')
footer = '</main>' + footer_split[1]

main_content = """<!-- ═══════════════════ MAIN ═══════════════════ -->
<style>
  .na-hero {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    padding: 60px 24px;
    text-align: center;
    border-radius: var(--r-md);
    margin: 24px auto;
    max-width: var(--max-w);
    position: relative;
    overflow: hidden;
    border: 1px solid #bbf7d0;
  }
  .na-hero::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  .na-title { font-size: 48px; font-weight: 800; color: #14532d; margin-bottom: 12px; position: relative; z-index: 1; }
  .na-subtitle { font-size: 18px; color: #166534; font-weight: 500; margin-bottom: 0; position: relative; z-index: 1; }
  
  .na-section { max-width: var(--max-w); margin: 0 auto; padding: 40px var(--side-pad); }
  .na-sec-title { font-size: 28px; font-weight: 800; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; color: var(--text); }
  
  .na-grid {
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
    background: #f9fafb;
    border-radius: var(--r-sm);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .new-badge {
    position: absolute;
    top: -8px; left: -8px;
    background: #3b82f6;
    color: white;
    font-size: 13px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    z-index: 2;
    letter-spacing: 1px;
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
  
  .cat-add-btn {
    width: 100%; padding: 10px; background: var(--text); color: var(--bg);
    border: none; border-radius: var(--r-sm); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background var(--ease);
  }
  .cat-add-btn:hover { background: var(--accent); }
</style>

<main id="main-content">
  
  <div class="na-hero">
    <h1 class="na-title">Fresh Drops</h1>
    <p class="na-subtitle">Discover the absolute latest arrivals curated just for you.</p>
  </div>

  <section class="na-section">
    <h2 class="na-sec-title">Just Landed in Fashion</h2>
    <div class="na-grid" id="fashion-na-grid">
      <!-- Injected by JS -->
    </div>
  </section>

  <section class="na-section" style="margin-bottom: 60px;">
    <h2 class="na-sec-title">Latest in Tech</h2>
    <div class="na-grid" id="tech-na-grid">
      <!-- Injected by JS -->
    </div>
  </section>
  
</main>

<script>
  function renderNewArrivals() {
    const fashionDrops = [
      { id: 'n1', brand: 'Nike', name: 'Air Max 2026 Edition', price: '₹14,999', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' },
      { id: 'n2', brand: 'Zara', name: 'Oversized Linen Blend Blazer', price: '₹5,999', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' },
      { id: 'n3', brand: 'H&M', name: 'Textured Knit Polo Shirt', price: '₹1,999', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' },
      { id: 'n4', brand: 'Comet', name: 'Retro High-Top Sneakers - Nebula', price: '₹4,499', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z"/></svg>' }
    ];

    const techDrops = [
      { id: 'n5', brand: 'Apple', name: 'Apple Watch Series 11 - 45mm GPS', price: '₹44,900', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="3" ry="3"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/></svg>' },
      { id: 'n6', brand: 'Samsung', name: 'Galaxy Z Flip 7 - 512GB', price: '₹99,999', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
      { id: 'n7', brand: 'Sony', name: 'WH-1000XM6 Wireless Noise Cancelling', price: '₹32,990', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>' },
      { id: 'n8', brand: 'Logitech', name: 'MX Master 4S Advanced Wireless Mouse', price: '₹9,499', orig: '', disc: '', img: '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="7" ry="7"/><line x1="12" y1="6" x2="12" y2="10"/></svg>' }
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
            <span class="new-badge">NEW</span>
            <button class="wl-btn ${inWl ? 'active' : ''}" onclick="toggleWishlist(this, '${pStr}')" aria-label="Toggle wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            ${p.img}
          </div>
          <div class="cat-brand">${p.brand}</div>
          <div class="cat-name">${p.name}</div>
          <div class="cat-prices"><span class="cat-price">${p.price}</span></div>
          <button class="cat-add-btn" onclick="addToCart('${pStr}')">+ Add to Cart</button>
        </article>`;
      }).join('');
    }

    generateCards(fashionDrops, 'fashion-na-grid');
    generateCards(techDrops, 'tech-na-grid');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Wait for script.js functions
    setTimeout(renderNewArrivals, 100);
  });
</script>
"""

final_html = head_header + main_content + footer
with open('new-arrivals.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Created new-arrivals.html successfully")
