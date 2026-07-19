import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_track_html = '''<div class="track-wrap" style="margin: 0 -20px; padding: 0 20px;">
      <button class="track-arrow left" data-track="tr-brands" aria-label="Scroll left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></button>
      <div class="track" id="tr-brands" role="list" style="gap:16px;">
        <a href="brand-store.html?brand=Nike" class="brand-tile" role="listitem" aria-label="Nike"><svg viewBox="0 0 110 44" aria-hidden="true"><path d="M10 33 Q34 5 100 11 Q65 26 28 36 Q18 38 10 33Z" fill="currentColor"/></svg><span class="brand-tile-name">Nike</span></a>
        <a href="brand-store.html?brand=Apple" class="brand-tile" role="listitem" aria-label="Apple"><svg viewBox="0 0 52 62" aria-hidden="true"><path d="M38 6c-3.8 2.8-6.2 7-5.6 11.5 5.4-.5 9.2-4.8 8.6-10-.1-.7-.9-1.8-3-1.5zm-12 14c-5 0-10 5-10 12.5 0 8.8 7 18.5 12.5 18.5 1.8 0 4.5-.9 6.5-.9 2 0 5.2.9 7.2.9 5.5-1.4 10.5-11 10.5-18.5 0-7.5-4.5-12.5-10.5-12.5-2.5 0-4.2 1-6.5 1-2 0-5.2-1-9.7-1z" fill="currentColor"/></svg><span class="brand-tile-name">Apple</span></a>
        <a href="brand-store.html?brand=Zara" class="brand-tile" role="listitem" aria-label="Zara"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="4" y="26" font-family="Georgia,serif" font-size="26" font-weight="700" letter-spacing="8" fill="currentColor">ZARA</text></svg><span class="brand-tile-name">Zara</span></a>
        <a href="brand-store.html?brand=Sony" class="brand-tile" role="listitem" aria-label="Sony"><svg viewBox="0 0 120 30" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="5" fill="currentColor">SONY</text></svg><span class="brand-tile-name">Sony</span></a>
        <a href="brand-store.html?brand=Puma" class="brand-tile" role="listitem" aria-label="Puma"><svg viewBox="0 0 130 34" aria-hidden="true"><text x="2" y="28" font-family="Arial Black,sans-serif" font-size="26" font-weight="900" letter-spacing="3" fill="currentColor">PUMA</text></svg><span class="brand-tile-name">Puma</span></a>
        <a href="brand-store.html?brand=LOreal" class="brand-tile" role="listitem" aria-label="L'Oréal Paris"><svg viewBox="0 0 170 38" aria-hidden="true"><text x="2" y="22" font-family="Georgia,serif" font-size="17" font-weight="600" letter-spacing="2" fill="currentColor">L'ORÉAL</text><line x1="2" y1="27" x2="148" y2="27" stroke="var(--accent)" stroke-width="1.5"/><text x="2" y="37" font-family="Georgia,serif" font-size="8" letter-spacing="5" fill="var(--text-muted)">PARIS</text></svg><span class="brand-tile-name">L'Oréal</span></a>
        <a href="brand-store.html?brand=Samsung" class="brand-tile" role="listitem" aria-label="Samsung"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="21" font-weight="800" letter-spacing="1" fill="currentColor">SAMSUNG</text></svg><span class="brand-tile-name">Samsung</span></a>
        <a href="brand-store.html?brand=Adidas" class="brand-tile" role="listitem" aria-label="Adidas"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="26" font-family="Arial,sans-serif" font-size="24" font-weight="800" fill="currentColor">adidas</text></svg><span class="brand-tile-name">Adidas</span></a>
        <a href="brand-store.html?brand=Philips" class="brand-tile" role="listitem" aria-label="Philips"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="currentColor">PHILIPS</text></svg><span class="brand-tile-name">Philips</span></a>
        <a href="brand-store.html?brand=Levis" class="brand-tile" role="listitem" aria-label="Levis"><svg viewBox="0 0 130 32" aria-hidden="true"><rect x="20" y="2" width="90" height="28" fill="#c00" rx="2"/><text x="38" y="22" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#fff">Levi's</text></svg><span class="brand-tile-name">Levi's</span></a>
        <a href="brand-store.html?brand=Nestle" class="brand-tile" role="listitem" aria-label="Nestlé"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="26" font-family="Georgia,serif" font-size="22" font-weight="700" fill="currentColor">Nestlé</text></svg><span class="brand-tile-name">Nestlé</span></a>
        <a href="brand-store.html?brand=Prestige" class="brand-tile" role="listitem" aria-label="Prestige"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Times New Roman,serif" font-size="22" font-style="italic" font-weight="700" fill="currentColor">Prestige</text></svg><span class="brand-tile-name">Prestige</span></a>
      </div>
      <button class="track-arrow right" data-track="tr-brands" aria-label="Scroll right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></button>
    </div>'''

html = re.sub(r'<div class="brands-grid" role="list">.*?</div>', new_track_html, html, flags=re.DOTALL)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated index.html')

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add track rule for brand-tile
if '.track > .brand-tile' not in css:
    css = css.replace('.track > .cat-card { flex: 0 0 170px; }', '.track > .cat-card { flex: 0 0 170px; }\n.track > .brand-tile { flex: 0 0 180px; scroll-snap-align: start; }')

# Keep brand-tile rules
with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Updated styles.css')
