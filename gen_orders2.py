import re

with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Make sure orders nav has id='nav-orders'
index_html = re.sub(r'<a href="orders\.html" class="nav-btn" aria-label="My Orders">',
                    '<a href="orders.html" class="nav-btn" id="nav-orders" aria-label="My Orders">', index_html)

with open('Frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

header_match = re.search(r'(<!-- 🏛️ HEADER 🏛️ -->.*?</header><!-- /site-header -->)', index_html, re.DOTALL)
if header_match:
    header = header_match.group(1)
else:
    header_match = re.search(r'(<header id="site-header".*?</header>)', index_html, re.DOTALL)
    header = header_match.group(1)

# Add active class to nav-orders
header = header.replace('id="nav-orders"', 'id="nav-orders" class="nav-btn active"')
# Fix any double class if it was already class="nav-btn"
header = re.sub(r'class="nav-btn"\s+id="nav-orders"\s+class="nav-btn active"', 'class="nav-btn active" id="nav-orders"', header)
header = re.sub(r'class="nav-btn active" id="nav-orders"\s+class="nav-btn"', 'class="nav-btn active" id="nav-orders"', header)

orders_page = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title id="page-title">My Orders — E-Bazaar</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="stylesheet" href="css/orders.css"/>
</head>
<body data-page="orders">

{header}

<main id="main-content" class="orders-wrapper">
  <div class="orders-container">
    <h1 class="page-title">My Orders</h1>
    <p class="page-sub">Track, manage, and review your recent purchases.</p>
    
    <div class="orders-tabs">
      <button class="orders-tab active" data-target="active-orders">Active Orders <span class="count">(1)</span></button>
      <button class="orders-tab" data-target="past-orders">Order History</button>
      <button class="orders-tab" data-target="returns-refunds">Returns & Refunds</button>
    </div>

    <!-- Active Orders Panel -->
    <div class="tab-panel active" id="active-orders">
      
      <div class="order-card-wrapper">
        <div class="order-card-top">
          <div class="order-info-grid">
            <div class="info-block">
              <span class="info-label">ORDER PLACED</span>
              <span class="info-val">12 July 2026</span>
            </div>
            <div class=\"info-block\">
              <span class=\"info-label\">TOTAL</span>
              <span class=\"info-val\">₹4,299</span>
            </div>
            <div class=\"info-block\">
              <span class=\"info-label\">SHIP TO</span>
              <span class=\"info-val\">Aryan, New Delhi</span>
            </div>
          </div>
          <div class=\"order-status-badge status-shipped\">Shipped</div>
        </div>

        <div class=\"order-card-body\">
          <div class=\"order-split\">
            <div class=\"order-left\">
              <div class=\"item-img-box\">
                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>
              </div>
              <div class=\"item-details\">
                <div class=\"item-title\">PUMA RS-X Core Sneakers - White/Black</div>
                <div class=\"item-meta\">Qty: 1</div>
                <div class=\"item-meta\">Size: 9 UK</div>
              </div>
            </div>
            
            <div class=\"order-right actions-stack\">
              <button class=\"btn-primary-outline\">Track Package</button>
              <button class=\"btn-text-link\">Download Invoice</button>
              <button class=\"btn-text-link\">Return or Replace Items</button>
            </div>
          </div>
          
          <div class=\"timeline-container\">
            <div class=\"timeline-track\"></div>
            
            <div class=\"milestone completed\">
              <div class=\"node-indicator\">✓</div>
              <div class=\"node-label\">Confirmed</div>
            </div>
            
            <div class=\"milestone active\">
              <div class=\"node-indicator\"></div>
              <div class=\"node-label\">Shipped</div>
            </div>
            
            <div class=\"milestone pending\">
              <div class=\"node-indicator\"></div>
              <div class=\"node-label\">Out for Delivery</div>
            </div>
            
            <div class=\"milestone pending\">
              <div class=\"node-indicator\"></div>
              <div class=\"node-label\">Delivered</div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
    
    <!-- Past Orders Panel (Empty Placeholder) -->
    <div class=\"tab-panel\" id=\"past-orders\">
      <div class=\"empty-state\">No past orders found.</div>
    </div>
    
    <!-- Returns Panel (Empty Placeholder) -->
    <div class=\"tab-panel\" id=\"returns-refunds\">
      <div class=\"empty-state\">No returns or refunds initiated.</div>
    </div>

  </div>
</main>

<script src="js/script.js"></script>
</body>
</html>
'''

with open('Frontend/orders.html', 'w', encoding='utf-8') as f:
    f.write(orders_page)
print('orders.html generated successfully.')
