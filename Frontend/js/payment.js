/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — payment.js
   Razorpay Test Gateway & Checkout Orchestrator
   ═══════════════════════════════════════════════════════════════════════ */

// Dynamic API Base
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'http://localhost:5000/api'; // Fallback

// Calculate total from cart supporting both 'cart' and 'eb_cart_items' keys
let total = 0;
let items = [];
try {
  const rawCart = localStorage.getItem('cart') || localStorage.getItem('eb_cart_items') || '[]';
  const cart = JSON.parse(rawCart);
  let subtotal = 0;
  let totalDiscount = 0;

  cart.forEach(item => {
    const pPrice = parseFloat(String(item.price || item.pPrice || '0').replace(/,/g, '')) || 0;
    const oPrice = parseFloat(String(item.orig || item.price || item.oPrice || '0').replace(/,/g, '')) || 0;
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

  const checkoutTotal = localStorage.getItem('checkout_total');
  if (checkoutTotal && !isNaN(parseInt(checkoutTotal))) {
    total = parseInt(checkoutTotal);
  } else {
    total = subtotal - totalDiscount;
  }
} catch (e) {
  console.error('[Payment JS] Error calculating cart total:', e);
}

// Retrieve delivery address
let deliveryAddress = 'No address specified';
try {
  const userObj = JSON.parse(localStorage.getItem('eb_user'));
  if (userObj && userObj.addresses && userObj.addresses.length > 0) {
    const addr = userObj.addresses[0];
    deliveryAddress = `${addr.fname || ''} ${addr.lname || ''}, ${addr.line1 || ''}, ${addr.line2 ? addr.line2 + ', ' : ''}${addr.city || ''} - ${addr.pin || ''}. Phone: ${addr.phone || ''}`;
  } else if (userObj) {
    deliveryAddress = `${userObj.name || 'User'}, No address saved. Email: ${userObj.email || ''}`;
  }
} catch (err) {
  console.error('[Payment JS] Error reading user address:', err);
}

// Check login state and toggle view
function checkLoginState() {
  const isLoggedIn = window.AuthSession && window.AuthSession.isLoggedIn();
  const formBody = document.getElementById('form-body');
  const loginWarning = document.getElementById('login-warning');

  if (isLoggedIn) {
    if (formBody) formBody.style.display = 'block';
    if (loginWarning) loginWarning.style.display = 'none';

    const user = window.AuthSession.getUser();
    const emailField = document.getElementById('card-email');
    if (emailField && user) {
      emailField.value = user.email || '';
    }
    const nameField = document.getElementById('card-name');
    if (nameField && user) {
      nameField.value = user.name || '';
    }
  } else {
    if (formBody) formBody.style.display = 'none';
    if (loginWarning) loginWarning.style.display = 'block';
  }
}

// DOM Setup
document.addEventListener('DOMContentLoaded', () => {
  // Update amounts in UI
  const displayAmountEl = document.getElementById('display-amount');

  if (displayAmountEl) {
    displayAmountEl.textContent = '₹' + total.toLocaleString('en-IN');
  }

  // Check initial login state
  checkLoginState();

  // Watch for focus to catch external login events
  window.addEventListener('focus', checkLoginState);

  // Razorpay test button listener
  const rzpButton = document.getElementById('rzp-button1');
  if (rzpButton) {
    rzpButton.addEventListener('click', async (e) => {
      e.preventDefault(); // Ensure no form submission happens

      if (!window.AuthSession || !window.AuthSession.isLoggedIn()) {
        alert('Please log in to secure this transaction.');
        checkLoginState();
        return;
      }
      if (items.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      if (typeof Razorpay === 'undefined') {
        alert('Razorpay SDK is not loaded. Please disable your adblocker or check your internet connection.');
        return;
      }

      rzpButton.disabled = true;
      const originalHTML = rzpButton.innerHTML; // preserve SVG
      rzpButton.innerHTML = 'Contacting Payment Gateway... <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';

      try {
        const token = window.AuthSession.getToken();
        const res = await fetch(`${API_BASE}/orders/create`, {
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

        if (res.status === 401) {
          if (window.AuthSession && window.AuthSession.clear) {
            window.AuthSession.clear();
          }
          alert("Your session has expired or is invalid. Please log in again.");
          window.location.reload();
          return;
        }

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
              rzpButton.innerHTML = 'Verifying Transaction... <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
              const verifyRes = await fetch(`${API_BASE}/orders/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  walletUsed: parseFloat(localStorage.getItem('wallet_applied') || '0')
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
              localStorage.removeItem('checkout_total');
              localStorage.removeItem('wallet_applied');

              // Signal parent window
              if (window.opener && !window.opener.closed) {
                try {
                  window.opener.postMessage('PAYMENT_SUCCESS', '*');
                } catch (err) {
                  console.warn('Could not post message to opener', err);
                }
              }

              // UI Transition to Success
              const formBody = document.getElementById('form-body');
              if (formBody) formBody.style.display = 'none';
              const cardFooter = document.getElementById('card-footer');
              if (cardFooter) cardFooter.style.display = 'none';
              const successBody = document.getElementById('success-body');
              if (successBody) successBody.style.display = 'block';

            } catch (err) {
              console.error(err);
              alert('Payment Verification Failed: ' + err.message);
              rzpButton.disabled = false;
              rzpButton.innerHTML = originalHTML;
            }
          },
          prefill: {
            name: (window.AuthSession.getUser() && window.AuthSession.getUser().name) ? window.AuthSession.getUser().name : '',
            email: (window.AuthSession.getUser() && window.AuthSession.getUser().email) ? window.AuthSession.getUser().email : '',
            contact: (window.AuthSession.getUser() && window.AuthSession.getUser().phone) ? window.AuthSession.getUser().phone : ''
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: function () {
              rzpButton.disabled = false;
              rzpButton.innerHTML = originalHTML;
            }
          }
        };

        const rzp1 = new Razorpay(options);

        rzp1.on('payment.failed', function (response) {
          alert("Payment Failed. Reason: " + (response.error ? response.error.description : 'Unknown Error'));
          rzpButton.disabled = false;
          rzpButton.innerHTML = originalHTML;
        });

        rzp1.open();

      } catch (err) {
        console.error(err);
        alert('Order setup failed: ' + err.message);
        rzpButton.disabled = false;
        rzpButton.innerHTML = originalHTML;
      }
    });
  }
});
