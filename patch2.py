import re

with open('Frontend/css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update banner heights to 230px
css = re.sub(r'max-height:\s*240px', 'max-height: 230px', css)
css = re.sub(r'height:\s*240px', 'height: 230px', css)

# Update nav button styles to include Caramel underline
new_nav_css = """
.nav-item-link, .nav-btn { position: relative; text-decoration: none; }
.nav-item-link::after, .nav-btn::after { 
  content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; 
  background-color: var(--accent-caramel); transform: scaleX(0); transition: transform 0.25s ease; transform-origin: left; 
}
.nav-item-link.active::after, .nav-btn.active::after { transform: scaleX(1) !important; }
"""

# Remove old .nav-item-link underline logic if exists
css = re.sub(r'\.nav-item-link\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-item-link::after\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-item-link:hover,\s*\.nav-item-link\.active\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-item-link:hover::after,\s*\.nav-item-link\.active::after\s*\{[^}]*\}', '', css)

# Append new nav CSS
css += new_nav_css

with open('Frontend/css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Apply same 230px constraint to brand.css
with open('Frontend/css/brand.css', 'r', encoding='utf-8') as f:
    bcss = f.read()
bcss = re.sub(r'max-height:\s*250px', 'max-height: 230px', bcss)
bcss = re.sub(r'padding:\s*40px\s*20px', 'padding: 20px 20px', bcss)
with open('Frontend/css/brand.css', 'w', encoding='utf-8') as f:
    f.write(bcss)
