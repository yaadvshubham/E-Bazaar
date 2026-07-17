import re

with open('Frontend/css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace variables
css = css.replace('--bg:', '--bg-canvas:')
css = css.replace('var(--bg)', 'var(--bg-canvas)')

css = css.replace('--bg-white:', '--bg-surface:')
css = css.replace('var(--bg-white)', 'var(--bg-surface)')

css = css.replace('--text:', '--text-primary:')
css = css.replace('var(--text)', 'var(--text-primary)')

css = css.replace('--accent:', '--accent-caramel:')
css = css.replace('var(--accent)', 'var(--accent-caramel)')

css = css.replace('--border:', '--border-line:')
css = css.replace('var(--border)', 'var(--border-line)')

# Light Theme Variables
css = re.sub(
    r'(--bg-canvas:\s*)[#\w]+;',
    r'\g<1>#FAF8F5;',
    css, count=1
)
css = re.sub(
    r'(--bg-surface:\s*)[#\w]+;',
    r'\g<1>#FFFFFF;',
    css, count=1
)
css = re.sub(
    r'(--text-primary:\s*)[#\w]+;',
    r'\g<1>#2A2421;',
    css, count=1
)
css = re.sub(
    r'(--accent-caramel:\s*)[#\w]+;',
    r'\g<1>#A88C6D;',
    css, count=1
)
css = re.sub(
    r'(--border-line:\s*)[#\w]+;',
    r'\g<1>#EBE6DD;',
    css, count=1
)

# Dark Theme Variables
css = re.sub(
    r'(html\[data-theme="dark"\]\s*\{[^}]*?--bg-canvas:\s*)[#\w]+;',
    r'\g<1>#15110F;',
    css
)
css = re.sub(
    r'(html\[data-theme="dark"\]\s*\{[^}]*?--bg-surface:\s*)[#\w]+;',
    r'\g<1>#1E1916;',
    css
)
css = re.sub(
    r'(html\[data-theme="dark"\]\s*\{[^}]*?--text-primary:\s*)[#\w]+;',
    r'\g<1>#FAF8F5;',
    css
)
css = re.sub(
    r'(html\[data-theme="dark"\]\s*\{[^}]*?--accent-caramel:\s*)[#\w]+;',
    r'\g<1>#C5A880;',
    css
)
css = re.sub(
    r'(html\[data-theme="dark"\]\s*\{[^}]*?--border-line:\s*)[#\w]+;',
    r'\g<1>#332B27;',
    css
)

# Navigation Alignment Fix (Rename classes and update styles)
css = css.replace('.nav-sub', '.category-nav')
css = css.replace('.nav-sub-inner', '.nav-container')
css = css.replace('.top-cat-links', '.static-links')

# Insert the specific CSS rules asked by the user
css = css.replace('.nav-container{', '.nav-container{ display: flex; align-items: center; justify-content: flex-start;')

# Ensure .static-links has the correct gap and margin
css = re.sub(
    r'(\.static-links\s*\{[^}]*?gap:\s*)[^;]+;',
    r'\g<1>20px;',
    css
)
css = re.sub(
    r'(\.static-links\s*\{[^}]*?)(})',
    r'\g<1> margin-left: 15px; \g<2>',
    css
)

# Caramel Underline CSS
underline_css = """
.nav-item-link {
  position: relative;
}
.nav-item-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 2px;
  background-color: var(--accent-caramel); transform: scaleX(0); transition: transform 0.25s ease; transform-origin: left;
}
.nav-item-link:hover::after, .nav-item-link.active::after { transform: scaleX(1); }
"""

# Compact Banner heights
banner_css = """
.hero-carousel, .hero-track, .hero-slide {
  max-height: 240px !important;
}
.hero-slide img, .hero-bg img {
  object-fit: cover !important;
}
"""
css += underline_css + banner_css

with open('Frontend/css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Update index.html classes
with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('class="nav-sub"', 'class="category-nav"')
html = html.replace('class="nav-sub-inner"', 'class="nav-container"')
html = html.replace('class="top-cat-links"', 'class="static-links"')

# Update badges
html = html.replace('<span class="hot-tag">HOT</span>', '<span class="badge-hot" style="background:#D63C3C;color:#FFF;font-size:9px;font-weight:700;padding:2px 6px;border-radius:999px;text-transform:uppercase;margin-left:4px;">HOT</span>')
html = html.replace('<span class="new-tag">NEW</span>', '<span class="badge-new" style="background:var(--accent-caramel);color:#FFF;font-size:9px;font-weight:700;padding:2px 6px;border-radius:999px;text-transform:uppercase;margin-left:4px;">NEW</span>')

with open('Frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
