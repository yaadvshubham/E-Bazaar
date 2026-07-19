import re

faqs = [
    # Page 1
    ("How long does delivery take?", "Standard delivery takes 3-5 business days. We also offer Express (1-2 days) and Same Day delivery in select metro cities. Check our Shipping Info for more details."),
    ("What is your return policy?", "We offer a 10-day return window for most items, provided they are unused and in original packaging. Some items like perishables and personal care products are non-returnable. Please read our full Return & Refund Policy."),
    ("How can I track my order?", "Once your order ships, you will receive an email with a tracking link. You can also view real-time updates by visiting the Track My Order page in your account dashboard."),
    ("What payment methods do you accept?", "We accept all major Credit and Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe), Net Banking, and Cash on Delivery (COD) for eligible pincodes."),
    ("Can I change or cancel my order?", "You can cancel your order within 2 hours of placing it via your account dashboard. Once an order has been processed or shipped, it cannot be canceled, but you can initiate a return upon delivery."),
    
    # Page 2
    ("Do you ship internationally?", "Currently, E-Bazaar only ships within India. We are working on expanding our delivery network to select international destinations in the near future."),
    ("Are the products genuine and authentic?", "Absolutely! We source directly from brands or authorized distributors. Every product comes with an authenticity guarantee and original manufacturer warranty where applicable."),
    ("How do I apply a coupon code?", "During checkout, you will see a 'Promo Code' or 'Apply Coupon' box on the right side of the payment page. Enter your code and click 'Apply' to see the updated total."),
    ("What happens if I receive a damaged product?", "If you receive a defective or damaged item, please initiate a return or replacement request within 48 hours of delivery from your Orders page. Our team will arrange a free pickup."),
    ("Do you offer gift wrapping?", "Yes! For a nominal fee of ₹49, you can select the 'Gift Wrap' option during checkout. You can also include a personalized message for the recipient."),
    
    # Page 3
    ("How does the E-Bazaar wallet work?", "The E-Bazaar wallet stores your cashback and refunds. You can use your wallet balance to pay for future purchases seamlessly without entering card details."),
    ("What if an item is out of stock?", "You can click the 'Notify Me' button on any out-of-stock product. We will send you an email and push notification the moment it becomes available again."),
    ("How do I contact customer support?", "You can reach out to our 24/7 customer support team via the Contact Us page, where you can submit a form, or call our toll-free number 1800-EBAZAAR."),
    ("Can I change my delivery address after ordering?", "Delivery addresses can only be changed before the order is dispatched. Please contact support immediately if you need to update your address."),
    ("Do you offer bulk or corporate discounts?", "Yes, we have a dedicated B2B program for bulk orders and corporate gifting. Please email corporate@e-bazaar.com for customized quotes and discounts.")
]

faq_html = '<div id="faq-container" style="display: flex; flex-direction: column; gap: 16px;">\n'
for i, (q, a) in enumerate(faqs):
    faq_html += f'''
      <div class="faq-item" data-index="{i}" style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; display: none;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--accent);">{q}</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">{a}</p>
      </div>
    '''
faq_html += '</div>\n'

# Pagination UI
faq_html += '''
<div id="faq-pagination" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 32px; flex-wrap: wrap;">
  <button class="pg-btn" id="pg-start" aria-label="First page">&laquo; Start</button>
  <button class="pg-btn" id="pg-prev" aria-label="Previous page">&lsaquo; Prev</button>
  <div id="pg-numbers" style="display: flex; gap: 8px;"></div>
  <button class="pg-btn" id="pg-next" aria-label="Next page">Next &rsaquo;</button>
  <button class="pg-btn" id="pg-end" aria-label="Last page">End &raquo;</button>
</div>

<style>
  .pg-btn {
    padding: 8px 16px;
    background: var(--bg-white);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    color: var(--text);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .pg-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
    background: #f9fafb;
  }
  .pg-btn.active {
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }
  .pg-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".faq-item");
    const ITEMS_PER_PAGE = 5;
    const TOTAL_PAGES = Math.ceil(items.length / ITEMS_PER_PAGE);
    let currentPage = 1;

    const btnStart = document.getElementById("pg-start");
    const btnPrev = document.getElementById("pg-prev");
    const btnNext = document.getElementById("pg-next");
    const btnEnd = document.getElementById("pg-end");
    const pgNumbers = document.getElementById("pg-numbers");

    function renderPage(page) {
      if (page < 1) page = 1;
      if (page > TOTAL_PAGES) page = TOTAL_PAGES;
      currentPage = page;

      // Show/Hide Items
      items.forEach((item, index) => {
        if (index >= (page - 1) * ITEMS_PER_PAGE && index < page * ITEMS_PER_PAGE) {
          item.style.display = "block";
          // Add a subtle fade in
          item.style.opacity = "0";
          item.style.transform = "translateY(10px)";
          item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 50);
        } else {
          item.style.display = "none";
        }
      });

      // Update buttons state
      btnStart.disabled = (page === 1);
      btnPrev.disabled = (page === 1);
      btnNext.disabled = (page === TOTAL_PAGES);
      btnEnd.disabled = (page === TOTAL_PAGES);

      // Render number buttons
      pgNumbers.innerHTML = "";
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        const numBtn = document.createElement("button");
        numBtn.className = "pg-btn" + (i === page ? " active" : "");
        numBtn.innerText = i;
        numBtn.onclick = () => {
          renderPage(i);
          window.scrollTo({ top: document.getElementById('faq-container').offsetTop - 100, behavior: 'smooth' });
        };
        pgNumbers.appendChild(numBtn);
      }
    }

    btnStart.onclick = () => renderPage(1);
    btnEnd.onclick = () => renderPage(TOTAL_PAGES);
    btnPrev.onclick = () => renderPage(currentPage - 1);
    btnNext.onclick = () => renderPage(currentPage + 1);

    // Initial render
    renderPage(1);
  });
</script>
'''

with open('faq.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '<div style="display: flex; flex-direction: column; gap: 16px;">'
end_marker = '<div style="text-align: center; margin-top: 48px;'
start_idx = html.find(start_marker)
end_idx = html.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_html = html[:start_idx] + faq_html + html[end_idx:]
    with open('faq.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('Updated faq.html with pagination')
else:
    print('Could not find markers')
