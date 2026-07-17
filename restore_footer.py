import re

with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

footer_match = re.search(r'(<footer role="contentinfo">.*?</script>)', idx, re.DOTALL)

with open('Frontend/wishlist.html', 'r', encoding='utf-8') as f:
    wish = f.read()

if footer_match and '<footer' not in wish:
    footer = footer_match.group(1)
    wish = wish.replace('</main>', '</main>\n' + footer)
    print('Footer restored.')

if 'wishlist.css' not in wish:
    wish = wish.replace('<link rel="stylesheet" href="css/styles.css">', '<link rel="stylesheet" href="css/styles.css">\n  <link rel="stylesheet" href="css/wishlist.css">')
    print('CSS Linked.')

with open('Frontend/wishlist.html', 'w', encoding='utf-8') as f:
    f.write(wish)
