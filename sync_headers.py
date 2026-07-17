import os
import re
import glob

# 1. Read index.html and extract the master header
with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Try to find header with the comments
header_match = re.search(r'(<!-- 🏛️ HEADER 🏛️ -->.*?</header><!-- /site-header -->)', index_html, re.DOTALL)
if header_match:
    master_header = header_match.group(1)
else:
    header_match = re.search(r'(<header id="site-header".*?</header>)', index_html, re.DOTALL)
    master_header = header_match.group(1)

# Remove any active classes from the master header's nav items so it's a clean slate
master_header_clean = re.sub(r'class="nav-btn active"', 'class="nav-btn"', master_header)

# 2. Iterate over all HTML files in Frontend/
html_files = glob.glob('Frontend/*.html')

for filepath in html_files:
    if os.path.basename(filepath) == 'index.html':
        continue # skip index.html as it's the source of truth
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the target header
    target_match = re.search(r'(<!-- 🏛️ HEADER 🏛️ -->.*?</header><!-- /site-header -->)', content, re.DOTALL)
    if target_match:
        content = content.replace(target_match.group(1), master_header_clean)
    else:
        target_match = re.search(r'(<header id="site-header".*?</header>)', content, re.DOTALL)
        if target_match:
            content = content.replace(target_match.group(1), master_header_clean)
        else:
            print(f'Skipping {filepath} - could not find header')
            continue
            
    # Re-apply active state based on filename
    basename = os.path.basename(filepath)
    if basename == 'orders.html':
        content = content.replace('id="nav-orders" aria-label="My Orders"', 'id="nav-orders" class="nav-btn active" aria-label="My Orders"')
        content = content.replace('class="nav-btn" id="nav-orders" class="nav-btn active"', 'id="nav-orders" class="nav-btn active"')
        
    elif basename == 'auth.html':
        content = content.replace('id="acc-btn" aria-label="My Account"', 'id="acc-btn" class="nav-btn active" aria-label="My Account"')
        content = content.replace('class="nav-btn" id="acc-btn" class="nav-btn active"', 'id="acc-btn" class="nav-btn active"')
        
    elif basename == 'cart.html':
        content = re.sub(r'(href="cart\.html"\s+class="nav-btn")', r'\1 active', content)
        
    elif basename == 'wishlist.html':
        content = re.sub(r'(href="wishlist\.html"\s+class="nav-btn")', r'\1 active', content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Updated header in {basename}')
