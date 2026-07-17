import re
import os

with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace category.html?cat=X&brand=Y with brand-store.html?brand=Y&cat=X
# Note: Some links might have &amp; depending on HTML formatting.
html = re.sub(r'href="category\.html\?cat=([^&"]+)&amp;brand=([^"]+)"', r'href="brand-store.html?brand=\2&cat=\1"', html)
html = re.sub(r'href="category\.html\?cat=([^&"]+)&brand=([^"]+)"', r'href="brand-store.html?brand=\2&cat=\1"', html)

with open('Frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated index.html links.')
