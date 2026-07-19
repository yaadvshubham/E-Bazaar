import os

with open('base_header.txt', 'r', encoding='utf-8') as f:
    header = f.read()

with open('base_footer.txt', 'r', encoding='utf-8') as f:
    footer = f.read()

# Update the page titles in the header for each page
returns_header = header.replace('<title>E-Bazaar | New Arrivals</title>', '<title>E-Bazaar | Returns & Refunds</title>').replace('data-page="category"', 'data-page="static"')
shipping_header = header.replace('<title>E-Bazaar | New Arrivals</title>', '<title>E-Bazaar | Shipping Info</title>').replace('data-page="category"', 'data-page="static"')
contact_header = header.replace('<title>E-Bazaar | New Arrivals</title>', '<title>E-Bazaar | Contact Us</title>').replace('data-page="category"', 'data-page="static"')

returns_main = '''
<main class="page-main">
  <div class="breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">Returns & Refunds</span>
  </div>
  <section class="section" style="max-width: 800px; margin: 0 auto;">
    <h1 class="sec-title" style="margin-bottom: 24px; font-size: 32px;">Returns & Refunds</h1>
    <div style="background: var(--bg-white); padding: 32px; border-radius: var(--r-lg); border: 1px solid var(--border); box-shadow: var(--shadow-sm); line-height: 1.6; color: var(--text);">
      <p style="margin-bottom: 16px;">We want you to be completely satisfied with your purchase. If you're not, we're here to help.</p>
      
      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 20px;">1. Return Window</h3>
      <p style="margin-bottom: 16px; color: var(--text-muted);">You have <strong>30 days</strong> from the date of delivery to initiate a return. Products must be unused, in their original condition, and with all original tags and packaging intact.</p>
      
      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 20px;">2. Non-Returnable Items</h3>
      <ul style="margin-bottom: 16px; margin-left: 20px; color: var(--text-muted);">
        <li>Perishable goods (e.g., fresh groceries)</li>
        <li>Personal care and hygiene products</li>
        <li>Customized or personalized items</li>
        <li>Gift cards</li>
      </ul>

      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 20px;">3. Refund Process</h3>
      <p style="margin-bottom: 16px; color: var(--text-muted);">Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. Approved refunds will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>

      <div style="background: var(--bg-alt); padding: 16px; border-radius: var(--r-md); border-left: 4px solid var(--accent); margin-top: 24px;">
        <strong>Need help with a return?</strong> Head over to our <a href="contact.html" style="color: var(--accent); text-decoration: underline;">Contact Us</a> page.
      </div>
    </div>
  </section>
</main>
'''

shipping_main = '''
<main class="page-main">
  <div class="breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">Shipping Info</span>
  </div>
  <section class="section" style="max-width: 800px; margin: 0 auto;">
    <h1 class="sec-title" style="margin-bottom: 24px; font-size: 32px;">Shipping Information</h1>
    <div style="background: var(--bg-white); padding: 32px; border-radius: var(--r-lg); border: 1px solid var(--border); box-shadow: var(--shadow-sm); line-height: 1.6; color: var(--text);">
      <p style="margin-bottom: 16px;">We partner with top-tier logistics providers to ensure your orders reach you safely and swiftly.</p>
      
      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 20px;">Delivery Speeds & Costs</h3>
      <div style="overflow-x: auto; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border);">
              <th style="padding: 12px;">Method</th>
              <th style="padding: 12px;">Estimated Time</th>
              <th style="padding: 12px;">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 12px; color: var(--text-muted);">Standard Delivery</td>
              <td style="padding: 12px; color: var(--text-muted);">3-5 Business Days</td>
              <td style="padding: 12px; color: var(--text-muted);">Free on orders over ₹499</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 12px; color: var(--text-muted);">Express Delivery</td>
              <td style="padding: 12px; color: var(--text-muted);">1-2 Business Days</td>
              <td style="padding: 12px; color: var(--text-muted);">₹99</td>
            </tr>
            <tr>
              <td style="padding: 12px; color: var(--text-muted);">Same Day Delivery</td>
              <td style="padding: 12px; color: var(--text-muted);">By 9:00 PM (Metro only)</td>
              <td style="padding: 12px; color: var(--text-muted);">₹199</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 20px;">Order Tracking</h3>
      <p style="margin-bottom: 16px; color: var(--text-muted);">Once your order ships, you'll receive a confirmation email with tracking information. You can also track your package directly from your <a href="orders.html" style="color: var(--accent); text-decoration: underline;">Orders</a> page.</p>

      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 20px;">International Shipping</h3>
      <p style="margin-bottom: 16px; color: var(--text-muted);">Currently, E-Bazaar only ships within India. We are working hard to expand our logistics network globally soon!</p>
    </div>
  </section>
</main>
'''

