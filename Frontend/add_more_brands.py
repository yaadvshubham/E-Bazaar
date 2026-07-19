with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

more_brands = '''
        <a href="brand-store.html?brand=Boat" class="brand-tile" role="listitem" aria-label="Boat"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="26" font-family="Arial,sans-serif" font-size="24" font-weight="800" fill="currentColor">boAt</text></svg><span class="brand-tile-name">boAt</span></a>
        <a href="brand-store.html?brand=Mamaearth" class="brand-tile" role="listitem" aria-label="Mamaearth"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="20" font-weight="600" fill="#8cc63f">mamaearth</text></svg><span class="brand-tile-name">Mamaearth</span></a>
        <a href="brand-store.html?brand=HM" class="brand-tile" role="listitem" aria-label="H&amp;M"><svg viewBox="0 0 130 32" aria-hidden="true"><rect x="25" y="2" width="80" height="28" fill="#e3000f" rx="2"/><text x="38" y="22" font-family="Arial,sans-serif" font-size="20" font-weight="900" fill="#fff">H&amp;M</text></svg><span class="brand-tile-name">H&amp;M</span></a>
        <a href="brand-store.html?brand=Decathlon" class="brand-tile" role="listitem" aria-label="Decathlon"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="18" font-weight="800" fill="#0082c3">DECATHLON</text></svg><span class="brand-tile-name">Decathlon</span></a>
        <a href="brand-store.html?brand=OnePlus" class="brand-tile" role="listitem" aria-label="OnePlus"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Arial,sans-serif" font-size="20" font-weight="800" fill="#f50514">ONEPLUS</text></svg><span class="brand-tile-name">OnePlus</span></a>
        <a href="brand-store.html?brand=Borosil" class="brand-tile" role="listitem" aria-label="Borosil"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Georgia,serif" font-size="22" font-weight="600" fill="#002b5c">BOROSIL</text></svg><span class="brand-tile-name">Borosil</span></a>
        <a href="brand-store.html?brand=Amul" class="brand-tile" role="listitem" aria-label="Amul"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Georgia,serif" font-size="22" font-weight="800" fill="#e31e24">Amul</text></svg><span class="brand-tile-name">Amul</span></a>
        <a href="brand-store.html?brand=NewBalance" class="brand-tile" role="listitem" aria-label="New Balance"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="2" y="24" font-family="Arial Black,sans-serif" font-size="20" font-weight="900" fill="currentColor">NB</text></svg><span class="brand-tile-name">New Balance</span></a>
        <a href="brand-store.html?brand=JBL" class="brand-tile" role="listitem" aria-label="JBL"><svg viewBox="0 0 130 32" aria-hidden="true"><rect x="30" y="4" width="70" height="24" fill="#ff5500" rx="2"/><text x="42" y="22" font-family="Arial,sans-serif" font-size="18" font-weight="800" fill="#fff">JBL</text></svg><span class="brand-tile-name">JBL</span></a>
        <a href="brand-store.html?brand=MAC" class="brand-tile" role="listitem" aria-label="MAC"><svg viewBox="0 0 130 32" aria-hidden="true"><text x="16" y="24" font-family="Arial,sans-serif" font-size="24" font-weight="900" letter-spacing="4" fill="currentColor">MAC</text></svg><span class="brand-tile-name">MAC</span></a>
      </div>
'''

new_html = html.replace('</div>\n      <button class="track-arrow right" data-track="tr-brands"', more_brands + '      <button class="track-arrow right" data-track="tr-brands"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print('Added 10 more brands.')
