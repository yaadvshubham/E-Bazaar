import re
import os

with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Revert brand-store.html?brand=Y&cat=X back to category.html?cat=X&brand=Y
html = re.sub(r'href="brand-store\.html\?brand=([^&"]+)&amp;cat=([^"]+)"', r'href="category.html?cat=\2&brand=\1"', html)
html = re.sub(r'href="brand-store\.html\?brand=([^&"]+)&cat=([^"]+)"', r'href="category.html?cat=\2&brand=\1"', html)

with open('Frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Reverted index.html links back to category.html.')