contact_main = '''
<main class="page-main">
  <div class="breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">Contact Us</span>
  </div>
  <section class="section" style="max-width: 800px; margin: 0 auto;">
    <h1 class="sec-title" style="margin-bottom: 8px; font-size: 32px;">Contact & Support</h1>
    <p class="sec-sub" style="margin-bottom: 32px; text-align: center;">Have a complaint, feedback, or a general query? We're here to listen.</p>

    <div style="background: var(--bg-white); padding: 32px; border-radius: var(--r-lg); border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
      <form id="contact-form" onsubmit="event.preventDefault(); alert('Your message has been received! Our support team will contact you within 24 hours.'); this.reset();">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div class="input-grp">
            <label for="c-name" class="input-lbl">Full Name</label>
            <input type="text" id="c-name" class="input-fld" placeholder="John Doe" required>
          </div>
          <div class="input-grp">
            <label for="c-email" class="input-lbl">Email Address</label>
            <input type="email" id="c-email" class="input-fld" placeholder="john@example.com" required>
          </div>
        </div>
        
        <div class="input-grp" style="margin-bottom: 16px;">
          <label for="c-type" class="input-lbl">Topic</label>
          <select id="c-type" class="input-fld" required style="background-color: var(--bg-alt);">
            <option value="">Select a topic...</option>
            <option value="complaint">File a Complaint</option>
            <option value="return">Return/Refund Issue</option>
            <option value="delivery">Delivery Delay</option>
            <option value="feedback">General Feedback</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="input-grp" style="margin-bottom: 24px;">
          <label for="c-msg" class="input-lbl">Message</label>
          <textarea id="c-msg" class="input-fld" rows="5" placeholder="Please describe your issue in detail..." required style="resize: vertical;"></textarea>
        </div>

        <button type="submit" class="hero-cta" style="width: 100%; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px;">
          Submit Ticket
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px;">
      <div style="background: var(--bg-alt); padding: 24px; border-radius: var(--r-md); text-align: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" style="margin-bottom: 12px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        <h4 style="margin-bottom: 8px; color: var(--text);">Call Us</h4>
        <p style="color: var(--text-muted); font-size: 14px;">1800-123-4567<br>Mon-Sat: 9 AM - 7 PM</p>
      </div>
      <div style="background: var(--bg-alt); padding: 24px; border-radius: var(--r-md); text-align: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" style="margin-bottom: 12px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <h4 style="margin-bottom: 8px; color: var(--text);">Email Us</h4>
        <p style="color: var(--text-muted); font-size: 14px;">support@e-bazaar.com<br>Response within 24 hrs</p>
      </div>
    </div>
  </section>
</main>
'''

with open('returns.html', 'w', encoding='utf-8') as f:
    f.write(returns_header + returns_main + footer)

with open('shipping.html', 'w', encoding='utf-8') as f:
    f.write(shipping_header + shipping_main + footer)

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(contact_header + contact_main + footer)

# Now update all HTML files to replace the footer links
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace links
    content = content.replace('<a href="#">Returns & Refunds</a>', '<a href="returns.html">Returns & Refunds</a>')
    content = content.replace('<a href="#">Shipping Info</a>', '<a href="shipping.html">Shipping Info</a>')
    content = content.replace('<a href="#">Contact Us</a>', '<a href="contact.html">Contact Us</a>')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Created 3 pages and updated {len(html_files)} HTML files.")
