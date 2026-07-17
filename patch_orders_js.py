with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = '''// --- ORDERS PAGE LOGIC ---
function initOrders() {
  const tabs = document.querySelectorAll('.orders-tab');
  const panels = document.querySelectorAll('.tab-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active to clicked tab
      tab.classList.add('active');

      // Show target panel
      const targetId = tab.dataset.target;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}'''

replacement = '''// --- ORDERS PAGE LOGIC ---
function initOrders() {
  const tabs = document.querySelectorAll('.orders-tab');
  const panels = document.querySelectorAll('.tab-panel');

  if (tabs.length && panels.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active to clicked tab
        tab.classList.add('active');

        // Show target panel
        const targetId = tab.dataset.target;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // Invoice Buttons
  const invoiceBtns = document.querySelectorAll('.btn-invoice');
  invoiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof showToast === 'function') {
        showToast('Downloading invoice... Please wait.');
      }
    });
  });

  // Return/Replace Modal Logic
  const returnBtns = document.querySelectorAll('.btn-return');
  const returnModal = document.getElementById('return-modal');
  const returnClose = document.getElementById('return-close-btn');
  const returnCancel = document.getElementById('return-form-cancel');
  const returnForm = document.getElementById('return-form');

  if (returnModal) {
    const openReturnModal = (e) => {
      e.preventDefault();
      returnModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeReturnModal = () => {
      returnModal.classList.remove('active');
      document.body.style.overflow = '';
      if (returnForm) returnForm.reset();
    };

    returnBtns.forEach(btn => btn.addEventListener('click', openReturnModal));
    if (returnClose) returnClose.addEventListener('click', closeReturnModal);
    if (returnCancel) returnCancel.addEventListener('click', closeReturnModal);

    // Close on overlay click
    returnModal.addEventListener('click', (e) => {
      if (e.target === returnModal) closeReturnModal();
    });

    // Handle Form Submit
    if (returnForm) {
      returnForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeReturnModal();
        if (typeof showToast === 'function') {
          showToast('Return request initiated successfully.');
        }
      });
    }
  }
}'''

js = js.replace(target, replacement)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Patched script.js')
