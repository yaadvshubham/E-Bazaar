/* ═══════════════════════════════════════════════════════════════════════
   E-BAZAAR — auth.js
   Full-Stack Authentication Engine
   Connects frontend forms to /api/auth/register & /api/auth/login
   ═══════════════════════════════════════════════════════════════════════ */

const AUTH_API = 'http://localhost:5000/api/auth';

/* ─── Token & Session Helpers ────────────────────────────────────────────── */
const AuthSession = {
  save(token, user) {
    localStorage.setItem('ebazaar_token', token);
    localStorage.setItem('ebazaar_user',  JSON.stringify(user));
    
    // Load cart and wishlist from user data returned by backend
    if (user.cart) {
      localStorage.setItem('eb_cart_items', JSON.stringify(user.cart));
      localStorage.setItem('cart', JSON.stringify(user.cart));
      if (window.normalizeProduct) {
        window.ebCart = user.cart.map(window.normalizeProduct);
        window.cart = window.ebCart;
      }
    }
    if (user.wishlist) {
      localStorage.setItem('eb_wishlist', JSON.stringify(user.wishlist));
      if (window.normalizeProduct) {
        window.ebWishlist = user.wishlist.map(window.normalizeProduct);
        window.wishlist = window.ebWishlist;
      }
    }
    if (user.bankAccounts) {
      localStorage.setItem('eb_bank_accounts', JSON.stringify(user.bankAccounts));
    }

    // Also write legacy eb_user key so existing account.html / nav code works
    localStorage.setItem('eb_user', JSON.stringify({
      name:     user.name,
      email:    user.email,
      phone:    user.phone || '',
      addresses: user.addresses || [],
      profilePic: user.profilePic || null,
      walletBalance: typeof user.walletBalance === 'number' ? user.walletBalance : 150.00,
      withdrawableBalance: typeof user.withdrawableBalance === 'number' ? user.withdrawableBalance : 0.00,
      bankAccounts: user.bankAccounts || []
    }));

    if (typeof syncCartBadge === 'function') syncCartBadge();
    if (typeof syncWishlistBadge === 'function') syncWishlistBadge();
  },
  clear() {
    ['ebazaar_token', 'ebazaar_user', 'eb_user', 'eb_cart_items', 'cart', 'eb_wishlist', 'eb_bank_accounts', 'checkout_total', 'wallet_applied'].forEach(k => localStorage.removeItem(k));
    window.ebCart = [];
    window.ebWishlist = [];
    window.cart = [];
    window.wishlist = [];
    if (typeof syncCartBadge === 'function') syncCartBadge();
    if (typeof syncWishlistBadge === 'function') syncWishlistBadge();
  },
  getUser() {
    try {
      const u = localStorage.getItem('ebazaar_user') || localStorage.getItem('eb_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  },
  getToken() {
    return localStorage.getItem('ebazaar_token') || (localStorage.getItem('eb_user') ? 'ebazaar_demo_token' : null);
  },
  isLoggedIn() {
    return !!(localStorage.getItem('ebazaar_token') || localStorage.getItem('eb_user'));
  },
};

// Keep ebazaar_user and eb_user keys synchronized in localStorage
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.apply(this, arguments);
  if (key === 'eb_user') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        originalSetItem.call(this, 'ebazaar_user', value);
      }
    } catch (e) {}
  } else if (key === 'ebazaar_user') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        originalSetItem.call(this, 'eb_user', value);
      }
    } catch (e) {}
  }
};

const originalRemoveItem = localStorage.removeItem;
localStorage.removeItem = function(key) {
  originalRemoveItem.apply(this, arguments);
  if (key === 'eb_user') {
    originalRemoveItem.call(this, 'ebazaar_user');
  } else if (key === 'ebazaar_user') {
    originalRemoveItem.call(this, 'eb_user');
  }
};

/* ─── UI Helpers ─────────────────────────────────────────────────────────── */
function showAuthError(msg, formId) {
  let el = document.getElementById(`${formId}-error`);
  if (!el) {
    el = document.createElement('p');
    el.id = `${formId}-error`;
    el.style.cssText = 'color:#c0392b;font-size:13px;margin:8px 0 0;padding:10px 14px;background:#fef0f0;border-radius:8px;border-left:3px solid #c0392b;';
    const form = document.getElementById(formId);
    if (form) form.insertBefore(el, form.querySelector('button[type="submit"]'));
  }
  el.textContent = msg;
  el.style.display = 'block';
}

function clearAuthError(formId) {
  const el = document.getElementById(`${formId}-error`);
  if (el) el.style.display = 'none';
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.origText = btn.textContent;
    btn.textContent = 'Please wait…';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn.dataset.origText || 'Submit';
    btn.disabled = false;
    btn.style.opacity = '';
  }
}

