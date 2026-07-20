/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — payment.js
   Razorpay Test Gateway & Checkout Orchestrator
   ═══════════════════════════════════════════════════════════════════════ */

// Calculate total from cart supporting both 'cart' and 'eb_cart_items' keys
let total = 0;
let items = [];
try {
  const rawCart = localStorage.getItem('cart') || localStorage.getItem('eb_cart_items') || '[]';
  const cart = JSON.parse(rawCart);
  let subtotal = 0;
  let totalDiscount = 0;
  
  cart.forEach(item => {
    const pPrice = parseInt(String(item.price || item.pPrice || '0').replace(/[^\d]/g, '')) || 0;
    const oPrice = parseInt(String(item.orig || item.price || item.oPrice || '0').replace(/[^\d]/g, '')) || 0;
    const qty = parseInt(item.qty || item.quantity || 1) || 1;
    
    subtotal += oPrice * qty;
    totalDiscount += (oPrice - pPrice) * qty;

    items.push({
      id: item.id || item.productId,
      title: item.title || item.name || 'Product',
      price: pPrice,
      qty: qty,
      image: item.image || item.img
    });
  });
  
  total = subtotal - totalDiscount;
} catch (e) {
  console.error('[Payment JS] Error calculating cart total:', e);
}

// Retrieve delivery address
let deliveryAddress = 'No address specified';
try {
  const userObj = JSON.parse(localStorage.getItem('eb_user'));
  if (userObj && userObj.addresses && userObj.addresses.length > 0) {
    const addr = userObj.addresses[0];
    deliveryAddress = `${addr.fname} ${addr.lname}, ${addr.line1}, ${addr.line2 ? addr.line2 + ', ' : ''}${addr.city} - ${addr.pin}. Phone: ${addr.phone}`;
  } else if (userObj) {
    deliveryAddress = `${userObj.name}, No address saved. Email: ${userObj.email}`;
  }
} catch (err) {
  console.error('[Payment JS] Error reading user address:', err);
}

// Check login state and toggle view
function checkLoginState() {
  const isLoggedIn = window.AuthSession && window.AuthSession.isLoggedIn();
  const formBody = document.getElementById('form-body');
  const loginWarning = document.getElementById('login-warning');
  const rzpSection = document.querySelector('.razorpay-section');
  const disclaimer = document.querySelector('.sandbox-disclaimer');

  if (isLoggedIn) {
    if (formBody) formBody.style.display = 'block';
    if (rzpSection) rzpSection.style.display = 'block';
    if (disclaimer) disclaimer.style.display = 'block';
    if (loginWarning) loginWarning.style.display = 'none';

    const user = window.AuthSession.getUser();
    const emailField = document.getElementById('card-email');
    if (emailField && user) {
      emailField.value = user.email;
    }
    const nameField = document.getElementById('card-name');
    if (nameField && user) {
      nameField.value = user.name;
    }
  } else {
    if (formBody) formBody.style.display = 'none';
    if (rzpSection) rzpSection.style.display = 'none';
    if (disclaimer) disclaimer.style.display = 'none';
    if (loginWarning) loginWarning.style.display = 'block';
  }
}

// Order placement handler (fallback/standard checkout)
async function submitOrder(paymentMethod, loadingControls) {
  if (!window.AuthSession || !window.AuthSession.isLoggedIn()) {
    alert('You must be logged in to proceed.');
    checkLoginState();
    return;
  }

  if (items.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const { btn, text, spinner } = loadingControls;
  if (btn) btn.disabled = true;
  if (text) text.style.display = 'none';
  if (spinner) spinner.style.display = 'block';

  try {
    const token = window.AuthSession.getToken();
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items,
        totalAmount: total,
        paymentMethod,
        deliveryAddress
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Server error placing order');
    }

    // Clear cart
    localStorage.setItem('cart', '[]');
    localStorage.setItem('eb_cart_items', '[]');
    localStorage.setItem('eb-cart', '0');

    // Signal opener window if exists
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage('PAYMENT_SUCCESS', '*');
      } catch (err) { }
    }

    // Show success state
    const formBody = document.getElementById('form-body');
    if (formBody) formBody.style.display = 'none';
    const rzpSection = document.querySelector('.razorpay-section');
    if (rzpSection) rzpSection.style.display = 'none';
    document.getElementById('card-footer').style.display = 'none';
    document.querySelector('.sandbox-disclaimer').style.display = 'none';
    document.getElementById('success-body').style.display = 'block';

  } catch (err) {
    console.error('[Payment] Error placing order:', err);
    alert('Payment processing failed: ' + err.message);
    if (btn) btn.disabled = false;
    if (text) text.style.display = 'block';
    if (spinner) spinner.style.display = 'none';
  }
}

