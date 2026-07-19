import re

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Restore brands-grid
css = re.sub(
    r'\.brands-grid\{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;padding-bottom:16px;scrollbar-width:thin;\}',
    '.brands-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}',
    css
)

# Restore brand-tile
css = re.sub(
    r'\.brand-tile\{\n  flex:0 0 auto;width:180px;scroll-snap-align:start;',
    '.brand-tile{',
    css
)

# Add media queries back cleanly
if '.brands-grid{grid-template-columns' not in css:
    css = re.sub(r'(@media\(max-width:1200px\)\{)', r'\1\n  .brands-grid{grid-template-columns:repeat(4,1fr)}', css, count=1)
    css = re.sub(r'(@media\(max-width:768px\)\{)', r'\1\n  .brands-grid{grid-template-columns:repeat(3,1fr)}', css, count=1)
    css = re.sub(r'(@media\(max-width:520px\)\{)', r'\1\n  .brands-grid{grid-template-columns:repeat(2,1fr)}', css, count=1)

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<a href="brands.html" class="see-all">See All &nbsp;&#8594;</a>', '<a href="brand-directory.html" class="see-all">See All &nbsp;&#8594;</a>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
