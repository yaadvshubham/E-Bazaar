import re

with open('Frontend/css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

nav_css = """
/* Nav Button Active State */
.nav-btn { position: relative; }
.nav-btn::after {
  content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px;
  background-color: var(--accent); transform: scaleX(0); transition: transform 0.25s ease; transform-origin: left;
}
.nav-btn.active::after { transform: scaleX(1) !important; }
"""

if '.nav-btn::after' not in css:
    css += nav_css

with open('Frontend/css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Replace acc-btn with nav-account across all html files
html_files = ['index.html', 'category.html', 'brand-store.html', 'product-detail.html', 'auth.html']
for h in html_files:
    try:
        with open('Frontend/' + h, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'<button class="nav-btn" id="acc-btn"(.*?)>(.*?)</button>', r'<a href="auth.html" class="nav-btn" id="nav-account"\1>\2</a>', content, flags=re.DOTALL)
        with open('Frontend/' + h, 'w', encoding='utf-8') as f:
            f.write(content)
    except:
        pass
