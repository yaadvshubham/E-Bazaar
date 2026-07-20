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

  if (isLoggedIn) {
    if (formBody) formBody.style.display = 'block';
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
      rzpButton.innerHTML = 'Contacting Payment Gateway... <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';

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
              const cardFooter = document.getElementById('card-footer');
              if (cardFooter) cardFooter.style.display = 'none';
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
              rzpButton.innerHTML = originalText;
            }
          }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

      } catch (err) {
        alert('Order setup failed: ' + err.message);
        rzpButton.disabled = false;
        rzpButton.innerHTML = originalText;
      }
    });
  }
});
