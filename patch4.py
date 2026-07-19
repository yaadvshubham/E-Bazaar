import re
import glob

# 1. Update all HTML headers
files = glob.glob('Frontend/*.html')
# The user specifically requested: <a href="brand-directory.html" class="nav-item-link" id="link-brand-store">Brand Store</a>
# It should be added at the end of the .static-links-row sequence, which in our layout is near New Arrivals.
# Let's style it exactly like "New Arrivals" but use the id and class requested.
nav_insertion = r'<a href="brand-directory.html" class="nav-item-link" id="link-brand-store" style="display:flex;align-items:center;gap:6px;padding:0 12px;font-size:14px;font-weight:600;color:var(--text-sub);white-space:nowrap;transition:color var(--ease)">Brand Store</a>'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Insert after New Arrivals
    target = r'(<a href="category\.html\?cat=new-arrivals"[^>]*>New Arrivals <span class="new-tag">NEW</span></a>)'
    if re.search(target, html):
        html = re.sub(target, r'\1\n        ' + nav_insertion, html)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Updated nav in {file}')

# 2. Extract header and footer from index.html
with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

header = idx.split('<!-- ═══════════════════ MAIN ═══════════════════ -->')[0]
footer = '<!-- ═══════════════════ FOOTER ═══════════════════ -->' + idx.split('<!-- ═══════════════════ FOOTER ═══════════════════ -->')[1]

# Make sure CSS is linked
header = header.replace('</head>', '  <link rel="stylesheet" href="css/brand-directory.css">\n</head>')

