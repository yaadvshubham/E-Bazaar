import os
import re

frontend_dir = r"c:\Users\yaadv\OneDrive\Desktop\E-Bazaar\Frontend"
index_path = os.path.join(frontend_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    index_html = f.read()

# Extract header
header_match = re.search(r'(<!-- ═══════════════════ HEADER ═══════════════════ -->.*?</header><!-- /site-header -->)', index_html, re.DOTALL)
if not header_match:
    print("Failed to find header in index.html")
    exit(1)
header_content = header_match.group(1)

html_files = ["auth.html", "cart.html", "orders.html", "category.html", "wishlist.html"]

for file in html_files:
    file_path = os.path.join(frontend_dir, file)
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace header
    content = re.sub(r'<!-- ═══════════════════ HEADER ═══════════════════ -->.*?</header><!-- /site-header -->', header_content, content, flags=re.DOTALL)
    
    # Ensure script is included in footer
    if '<script src="js/script.js"></script>' not in content:
        content = content.replace('</body>', '<script src="js/script.js"></script>\n</body>')
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Headers and scripts updated successfully.")