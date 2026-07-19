import os
import re

with open('base_header.txt', 'r', encoding='utf-8') as f:
    header = f.read()

# Create Privacy Policy content
privacy_header = header.replace('<title>E-Bazaar | New Arrivals</title>', '<title>E-Bazaar | Privacy Policy</title>').replace('data-page="category"', 'data-page="static"')

privacy_main = '''
<main class="page-main">
  <div class="breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">Privacy Policy</span>
  </div>
  <section class="section" style="max-width: 900px; margin: 0 auto; padding-top: 20px;">
    <h1 class="sec-title" style="margin-bottom: 24px; font-size: 36px;">Privacy Policy</h1>
    <p style="color: var(--text-muted); margin-bottom: 32px;">Last Updated: July 19, 2026</p>
    
    <div style="background: var(--bg-white); padding: 40px; border-radius: var(--r-lg); border: 1px solid var(--border); box-shadow: var(--shadow-sm); line-height: 1.7; color: var(--text);">
      <p style="margin-bottom: 24px;">At E-Bazaar, we are committed to protecting your personal data and respecting your privacy. This policy outlines how we collect, use, and protect your information when you use our services.</p>
      
      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">1. Information We Collect</h3>
      <p style="margin-bottom: 12px;"><strong>Directly Provided Data:</strong> When you create an account, place an order, or contact us, we collect your name, email address, shipping/billing address, phone number, and payment details.</p>
      <p style="margin-bottom: 24px;"><strong>Automatically Collected Data:</strong> We automatically collect certain information when you visit our site, including your IP address, browser type, device information, cookies, and browsing history.</p>

      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">2. How We Use Your Information</h3>
      <ul style="margin-bottom: 24px; margin-left: 20px; color: var(--text-muted);">
        <li>To process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
        <li>To communicate with you and provide customer support.</li>
        <li>To personalize your shopping experience and recommend products.</li>
        <li>To improve our website functionality, security, and fraud prevention.</li>
      </ul>

      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">3. Data Sharing and Third Parties</h3>
      <p style="margin-bottom: 24px;">We do not sell your personal data. We only share your information with trusted third parties necessary to operate our business, such as payment processors (e.g., Stripe, PayPal), shipping partners, and analytics providers (e.g., Google Analytics). These parties are obligated to keep your information secure and confidential.</p>

      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">4. Your Rights</h3>
      <p style="margin-bottom: 24px;">Depending on your location, you have the right to access, correct, delete, or restrict the processing of your personal data. You can update your account information directly in your profile or contact us to exercise these rights.</p>

      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">5. Cookies</h3>
      <p style="margin-bottom: 24px;">We use cookies to keep track of your cart, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, though this may limit your ability to use certain features of our site.</p>

      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">6. Security</h3>
      <p style="margin-bottom: 24px;">We implement robust security measures, including SSL encryption and strict access controls, to protect your personal information from unauthorized access, alteration, or disclosure.</p>

      <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 22px; color: var(--accent);">7. Contact Us</h3>
      <p style="margin-bottom: 16px;">If you have any questions or concerns regarding this Privacy Policy, please reach out to our Data Protection Officer via our <a href="contact.html" style="color: var(--accent); text-decoration: underline;">Contact Us</a> page or email us at <strong>privacy@e-bazaar.com</strong>.</p>
    </div>
  </section>
</main>
'''

# Create FAQ content
faq_header = header.replace('<title>E-Bazaar | New Arrivals</title>', '<title>E-Bazaar | FAQs</title>').replace('data-page="category"', 'data-page="static"')

