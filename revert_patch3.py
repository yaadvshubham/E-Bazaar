import os

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

bad_func = '''function getBrandLogoSVG(brand) {
    const safeBrand = brand.toLowerCase();
    return `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; border-radius:12px; overflow:hidden;">
      <img src="images/logos/${safeBrand}.png" 
      onerror="this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.com'; this.onerror=function(){this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.coop'; this.onerror=function(){this.onerror=null; this.src='https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33'};};" 
      alt="${brand} Logo" style="width:80%; height:80%; object-fit:contain;">
    </div>`;
  }'''

good_func = '''function getBrandLogoSVG(brand) {
    // Return placeholder SVG for brand logo if specific one is not found
    const logos = {
      'Nike': '<svg viewBox="0 0 110 44" aria-hidden="true"><path d="M10 33 Q34 5 100 11 Q65 26 28 36 Q18 38 10 33Z" fill="currentColor"/></svg>',
      'Apple': '<svg viewBox="0 0 52 62" aria-hidden="true"><path d="M38 6c-3.8 2.8-6.2 7-5.6 11.5 5.4-.5 9.2-4.8 8.6-10-.1-.7-.9-1.8-3-1.5zm-12 14c-5 0-10 5-10 12.5 0 8.8 7 18.5 12.5 18.5 1.8 0 4.5-.9 6.5-.9 2 0 5.2.9 7.2.9 5.5-1.4 10.5-11 10.5-18.5 0-7.5-4.5-12.5-10.5-12.5-2.5 0-4.2 1-6.5 1-2 0-5.2-1-9.7-1z" fill="currentColor"/></svg>',
      'Zara': '<svg viewBox="0 0 130 32" aria-hidden="true"><text x="4" y="26" font-family="Georgia,serif" font-size="26" font-weight="700" letter-spacing="8" fill="currentColor">ZARA</text></svg>',
      'Sony': '<svg viewBox="0 0 120 30" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="5" fill="currentColor">SONY</text></svg>',
      'Puma': '<svg viewBox="0 0 130 34" aria-hidden="true"><text x="2" y="28" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" letter-spacing="3" fill="currentColor">PUMA</text></svg>',
      'LOreal': '<svg viewBox="0 0 170 38" aria-hidden="true"><text x="2" y="22" font-family="Georgia,serif" font-size="17" font-weight="600" letter-spacing="2" fill="currentColor">L\\'ORÉAL</text></svg>',
    };
    return logos[brand] || `<svg viewBox="0 0 120 30" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="currentColor">${brand}</text></svg>`;
  }'''

js = js.replace(bad_func, good_func)

bad_link = '<a href="brand-store.html?brand=${brand}&cat=${catId}" class="brand-showcase-card" title="Shop ${brand}">'
good_link = '<a href="brand-store.html?brand=${brand}" class="brand-showcase-card" title="Shop ${brand}">'

js = js.replace(bad_link, good_link)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Reverted latest script.js changes.")
