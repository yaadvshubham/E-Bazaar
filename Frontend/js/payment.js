/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — payment.js
   Full-Stack Secure Checkout and Razorpay Integration
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Checks
    const token = AuthSession.getToken();
    const user = AuthSession.getUser();

    // Check if the user is logged in. Redirect to auth.html if not.
    if (!token || !user) {
        showToast('🔒 Please sign in to complete your purchase.');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
        return;
    }

    // 2. Retrieve & Calculate Totals
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('eb_cart_items') || localStorage.getItem('cart') || '[]');
    } catch (e) {
        cart = [];
    }

    let totalAmount = parseInt(localStorage.getItem('checkout_total')) || 0;
    if (totalAmount <= 0 && cart.length > 0) {
        // Fallback: Calculate total directly from cart items
        totalAmount = cart.reduce((sum, item) => {
            const priceNum = parseInt(String(item.price).replace(/[^\d]/g, '')) || 0;
            return sum + (priceNum * (item.qty || 1));
        }, 0);
    }

    // Retrieve selected delivery address text
    const addressText = localStorage.getItem('eb_selected_address') || "47, Sector 18, DLF Phase 3, New Delhi, Delhi — 110001";

    const displayAmtEl = document.getElementById('display-amount');
    const payBtn = document.getElementById('rzp-button');

    if (displayAmtEl) {
        displayAmtEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
    }

    // Render Dynamic Order Summary Items List
    const summaryContainer = document.getElementById('order-summary-items');
    if (summaryContainer && cart.length > 0) {
        summaryContainer.innerHTML = cart.map(item => {
            const priceNum = parseInt(String(item.price).replace(/[^\d]/g, '')) || 0;
            const itemTotal = priceNum * (item.qty || 1);
            const titleText = item.name || item.title || 'Product Item';
            return `
                <div class="summary-item-row">
                    <div style="display: flex; gap: 10px; align-items: center; max-width: 70%;">
                        <div style="width: 36px; height: 36px; border-radius: 4px; border: 1px solid var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; background: #ffffff; flex-shrink: 0;">
                            <img src="${item.image || item.imageUrl || 'images/placeholder.png'}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div style="overflow: hidden;">
                            <div style="font-weight: 600; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${titleText}">${titleText}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Qty: ${item.qty || 1} &nbsp;&middot;&nbsp; ₹${priceNum.toLocaleString('en-IN')} each</div>
                        </div>
                    </div>
                    <div style="font-weight: 700; color: var(--text); font-size: 0.9rem;">
                        ₹${itemTotal.toLocaleString('en-IN')}
                    </div>
                </div>
            `;
        }).join('');
    } else if (summaryContainer) {
        summaryContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.9rem;">No items in cart.</div>`;
    }

    // Disable button if amount is invalid/cart empty
    if (totalAmount <= 0 || cart.length === 0) {
        showToast('⚠️ Your shopping cart is empty.');
        if (payBtn) {
            payBtn.disabled = true;
            payBtn.innerHTML = 'Cart is Empty';
        }
        return;
    }

    // 3. Razorpay Launch Event
    if (payBtn) {
        payBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Set loading state on button
            setButtonLoading(true);

            try {
                // Step 1: Create pending order in the backend database
                const formattedItems = cart.map(item => {
                    const priceNum = parseInt(String(item.price).replace(/[^\d]/g, '')) || 0;
                    return {
                        id: item.id,
                        title: item.name || item.title || 'Product Item',
                        price: priceNum,
                        qty: item.qty || 1,
                        image: item.imageUrl || item.image || 'images/placeholder.png'
                    };
                });

                const response = await fetch('http://localhost:5000/api/orders/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        items: formattedItems,
                        totalAmount: totalAmount,
                        deliveryAddress: addressText
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to initialize payment transaction.');
                }

                // Step 2: Initialize Razorpay Checkout Options
                const options = {
                    key: data.key_id,
                    amount: data.amount,
                    currency: data.currency,
                    name: 'E-Bazaar',
                    description: 'Secure Checkout Payment',
                    order_id: data.order_id,
                    prefill: {
                        name: user.name || '',
                        email: user.email || '',
                        contact: user.phone || ''
                    },
                    theme: {
                        color: '#A88C6D' // E-Bazaar Accent color token
                    },
                    handler: async function (response) {
                        // Payment succeeds on Razorpay - verify cryptographic signature in backend
                        showToast('🔄 Verifying signature... Please wait.');
                        await verifyPayment(response);
                    },
                    modal: {
                        ondismiss: function () {
                            showToast('❌ Payment cancelled or closed.');
                            setButtonLoading(false);
                        }
                    }
                };

                const rzp = new Razorpay(options);
                rzp.open();

            } catch (err) {
                console.error('[Payment Error]:', err.message);
                showToast(`❌ Error: ${err.message}`);
                setButtonLoading(false);
            }
        });
    }

    // 4. Verify Payment Signature
    async function verifyPayment(rzpResponse) {
        try {
            const walletUsed = parseInt(localStorage.getItem('wallet_applied')) || 0;

            const response = await fetch('http://localhost:5000/api/orders/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    razorpay_payment_id: rzpResponse.razorpay_payment_id,
                    razorpay_order_id: rzpResponse.razorpay_order_id,
                    razorpay_signature: rzpResponse.razorpay_signature,
                    walletUsed: walletUsed
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Payment signature verification failed.');
            }

            // Step 3: Success Pathway
            // Clear local cart
            localStorage.setItem('cart', '[]');
            localStorage.setItem('eb_cart_items', '[]');
            localStorage.setItem('eb-cart-items', '[]');
            localStorage.setItem('eb-cart', '0');
            localStorage.removeItem('checkout_total');
            localStorage.removeItem('wallet_applied');

            // Synchronize wallet balance local storage
            if (walletUsed > 0 && user && typeof user.walletBalance === 'number') {
                user.walletBalance = Math.max(0, user.walletBalance - walletUsed);
                localStorage.setItem('eb_user', JSON.stringify(user));
                localStorage.setItem('ebazaar_user', JSON.stringify(user));
            }

            // Trigger cart badge updates if global helper exists
            if (typeof syncCartBadge === 'function') syncCartBadge();

            // Toggle view panels
            const formBody = document.getElementById('form-body');
            const successBody = document.getElementById('success-body');
            const orderRefEl = document.getElementById('order-ref-display');

            if (formBody) formBody.style.display = 'none';
            if (successBody) successBody.style.display = 'block';
            if (orderRefEl && data.order) {
                orderRefEl.textContent = `Order ID: EB-${data.order.id} | Ref: ${data.order.razorpayOrderId}`;
            }

            showToast('🎉 Order placed successfully!');

        } catch (err) {
            console.error('[Verification Error]:', err.message);
            showToast(`❌ Verification Failed: ${err.message}`);
            setButtonLoading(false);
        }
    }

    // Helper to toggle button states
    function setButtonLoading(loading) {
        if (!payBtn) return;
        if (loading) {
            payBtn.disabled = true;
            payBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="32" />
                </svg>
                Processing Payment...
            `;
        } else {
            payBtn.disabled = false;
            payBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Pay Securely via Razorpay
            `;
        }
    }

    // Global style inclusion for spinner animation
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
});

// Standalone Toast Display Handler if script.js helper is unavailable
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
