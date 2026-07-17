import re

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace getBrandLogoSVG function
new_logo_func = r'''function getBrandLogoSVG(brand) {
    const safeBrand = brand.toLowerCase();
    return `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; border-radius:12px; overflow:hidden;">
      <img src="images/logos/${safeBrand}.png" 
      onerror="this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.com'; this.onerror=function(){this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.coop'; this.onerror=function(){this.onerror=null; this.src='https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33'};};" 
      alt="${brand} Logo" style="width:80%; height:80%; object-fit:contain;">
    </div>`;
  }'''

js = re.sub(r'function getBrandLogoSVG\(brand\) \{.*?\n  \}', new_logo_func, js, flags=re.DOTALL)

# Replace the showcaseRow link
old_link = r'<a href="brand-store.html?brand=${brand}" class="brand-showcase-card" title="Shop ${brand}">'
new_link = r'<a href="brand-store.html?brand=${brand}&cat=${catId}" class="brand-showcase-card" title="Shop ${brand}">'
js = js.replace(old_link, new_link)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Patched showcaseRow link and getBrandLogoSVG.')
