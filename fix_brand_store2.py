import re

# 1. Update brand-store.html
with open('Frontend/brand-store.html', 'r', encoding='utf-8') as f:
    html = f.read()

breadcrumb_pattern = r'(<!-- BREADCRUMB -->\s*<nav class="breadcrumb".*?</nav>)'
breadcrumb_match = re.search(breadcrumb_pattern, html, re.DOTALL)
if breadcrumb_match:
    breadcrumb_html = breadcrumb_match.group(1)
    
    # Remove breadcrumb from original place
    html = html.replace(breadcrumb_html, '')
    
    # Inject it inside brand-hero
    hero_pattern = r'(<div class="brand-hero" id="brand-hero">)'
    html = html.replace(hero_pattern, f'\\1\n    {breadcrumb_html}')
    
    with open('Frontend/brand-store.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Updated brand-store.html successfully.')
else:
    print('Breadcrumb not found in brand-store.html')


# 2. Update css/brand.css
with open('Frontend/css/brand.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make sure brand-hero has position: relative and text color white for breadcrumbs
if '.brand-hero .breadcrumb' not in css:
    css += '''
/* Breadcrumb inside hero */
.brand-hero .breadcrumb {
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 10;
  color: rgba(255, 255, 255, 0.7);
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.brand-hero .breadcrumb a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
}

.brand-hero .breadcrumb a:hover {
  color: #fff;
  text-decoration: underline;
}

.brand-hero .bc-current {
  color: #fff;
  font-weight: 600;
}
'''
    with open('Frontend/css/brand.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('Updated brand.css successfully.')

# 3. Update script.js
with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Update logoEl innerHTML logic to include a fallback
logo_old = r'logoEl.innerHTML = `<img src="https://logo.clearbit.com/\$\{brand.toLowerCase\(\)\}.com" onerror="this.style.display=\'none\'" alt="\$\{brand\} Logo">`;'
logo_new = r'logoEl.innerHTML = `<img src="https://logo.clearbit.com/${brand.toLowerCase()}.com" onerror="this.onerror=null; this.src=\'https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33\'" alt="${brand} Logo">`;'
if 'ui-avatars' not in js:
    js = re.sub(logo_old, logo_new, js)

# Inject dynamic background logic inside initBrandStore()
if 'brand-hero' not in js:
    # Let's insert it right after setting document.title
    title_pattern = r'document.title = `\$\{brand\} Official Store \u2014 E-Bazaar`;'
    bg_logic = '''
    const brandHero = document.getElementById('brand-hero');
    if (brandHero) {
        // Fallback or dynamic based on category
        let bgImg = 'images/brand-banner.png'; // default
        if (cat) {
           const safeCat = cat.toLowerCase();
           // Attempt to load category specific banner, if fails, uses CSS default via onerror
           bgImg = `images/banners/banner_${safeCat}.png`;
        }
        brandHero.style.backgroundImage = `url("${bgImg}")`;
    }
'''
    js = js.replace('document.title = `${brand} Official Store \u2014 E-Bazaar`;', 'document.title = `${brand} Official Store \u2014 E-Bazaar`;\n' + bg_logic)

    with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Updated script.js successfully.')
