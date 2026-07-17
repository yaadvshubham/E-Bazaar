with open('Frontend/brand-store.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'css/brand.css' not in html:
    html = html.replace('<link rel="stylesheet" href="css/category.css"/>', '<link rel="stylesheet" href="css/category.css"/>\n  <link rel="stylesheet" href="css/brand.css"/>')
    with open('Frontend/brand-store.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Added brand.css back to brand-store.html')

with open('Frontend/css/brand.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('background: linear-gradient(135deg, var(--text) 0%, #1a1a1a 100%);', '''background-image: url('../images/brand-banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;''')

# add an overlay so text is readable
if '.brand-hero::before' in css:
    css = css.replace('background: radial-gradient(circle at center, rgba(168, 140, 109, 0.15) 0%, transparent 60%);', 'background: rgba(0, 0, 0, 0.55);')

with open('Frontend/css/brand.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Updated brand.css to use image')