/* ─── Register ───────────────────────────────────────────────────────────── */
async function handleRegister(e) {
  e.preventDefault();
  clearAuthError('form-register');

  const name     = document.getElementById('reg-name')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const phone    = document.getElementById('reg-phone')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const btn      = document.querySelector('#form-register button[type="submit"]');

  if (!name || !email || !password) {
    showAuthError('Please fill in all required fields.', 'form-register');
    return;
  }
  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters.', 'form-register');
    return;
  }

  setButtonLoading(btn, true);

  try {
    const res  = await fetch(`${AUTH_API}/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAuthError(data.error || 'Registration failed. Please try again.', 'form-register');
      return;
    }

    // Save session
    AuthSession.save(data.token, data.user);

    if (typeof showToast === 'function') showToast('✅ Account created! Welcome to E-Bazaar.');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);

  } catch (err) {
    console.error('[Auth] Register network error:', err);
    showAuthError('Could not reach the server. Please check your connection.', 'form-register');
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ─── Login ──────────────────────────────────────────────────────────────── */
async function handleLogin(e) {
  e.preventDefault();
  clearAuthError('form-login');

  const email    = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const btn      = document.querySelector('#form-login button[type="submit"]');

  if (!email || !password) {
    showAuthError('Please enter your email and password.', 'form-login');
    return;
  }

  setButtonLoading(btn, true);

  try {
    const res  = await fetch(`${AUTH_API}/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAuthError(data.error || 'Invalid email or password.', 'form-login');
      return;
    }

    // Store token + user
    AuthSession.save(data.token, data.user);

    if (typeof showToast === 'function') showToast(`✅ Welcome back, ${data.user.name}!`);
    setTimeout(() => { window.location.href = 'index.html'; }, 800);

  } catch (err) {
    console.error('[Auth] Login network error:', err);
    // Graceful offline fallback — try localStorage credential check
    const saved = JSON.parse(localStorage.getItem('eb_user') || 'null');
    if (saved && saved.email === email && saved.password === password) {
      if (typeof showToast === 'function') showToast(`✅ Welcome back, ${saved.name}!`);
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } else {
      showAuthError('Could not reach the server. Please check your connection.', 'form-login');
    }
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ─── Logout ─────────────────────────────────────────────────────────────── */
function handleLogout() {
  AuthSession.clear();
  if (typeof showToast === 'function') showToast('👋 You have been logged out.');
  setTimeout(() => { window.location.href = 'index.html'; }, 600);
}
window.handleLogout = handleLogout;

/* ─── Update Nav Account Button ──────────────────────────────────────────── */
function updateNavAuthState() {
  const user    = AuthSession.getUser();
  const accBtn  = document.getElementById('acc-btn');
  if (!accBtn) return;

  if (user) {
    const firstName = user.name.split(' ')[0];
    // Show first name instead of "Account"
    const span = accBtn.querySelector('span');
    if (span) span.textContent = firstName;
    accBtn.setAttribute('href', 'account.html');
    accBtn.setAttribute('aria-label', `Account: ${user.name}`);
    accBtn.style.color = 'var(--primary, #A88C6D)';
    accBtn.style.fontWeight = '600';
  } else {
    const span = accBtn.querySelector('span');
    if (span) span.textContent = 'Account';
    accBtn.setAttribute('href', 'auth.html');
    accBtn.setAttribute('aria-label', 'My Account');
    accBtn.style.color = '';
    accBtn.style.fontWeight = '';
  }
}

/* ─── Auth Page Init ─────────────────────────────────────────────────────── */
function initAuthPage() {
  // If already logged in, go to homepage
  if (AuthSession.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const tabLogin    = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin   = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formProfile  = document.getElementById('form-profile');
  const btnLogout    = document.getElementById('btn-logout');

  // Tab switching
  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister?.classList.remove('active');
    formLogin?.classList.remove('hidden');
    formLogin?.classList.add('active');
    formRegister?.classList.remove('active');
    formRegister?.classList.add('hidden');
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin?.classList.remove('active');
    formRegister?.classList.remove('hidden');
    formRegister?.classList.add('active');
    formLogin?.classList.remove('active');
    formLogin?.classList.add('hidden');
  });

  // Wire forms to API handlers
  formLogin?.addEventListener('submit', handleLogin);
  formRegister?.addEventListener('submit', handleRegister);
  btnLogout?.addEventListener('click', handleLogout);

  // Profile view for logged-in user
  const user = AuthSession.getUser();
  if (user && formProfile) {
    // Show profile state
    [formLogin, formRegister].forEach(f => { if (f) { f.classList.remove('active'); f.classList.add('hidden'); }});
    [tabLogin, tabRegister].forEach(t => t?.classList.remove('active'));
    formProfile.classList.remove('hidden');
    formProfile.classList.add('active');
    const welcome = formProfile.querySelector('.profile-welcome');
    if (welcome) welcome.textContent = `Welcome back, ${user.name}!`;
  }
}

/* ─── Bootstrap ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuthState();

  if (document.body.dataset.page === 'auth') {
    // Replace the existing inline script's logic entirely
    initAuthPage();
  }
});

// Export for global access
window.AuthSession = AuthSession;
