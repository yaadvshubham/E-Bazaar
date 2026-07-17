import os, re
base_html = open('Frontend/index.html', 'r', encoding='utf-8').read()

def make_page(name, title):
    html = re.sub(r'<body.*?>', f'<body data-page="{name}">', base_html)
    html = re.sub(r'<title.*?>.*?</title>', f'<title id="page-title">{title} — E-Bazaar</title>', html)
    main = f'''<main id="main-content" style="padding: 40px var(--side-pad); min-height: 50vh;">
  <h1>{title}</h1>
  <p>This is the {title} workspace.</p>
</main>'''
    html = re.sub(r'<!-- ═══════════════════ MAIN ═══════════════════ -->.*?<footer', main + '\n<footer', html, flags=re.DOTALL)
    with open(f'Frontend/{name}.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Created', name)

make_page('cart', 'Shopping Cart')
make_page('orders', 'My Orders')
make_page('wishlist', 'Wishlist')