// DOM Setup
document.addEventListener('DOMContentLoaded', () => {
  // Update amounts in UI
  const displayAmountEl = document.getElementById('display-amount');
  const btnTextEl = document.getElementById('btn-text');
  
  if (displayAmountEl) {
    displayAmountEl.textContent = '₹' + total.toLocaleString('en-IN');
  }
  if (btnTextEl) {
    btnTextEl.textContent = 'Pay ₹' + total.toLocaleString('en-IN');
  }

  // Check initial login state
  checkLoginState();

  // Watch for focus to catch external login events
  window.addEventListener('focus', checkLoginState);

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.target).classList.add('active');
    });
  });

  // Razorpay test button listener
  const rzpButton = document.getElementById('rzp-button1');
  if (rzpButton) {
    rzpButton.addEventListener('click', async () => {
      if (!window.AuthSession || !window.AuthSession.isLoggedIn()) {
        alert('Please log in to secure this transaction.');
        checkLoginState();
        return;
      }
      if (items.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      rzpButton.disabled = true;
      const originalText = rzpButton.textContent;
      rzpButton.textContent = 'Contacting Payment Gateway...';

      try {
        const token = window.AuthSession.getToken();
        const res = await fetch('http://localhost:5000/api/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            items,
            totalAmount: total,
            deliveryAddress
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to create Razorpay transaction');
        }

        const rzpData = await res.json();

        // Razorpay Options
        const options = {
          key: rzpData.key_id,
          amount: rzpData.amount,
          currency: rzpData.currency || 'INR',
          name: 'E-Bazaar',
          description: 'Portfolio Test Payment',
          order_id: rzpData.order_id,
          handler: async function (response) {
            try {
              rzpButton.textContent = 'Verifying Transaction...';
              const verifyRes = await fetch('http://localhost:5000/api/orders/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              if (!verifyRes.ok) {
                const verifyErr = await verifyRes.json();
                throw new Error(verifyErr.error || 'Signature check failed');
              }

              // Clear cart
              localStorage.setItem('cart', '[]');
              localStorage.setItem('eb_cart_items', '[]');
              localStorage.setItem('eb-cart', '0');

              // Signal parent window
              if (window.opener && !window.opener.closed) {
                try {
                  window.opener.postMessage('PAYMENT_SUCCESS', '*');
                } catch (e) {}
              }

              // UI Transition to Success
              const formBody = document.getElementById('form-body');
              if (formBody) formBody.style.display = 'none';
              const rzpSec = document.querySelector('.razorpay-section');
              if (rzpSec) rzpSec.style.display = 'none';
              document.getElementById('card-footer').style.display = 'none';
              document.querySelector('.sandbox-disclaimer').style.display = 'none';
              document.getElementById('success-body').style.display = 'block';

            } catch (err) {
              alert('Payment Verification Failed: ' + err.message);
              rzpButton.disabled = false;
              rzpButton.textContent = originalText;
            }
          },
          prefill: {
            name: window.AuthSession.getUser()?.name || '',
            email: window.AuthSession.getUser()?.email || '',
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: function() {
              rzpButton.disabled = false;
              rzpButton.textContent = originalText;
            }
          }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

      } catch (err) {
        alert('Order setup failed: ' + err.message);
        rzpButton.disabled = false;
        rzpButton.textContent = originalText;
      }
    });
  }

  // Fallback card payment submission
  const cardForm = document.getElementById('payment-form');
  if (cardForm) {
    cardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitOrder('Credit/Debit Card', {
        btn: document.getElementById('btn-pay'),
        text: document.getElementById('btn-text'),
        spinner: document.getElementById('spinner')
      });
    });
  }

  // Fallback UPI payment confirmation
  const upiButton = document.getElementById('btn-upi-pay');
  if (upiButton) {
    upiButton.addEventListener('click', () => {
      submitOrder('UPI', {
        btn: upiButton,
        text: document.getElementById('btn-upi-text'),
        spinner: document.getElementById('upi-spinner')
      });
    });
  }

  // Fallback Netbanking payment confirmation
  const nbButton = document.getElementById('btn-netbanking-pay');
  if (nbButton) {
    nbButton.addEventListener('click', () => {
      const bankSelect = document.querySelector('.bank-select');
      const selectedBank = bankSelect ? bankSelect.value : 'SBI';
      submitOrder('Netbanking - ' + selectedBank, {
        btn: nbButton,
        text: document.getElementById('btn-nb-text'),
        spinner: document.getElementById('nb-spinner')
      });
    });
  }
});