faq_main = '''
<main class="page-main">
  <div class="breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a><span aria-hidden="true">&rsaquo;</span><span aria-current="page">FAQs</span>
  </div>
  <section class="section" style="max-width: 900px; margin: 0 auto; padding-top: 20px;">
    <div style="text-align: center; margin-bottom: 48px;">
      <h1 style="font-size: 42px; font-weight: 800; color: var(--text); margin-bottom: 16px;">Frequently Asked Questions</h1>
      <p style="color: var(--text-muted); font-size: 18px;">Find answers to our most common queries below.</p>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 16px;">
      
      <!-- FAQ 1 -->
      <div style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--accent);">How long does delivery take?</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">Standard delivery takes 3-5 business days. We also offer Express (1-2 days) and Same Day delivery in select metro cities. Check our <a href="shipping.html" style="color: var(--text); text-decoration: underline;">Shipping Info</a> for more details.</p>
      </div>

      <!-- FAQ 2 -->
      <div style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--accent);">What is your return policy?</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">We offer a 10-day return window for most items, provided they are unused and in original packaging. Some items like perishables and personal care products are non-returnable. Please read our full <a href="returns.html" style="color: var(--text); text-decoration: underline;">Return & Refund Policy</a>.</p>
      </div>

      <!-- FAQ 3 -->
      <div style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--accent);">How can I track my order?</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">Once your order ships, you will receive an email with a tracking link. You can also view real-time updates by visiting the <a href="orders.html" style="color: var(--text); text-decoration: underline;">Track My Order</a> page in your account dashboard.</p>
      </div>

      <!-- FAQ 4 -->
      <div style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--accent);">What payment methods do you accept?</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">We accept all major Credit and Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe), Net Banking, and Cash on Delivery (COD) for eligible pincodes.</p>
      </div>

      <!-- FAQ 5 -->
      <div style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--accent);">Can I change or cancel my order?</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">You can cancel your order within 2 hours of placing it via your account dashboard. Once an order has been processed or shipped, it cannot be canceled, but you can initiate a return upon delivery.</p>
      </div>

    </div>
    
    <div style="text-align: center; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border);">
      <p style="color: var(--text-muted); margin-bottom: 16px;">Still have questions?</p>
      <a href="contact.html" class="hero-cta" style="display: inline-block; text-decoration: none;">Contact Support</a>
    </div>
  </section>
</main>
'''

# Read and Update Master Footer
with open('master_footer.txt', 'r', encoding='utf-8') as f:
    master_footer = f.read()

# Ensure we have the latest updated links in master footer
master_footer = master_footer.replace('<a href="#">Returns & Refunds</a>', '<a href="returns.html">Return & Refund Policy</a>')
master_footer = master_footer.replace('<a href="#">Return & Refund Policy</a>', '<a href="returns.html">Return & Refund Policy</a>')
master_footer = master_footer.replace('<a href="#">Shipping Info</a>', '<a href="shipping.html">Shipping Info</a>')
master_footer = master_footer.replace('<a href="#">Contact Us</a>', '<a href="contact.html">Contact Us</a>')

# Add links for FAQ and Privacy Policy
master_footer = master_footer.replace('<a href="#">FAQs</a>', '<a href="faq.html">FAQs</a>')
master_footer = master_footer.replace('<a href="#">Privacy Policy</a>', '<a href="privacy.html">Privacy Policy</a>')
master_footer = master_footer.replace('<a href="#">Privacy</a>', '<a href="privacy.html">Privacy</a>')

# Save new files
with open('privacy.html', 'w', encoding='utf-8') as f:
    f.write(privacy_header + privacy_main + master_footer)

with open('faq.html', 'w', encoding='utf-8') as f:
    f.write(faq_header + faq_main + master_footer)

# Apply Master Footer to ALL HTML files
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
updated_count = 0

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Use regex to find the entire footer block and replace it
    start_tag = '<footer role="contentinfo">'
    end_tag = '</footer>'
    
    start_idx = content.find(start_tag)
    if start_idx != -1:
        end_idx = content.find(end_tag, start_idx)
        if end_idx != -1:
            new_content = content[:start_idx] + master_footer.strip() + content[end_idx + len(end_tag):]
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated_count += 1

print(f"Generated privacy.html and faq.html. Applied master footer to {updated_count} files.")
