import re

with open('Frontend/orders.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add classes to buttons
html = html.replace('<button class="btn-text-link">Download Invoice</button>', '<button class="btn-text-link btn-invoice">Download Invoice</button>')
html = html.replace('<button class="btn-text-link">Return or Replace Items</button>', '<button class="btn-text-link btn-return">Return or Replace Items</button>')

# Add Return Modal
return_modal = '''
<!-- RETURN MODAL -->
<div class="modal-overlay" id="return-modal" role="dialog" aria-modal="true" aria-label="Initiate Return">
  <div class="modal-card">
    <div class="modal-head">
      <h2 class="modal-title">Return or Replace Items</h2>
      <button class="modal-close" id="return-close-btn" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <form class="addr-form" id="return-form" novalidate>
        <div class="form-group full">
          <label for="ret-reason">Reason for Return</label>
          <select id="ret-reason" required style="width:100%; padding:12px; border:1px solid var(--border-line); border-radius:8px; font-family:var(--font-primary); background:var(--bg-canvas); color:var(--text-primary);">
            <option value="">Select a reason...</option>
            <option value="defective">Item is defective or doesn't work</option>
            <option value="damaged">Item or packaging was damaged</option>
            <option value="wrong">Wrong item sent</option>
            <option value="no-longer-needed">No longer needed / Better price available</option>
            <option value="other">Other (Explain below)</option>
          </select>
        </div>
        <div class="form-group full" style="margin-top:16px;">
          <label for="ret-comments">Comments (Optional)</label>
          <textarea id="ret-comments" rows="3" placeholder="Please provide any additional details..." style="width:100%; padding:12px; border:1px solid var(--border-line); border-radius:8px; font-family:var(--font-primary); background:var(--bg-canvas); color:var(--text-primary); resize:vertical; margin-top:4px;"></textarea>
        </div>
        <div class="form-group full" style="margin-top:16px;">
          <label>Resolution Action</label>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="radio" name="ret-action" value="replace" checked /> Replace with identical item
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="radio" name="ret-action" value="refund-original" /> Refund to Original Payment Method
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="radio" name="ret-action" value="refund-wallet" /> Refund to E-Bazaar Wallet (Instant)
            </label>
          </div>
        </div>
        <div style="display:flex; gap:16px; margin-top:24px;">
          <button type="submit" class="form-submit" style="flex:1">Confirm Request</button>
          <button type="button" id="return-form-cancel" class="addr-act-btn secondary" style="height:48px; padding:0 24px; border-radius:14px; background:var(--bg-canvas); border:1px solid var(--border-line); color:var(--text-primary); cursor:pointer;">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</div>
'''

if 'id="return-modal"' not in html:
    html = html.replace('<script src="js/script.js"></script>', return_modal + '\n<script src="js/script.js"></script>')

with open('Frontend/orders.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('orders.html updated')
