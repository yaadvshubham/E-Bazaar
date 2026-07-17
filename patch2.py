import re
with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

match = re.search(r'(function initBrandStore\(\) \{.*?)(?=\s*function initProductDetail)', js, re.DOTALL)
if match:
    print('Found initBrandStore block')
    
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
    }
    
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
      const products = generateMockProductsForCategory('clothing').slice(0, 12);
      products.forEach(p => p.brand = brand);
      grid.innerHTML = products.map(buildCard).join('');
    }
    
    const countEl = document.getElementById('result-count');
    if (countEl) countEl.innerHTML = `Showing <strong>12 products</strong>`;
}'''
    js = js.replace(match.group(1), replacement)
    with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Successfully updated script.js')
else:
    print('Could not find initBrandStore')
