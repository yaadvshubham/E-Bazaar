import sys

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = '''function initBrandStore() {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand') || 'Nike';
    
    document.title = `${brand} Official Store \u2014 E-Bazaar`;
    
    const titleEl = document.getElementById('brand-title');
    if (titleEl) titleEl.textContent = brand;
    
    const logoEl = document.getElementById('brand-logo-large');
    if (logoEl) logoEl.innerHTML = getBrandLogoSVG(brand);'''

replacement = '''function initBrandStore() {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand') || 'Maybelline';
    const cat = urlParams.get('cat') || 'Beauty';
    
    document.title = `${brand} Official Store \u2014 E-Bazaar`;
    
    // Breadcrumbs
    const bcParentCat = document.getElementById('bc-parent-cat');
    const bcSep2 = document.getElementById('bc-sep-2');
    const bcChildCat = document.getElementById('bc-child-cat');
    
    if (bcParentCat && bcSep2 && bcChildCat) {
        // Capitalize category name
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
        // Real logo fetched from clearbit
        logoEl.innerHTML = `<img src="https://logo.clearbit.com/${brand.toLowerCase()}.com" onerror="this.style.display='none'" alt="${brand} Logo">`;
    }'''

if target not in js:
    print("Warning: Strict target not found. Trying flexible target.")
    target_fallback = '''function initBrandStore() {
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand') || 'Nike';'''
    
    if target_fallback in js:
        # I'll just replace the whole function block
        import re
        js = re.sub(r'function initBrandStore\(\) \{.*?getBrandLogoSVG\(brand\);', replacement, js, flags=re.DOTALL)
else:
    js = js.replace(target, replacement)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated script.js successfully')

css = '''/* ═══════════════════════════════════════════════════════════════════════
   BRAND STORE STYLES
   ═══════════════════════════════════════════════════════════════════════ */

.brand-hero {
  position: relative;
  background: linear-gradient(135deg, var(--text) 0%, #1a1a1a 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 1px solid var(--border);
  min-height: 350px;
  overflow: hidden;
  color: var(--bg-canvas);
}

.brand-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at center, rgba(168, 140, 109, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.brand-logo-large {
  width: 140px;
  height: 140px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 1;
}

.brand-logo-large img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-logo-large svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  z-index: 1;
}

.brand-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  font-weight: 300;
  letter-spacing: 0.5px;
  z-index: 1;
}
'''

with open('Frontend/css/brand.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Updated brand.css successfully')
