import re

with open('auth.html', 'r', encoding='utf-8') as f:
    content = f.read()

head_header = content.split('<!-- ═══════════════════ MAIN ═══════════════════ -->')[0]
head_header = head_header.replace('<title id="page-title">Sign In / Register — E-Bazaar</title>', '<title id="page-title">My Account — E-Bazaar</title>')

footer_split = content.split('</main>')
footer = '</main>' + footer_split[1]

main_content = """<!-- ═══════════════════ MAIN ═══════════════════ -->
<style>
  .acc-container { max-width: var(--max-w); margin: 0 auto; padding: 40px var(--side-pad); display: grid; grid-template-columns: 280px 1fr; gap: 40px; align-items: start; min-height: 60vh; }
  .acc-sidebar { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; position: sticky; top: 100px; }
  .acc-user-card { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
  .acc-avatar-wrap { position: relative; width: 100px; height: 100px; margin-bottom: 16px; border-radius: 50%; border: 4px solid var(--bg); overflow: hidden; background: #e3e8ee; display: flex; align-items: center; justify-content: center; }
  .acc-avatar { width: 100%; height: 100%; object-fit: cover; }
  .acc-avatar-edit { position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity var(--ease); cursor: pointer; font-size: 12px; font-weight: 600; gap: 4px; }
  .acc-avatar-wrap:hover .acc-avatar-edit { opacity: 1; }
  .acc-name { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .acc-email { font-size: 14px; color: var(--text-muted); }
  .acc-nav { display: flex; flex-direction: column; gap: 4px; }
  .acc-nav-link { padding: 12px 16px; font-size: 15px; font-weight: 600; color: var(--text-sub); border-radius: var(--r-sm); cursor: pointer; transition: background var(--ease), color var(--ease); display: flex; align-items: center; gap: 12px; }
  .acc-nav-link:hover { background: var(--bg-alt); color: var(--text); }
  .acc-nav-link.active { background: var(--accent); color: white; }
  
  .acc-panel { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 32px; display: none; }
  .acc-panel.active { display: block; animation: fadeUp 0.3s ease; }
  
  .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
  .panel-title { font-size: 24px; font-weight: 800; color: var(--text); }
  
  .acc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text); }
  .form-group input { width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--r-sm); font-size: 15px; transition: border-color var(--ease); }
  .form-group input:focus { border-color: var(--accent); outline: none; }
  .form-group input[disabled] { background: var(--bg-alt); color: var(--text-muted); cursor: not-allowed; }
  
  .btn-primary { background: var(--text); color: var(--bg); border: none; padding: 12px 24px; border-radius: var(--r-sm); font-size: 15px; font-weight: 600; cursor: pointer; transition: background var(--ease); }
  .btn-primary:hover { background: var(--accent); }
  .btn-danger { background: #fee2e2; color: #dc2626; border: none; padding: 12px 24px; border-radius: var(--r-sm); font-size: 15px; font-weight: 600; cursor: pointer; transition: background var(--ease); }
  .btn-danger:hover { background: #fca5a5; }
  
  .address-card { border: 1px solid var(--border); border-radius: var(--r-sm); padding: 16px; margin-bottom: 16px; position: relative; }
  .addr-type { font-weight: 700; font-size: 14px; margin-bottom: 8px; display: inline-block; background: var(--bg-alt); padding: 4px 10px; border-radius: 20px; }
  .addr-text { font-size: 14px; color: var(--text-sub); line-height: 1.5; margin-bottom: 16px; }
  .addr-actions { display: flex; gap: 12px; }
  .addr-btn { background: none; border: 1px solid var(--border); padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: var(--r-sm); transition: all var(--ease); }
  .addr-btn:hover { background: var(--bg-alt); }
  
  @media(max-width: 960px) {
    .acc-container { grid-template-columns: 1fr; }
    .acc-form-grid { grid-template-columns: 1fr; }
    .acc-sidebar { position: static; }
  }
</style>

<main id="main-content">
  <div class="acc-container">
    
    <!-- Sidebar -->
    <aside class="acc-sidebar">
      <div class="acc-user-card">
        <input type="file" id="avatar-upload" accept="image/*" style="display:none;" />
        <div class="acc-avatar-wrap" onclick="document.getElementById('avatar-upload').click()">
          <img src="" alt="Avatar" class="acc-avatar" id="sidebar-avatar" style="display:none;" />
          <svg id="sidebar-avatar-placeholder" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <div class="acc-avatar-edit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Upload
          </div>
        </div>
        <div class="acc-name" id="sidebar-name">User Name</div>
        <div class="acc-email" id="sidebar-email">user@email.com</div>
      </div>
      
      <nav class="acc-nav">
        <div class="acc-nav-link active" onclick="switchPanel('profile', this)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profile Details
        </div>
        <div class="acc-nav-link" onclick="switchPanel('addresses', this)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Addresses
        </div>
        <div class="acc-nav-link" onclick="window.location.href='orders.html'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
          My Orders
        </div>
        <div class="acc-nav-link" onclick="logout()" style="color:var(--danger); margin-top:24px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </div>
      </nav>
    </aside>
    
    <!-- Main Content Panels -->
    <div class="acc-content">
      
      <!-- Panel: Profile -->
      <div class="acc-panel active" id="panel-profile">
        <div class="panel-header">
          <h2 class="panel-title">Profile Details</h2>
        </div>
        <form id="profile-form">
          <div class="acc-form-grid" style="margin-bottom: 24px;">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="prof-name" required />
            </div>
            <div class="form-group">
              <label>Email Address (Cannot be changed)</label>
              <input type="email" id="prof-email" disabled />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="prof-phone" />
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button type="submit" class="btn-primary">Save Changes</button>
            <button type="button" class="btn-danger" onclick="deleteAccount()">Delete Account</button>
          </div>
        </form>
      </div>
      
      <!-- Panel: Addresses -->
      <div class="acc-panel" id="panel-addresses">
        <div class="panel-header">
          <h2 class="panel-title">Saved Addresses</h2>
          <button class="btn-primary" onclick="AddressModal.open()">+ Add New Address</button>
        </div>
        
        <div id="acc-address-list">
          <!-- Rendered via JS -->
        </div>
      </div>
      
    </div>
    
  </div>
</main>
<script>
  let currentUser = JSON.parse(localStorage.getItem('eb_user'));
  
  if(!currentUser) {
    window.location.href = 'auth.html';
  }

  function initAccount() {
    // Populate Sidebar
    document.getElementById('sidebar-name').textContent = currentUser.name;
    document.getElementById('sidebar-email').textContent = currentUser.email;
    if(currentUser.profilePic) {
      document.getElementById('sidebar-avatar').src = currentUser.profilePic;
      document.getElementById('sidebar-avatar').style.display = 'block';
      document.getElementById('sidebar-avatar-placeholder').style.display = 'none';
    }
    
    // Populate Profile Form
    document.getElementById('prof-name').value = currentUser.name;
    document.getElementById('prof-email').value = currentUser.email;
    document.getElementById('prof-phone').value = currentUser.phone || '';
    
    // Render Addresses
    renderAddresses();
  }

  function renderAddresses() {
    const list = document.getElementById('acc-address-list');
    const addrs = currentUser.addresses || [];
    
    if(addrs.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);">You have no saved addresses.</p>';
      return;
    }
    
    list.innerHTML = addrs.map((a, idx) => `
      <div class="address-card">
        <div class="addr-type">${a.type}</div>
        <div class="addr-text">${a.line1}<br>${a.line2}</div>
        <div class="addr-actions">
          <button class="addr-btn" onclick="deleteAddress(${idx})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  function switchPanel(panelId, tabEl) {
    document.querySelectorAll('.acc-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + panelId).classList.add('active');
    
    document.querySelectorAll('.acc-nav-link').forEach(l => l.classList.remove('active'));
    tabEl.classList.add('active');
  }

  // Profile update
  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser.name = document.getElementById('prof-name').value;
    currentUser.phone = document.getElementById('prof-phone').value;
    localStorage.setItem('eb_user', JSON.stringify(currentUser));
    initAccount();
    if(typeof showToast === 'function') showToast('✅ Profile updated successfully');
  });

  // Avatar upload with Canvas compression
  document.getElementById('avatar-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Compress slightly
        currentUser.profilePic = dataUrl;
        localStorage.setItem('eb_user', JSON.stringify(currentUser));
        initAccount();
        if(typeof showToast === 'function') showToast('📸 Profile picture updated');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Address logic overrides
  function deleteAddress(idx) {
    if(confirm('Delete this address?')) {
      currentUser.addresses.splice(idx, 1);
      localStorage.setItem('eb_user', JSON.stringify(currentUser));
      renderAddresses();
      if(typeof showToast === 'function') showToast('🗑️ Address deleted');
    }
  }

  function logout() {
    localStorage.removeItem('eb_user');
    window.location.href = 'auth.html';
  }
  
  function deleteAccount() {
    if(confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      localStorage.removeItem('eb_user');
      localStorage.removeItem('eb_cart_items');
      localStorage.removeItem('eb_wishlist');
      alert('Account deleted.');
      window.location.href = 'index.html';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAccount();
    
    // Override AddressModal's onSave if it exists globally to update UI here
    setTimeout(() => {
      if(window.AddressModal) {
        const oldSave = AddressModal.onSave;
        AddressModal.onSave = function(addr) {
          oldSave.call(AddressModal, addr);
          currentUser = JSON.parse(localStorage.getItem('eb_user'));
          renderAddresses();
        };
      }
    }, 500);
  });
</script>
"""

final_html = head_header + main_content + footer
with open('account.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Created account.html successfully")
