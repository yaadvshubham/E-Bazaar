import re

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find the block where bgImg is assigned
bg_logic_old = r'''          let bgImg = 'images/brand-banner.png'; // default
          if \(cat\) \{
             const safeCat = cat.toLowerCase\(\);
             // Attempt to load category specific banner, if fails, uses CSS default via onerror
             bgImg = `images/banners/banner_\$\{safeCat\}.png`;
          \}
          brandHero\.style\.backgroundImage = `url\("\$\{bgImg\}"\)`\;'''

grocery_graphic = r'''
          if (cat) {
             const safeCat = cat.toLowerCase();
             if (safeCat === 'groceries') {
                 brandHero.style.backgroundImage = 'none';
                 
                 // Inject custom styling to override the dark hero text/overlay for this bright background
                 let styleTag = document.getElementById('dynamic-hero-style');
                 if (!styleTag) {
                     styleTag = document.createElement('style');
                     styleTag.id = 'dynamic-hero-style';
                     document.head.appendChild(styleTag);
                 }
                 styleTag.innerHTML = `
                    .brand-hero::before { display: none !important; }
                    .brand-hero .brand-title { color: #2A2421 !important; z-index: 10; position: relative; text-shadow: none !important; }
                    .brand-hero .brand-desc { color: #655E5A !important; z-index: 10; position: relative; }
                    .brand-hero .breadcrumb a { color: #655E5A !important; }
                    .brand-hero .breadcrumb .bc-current { color: #2A2421 !important; }
                    .brand-hero .breadcrumb { color: #655E5A !important; }
                 `;

                 const groceryHTML = `
<div class="grocery-hero-graphic" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #FAF8F5 0%, #F3EEE7 100%); overflow: hidden; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #EBE6DD; z-index: 0;">
  
  <!-- Left Side Typography -->
  <div class="hero-text-side" style="max-width: 50%; z-index: 2; padding-top: 50px; text-align: left;">
    <span style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.15em; color: #A88C6D; text-transform: uppercase; font-weight: 600; display: block; margin-bottom: 8px;">Fresh Harvest</span>
    <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #2A2421; margin: 0 0 12px 0; font-weight: 400; line-height: 1.2;">Organic Produce</h1>
    <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: #655E5A; margin: 0; line-height: 1.5;">Daily farm-fresh drops, handpicked seasonal fruits, and premium artisanal greens.</p>
  </div>

  <!-- Right Side: Luxury Fruits & Veggies Vector Artwork -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" style="width: 400px; height: 100%; z-index: 1;">
    <!-- Background Elegant Accent Circle -->
    <circle cx="280" cy="120" r="85" fill="none" stroke="#E6DFD5" stroke-width="1"/>
    <circle cx="280" cy="120" r="70" fill="#FFFFFF" opacity="0.6"/>
    
    <!-- Botanical Leaf 1 (Background Layer) -->
    <path d="M220,160 Q245,110 285,100 Q255,140 220,160 Z" fill="#A88C6D" opacity="0.15"/>
    <path d="M220,160 Q245,110 285,100" fill="none" stroke="#A88C6D" stroke-width="1.5" stroke-linecap="round"/>
    
    <!-- Minimalist Premium Pear (Fruit Element) -->
    <!-- Pear Body -->
    <path d="M275,85 C260,85 255,105 250,120 C242,140 242,165 265,170 C288,175 308,170 305,145 C302,125 290,105 285,85 Z" fill="#FFFFFF" stroke="#2A2421" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Pear Stem -->
    <path d="M280,85 Q283,73 290,70" fill="none" stroke="#2A2421" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Tiny Pear Leaf -->
    <path d="M283,78 Q295,76 295,83 Z" fill="#A88C6D" opacity="0.7"/>

    <!-- Elegant Cut Avocado (Vegetable/Fruit Element) -->
    <!-- Avocado Outer Shell -->
    <path d="M300,160 C290,160 285,145 285,135 C285,120 295,105 305,105 C315,105 320,115 325,130 C330,145 315,160 300,160 Z" fill="#FAF8F5" stroke="#2A2421" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Avocado Core Seed (Caramel Accent) -->
    <circle cx="303" cy="138" r="12" fill="#A88C6D" stroke="#2A2421" stroke-width="1"/>
    
    <!-- Dynamic Accent Dots (Representing organic seed/grains) -->
    <circle cx="240" cy="110" r="2.5" fill="#A88C6D"/>
    <circle cx="248" cy="100" r="2" fill="#E6DFD5"/>
    <circle cx="330" cy="115" r="3" fill="#A88C6D"/>
  </svg>
</div>`;
                 brandHero.insertAdjacentHTML('afterbegin', groceryHTML);
             } else {
                 let bgImg = `images/banners/banner_${safeCat}.png`;
                 brandHero.style.backgroundImage = `url("${bgImg}")`;
             }
          } else {
              brandHero.style.backgroundImage = 'url("images/brand-banner.png")';
          }
'''

js = re.sub(bg_logic_old, grocery_graphic, js, flags=re.DOTALL)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated script.js with Grocery custom HTML hero')