# 3. Create Brand Directory HTML
html_content = header + '''
<!-- ═══════════════════ MAIN ═══════════════════ -->
<main id="main-content">
  <div class="directory-container">
    <div class="directory-sidebar">
      <a href="#groceries">Groceries</a>
      <a href="#electronics">Electronics</a>
      <a href="#gadgets">Gadgets</a>
      <a href="#clothing">Clothing</a>
      <a href="#shoes">Shoes</a>
      <a href="#beauty">Beauty</a>
      <a href="#sports">Sports</a>
      <a href="#home-kitchen">Home & Kitchen</a>
    </div>
    <div class="directory-content">
      
      <div class="dir-cat-block" id="groceries">
        <h2 class="dir-cat-title">Groceries</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Amul" class="brand-card"><img src="images/logos/amul.png" onerror="this.onerror=null; this.src='https://logo.clearbit.com/amul.com'; this.onerror=function(){this.src='https://ui-avatars.com/api/?name=Amul&background=0D8ABC&color=fff&size=140'};"></a>
          <a href="brand-store.html?brand=Nestle" class="brand-card"><img src="https://logo.clearbit.com/nestle.com" onerror="this.src='https://ui-avatars.com/api/?name=Nestle'"></a>
          <a href="brand-store.html?brand=Britannia" class="brand-card"><img src="https://logo.clearbit.com/britannia.co.in" onerror="this.src='https://ui-avatars.com/api/?name=Britannia'"></a>
          <a href="brand-store.html?brand=Tata" class="brand-card"><img src="https://logo.clearbit.com/tata.com" onerror="this.src='https://ui-avatars.com/api/?name=Tata'"></a>
        </div>
      </div>
      
      <div class="dir-cat-block" id="electronics">
        <h2 class="dir-cat-title">Electronics</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Apple" class="brand-card"><img src="https://logo.clearbit.com/apple.com" onerror="this.src='https://ui-avatars.com/api/?name=Apple'"></a>
          <a href="brand-store.html?brand=Samsung" class="brand-card"><img src="https://logo.clearbit.com/samsung.com" onerror="this.src='https://ui-avatars.com/api/?name=Samsung'"></a>
          <a href="brand-store.html?brand=Sony" class="brand-card"><img src="https://logo.clearbit.com/sony.com" onerror="this.src='https://ui-avatars.com/api/?name=Sony'"></a>
          <a href="brand-store.html?brand=OnePlus" class="brand-card"><img src="https://logo.clearbit.com/oneplus.com" onerror="this.src='https://ui-avatars.com/api/?name=OnePlus'"></a>
        </div>
      </div>

      <div class="dir-cat-block" id="gadgets">
        <h2 class="dir-cat-title">Gadgets</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Philips" class="brand-card"><img src="https://logo.clearbit.com/philips.com" onerror="this.src='https://ui-avatars.com/api/?name=Philips'"></a>
          <a href="brand-store.html?brand=LG" class="brand-card"><img src="https://logo.clearbit.com/lg.com" onerror="this.src='https://ui-avatars.com/api/?name=LG'"></a>
          <a href="brand-store.html?brand=Boat" class="brand-card"><img src="https://logo.clearbit.com/boat-lifestyle.com" onerror="this.src='https://ui-avatars.com/api/?name=Boat'"></a>
          <a href="brand-store.html?brand=JBL" class="brand-card"><img src="https://logo.clearbit.com/jbl.com" onerror="this.src='https://ui-avatars.com/api/?name=JBL'"></a>
        </div>
      </div>

      <div class="dir-cat-block" id="clothing">
        <h2 class="dir-cat-title">Clothing</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Levis" class="brand-card"><img src="https://logo.clearbit.com/levi.com" onerror="this.src='https://ui-avatars.com/api/?name=Levis'"></a>
          <a href="brand-store.html?brand=Zara" class="brand-card"><img src="https://logo.clearbit.com/zara.com" onerror="this.src='https://ui-avatars.com/api/?name=Zara'"></a>
          <a href="brand-store.html?brand=HM" class="brand-card"><img src="https://logo.clearbit.com/hm.com" onerror="this.src='https://ui-avatars.com/api/?name=HM'"></a>
          <a href="brand-store.html?brand=Tommy" class="brand-card"><img src="https://logo.clearbit.com/tommy.com" onerror="this.src='https://ui-avatars.com/api/?name=Tommy'"></a>
        </div>
      </div>

      <div class="dir-cat-block" id="shoes">
        <h2 class="dir-cat-title">Shoes</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Nike" class="brand-card"><img src="https://logo.clearbit.com/nike.com" onerror="this.src='https://ui-avatars.com/api/?name=Nike'"></a>
          <a href="brand-store.html?brand=Adidas" class="brand-card"><img src="https://logo.clearbit.com/adidas.com" onerror="this.src='https://ui-avatars.com/api/?name=Adidas'"></a>
          <a href="brand-store.html?brand=Puma" class="brand-card"><img src="https://logo.clearbit.com/puma.com" onerror="this.src='https://ui-avatars.com/api/?name=Puma'"></a>
          <a href="brand-store.html?brand=Reebok" class="brand-card"><img src="https://logo.clearbit.com/reebok.com" onerror="this.src='https://ui-avatars.com/api/?name=Reebok'"></a>
        </div>
      </div>
      
      <div class="dir-cat-block" id="beauty">
        <h2 class="dir-cat-title">Beauty</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=LOreal" class="brand-card"><img src="https://logo.clearbit.com/loreal.com" onerror="this.src='https://ui-avatars.com/api/?name=LOreal'"></a>
          <a href="brand-store.html?brand=Maybelline" class="brand-card"><img src="https://logo.clearbit.com/maybelline.com" onerror="this.src='https://ui-avatars.com/api/?name=Maybelline'"></a>
          <a href="brand-store.html?brand=Nykaa" class="brand-card"><img src="https://logo.clearbit.com/nykaa.com" onerror="this.src='https://ui-avatars.com/api/?name=Nykaa'"></a>
          <a href="brand-store.html?brand=MAC" class="brand-card"><img src="https://logo.clearbit.com/maccosmetics.com" onerror="this.src='https://ui-avatars.com/api/?name=MAC'"></a>
        </div>
      </div>

      <div class="dir-cat-block" id="sports">
        <h2 class="dir-cat-title">Sports</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Decathlon" class="brand-card"><img src="https://logo.clearbit.com/decathlon.com" onerror="this.src='https://ui-avatars.com/api/?name=Decathlon'"></a>
          <a href="brand-store.html?brand=Yonex" class="brand-card"><img src="https://logo.clearbit.com/yonex.com" onerror="this.src='https://ui-avatars.com/api/?name=Yonex'"></a>
          <a href="brand-store.html?brand=Cosco" class="brand-card"><img src="https://logo.clearbit.com/cosco.in" onerror="this.src='https://ui-avatars.com/api/?name=Cosco'"></a>
          <a href="brand-store.html?brand=Nivia" class="brand-card"><img src="https://logo.clearbit.com/niviasports.com" onerror="this.src='https://ui-avatars.com/api/?name=Nivia'"></a>
        </div>
      </div>

      <div class="dir-cat-block" id="home-kitchen">
        <h2 class="dir-cat-title">Home & Kitchen</h2>
        <div class="dir-grid">
          <a href="brand-store.html?brand=Prestige" class="brand-card"><img src="https://logo.clearbit.com/ttkprestige.com" onerror="this.src='https://ui-avatars.com/api/?name=Prestige'"></a>
          <a href="brand-store.html?brand=Hawkins" class="brand-card"><img src="https://logo.clearbit.com/hawkinscookers.com" onerror="this.src='https://ui-avatars.com/api/?name=Hawkins'"></a>
          <a href="brand-store.html?brand=Pigeon" class="brand-card"><img src="https://logo.clearbit.com/pigeon.com" onerror="this.src='https://ui-avatars.com/api/?name=Pigeon'"></a>
          <a href="brand-store.html?brand=Milton" class="brand-card"><img src="https://logo.clearbit.com/milton.in" onerror="this.src='https://ui-avatars.com/api/?name=Milton'"></a>
        </div>
      </div>

    </div>
  </div>
</main>
''' + footer

with open('Frontend/brand-directory.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
print('Created brand-directory.html')
