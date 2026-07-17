import re

with open('Frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace body class/data and title
html = re.sub(r'<body.*?>', '<body data-page="auth">', html)
html = re.sub(r'<title.*?>.*?</title>', '<title id="page-title">Sign In / Register — E-Bazaar</title>', html)

# Define new auth UI
auth_ui = """<!-- ═══════════════════ MAIN ═══════════════════ -->
<main id="main-content" class="auth-main">
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-tabs">
        <button class="auth-tab active" id="tab-login">Login</button>
        <button class="auth-tab" id="tab-register">Create Account</button>
      </div>

      <!-- Form View A (Password Entry) -->
      <form class="auth-form active" id="form-login" novalidate>
        <div class="form-group">
          <label for="login-email">Email Address</label>
          <input type="email" id="login-email" placeholder="Enter your email" required/>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" placeholder="Enter your password" required/>
        </div>
        <div class="form-options">
          <a href="#" class="forgot-link">Forgot Password?</a>
        </div>
        <button type="submit" class="auth-btn">Sign In</button>
        <div class="auth-alt">
          <a href="#" id="link-otp" class="alt-link">Login via Secure OTP</a>
        </div>
      </form>

      <!-- Form View B (OTP Verification View) -->
      <form class="auth-form hidden" id="form-otp" novalidate>
        <h3 class="otp-title">Enter Verification Code</h3>
        <p class="otp-desc">We've sent a 6-digit code to your email.</p>
        <div class="otp-inputs">
          <input type="text" maxlength="1" class="otp-box" required/>
          <input type="text" maxlength="1" class="otp-box" required/>
          <input type="text" maxlength="1" class="otp-box" required/>
          <input type="text" maxlength="1" class="otp-box" required/>
          <input type="text" maxlength="1" class="otp-box" required/>
          <input type="text" maxlength="1" class="otp-box" required/>
        </div>
        <p class="otp-status">Resend OTP in <span id="otp-timer">00:59</span></p>
        <button type="submit" class="auth-btn">Verify & Proceed</button>
      </form>

      <!-- Form View C (Sign Up Portal) -->
      <form class="auth-form hidden" id="form-register" novalidate>
        <div class="form-group">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" placeholder="John Doe" required/>
        </div>
        <div class="form-group">
          <label for="reg-email">Email Address</label>
          <input type="email" id="reg-email" placeholder="john@example.com" required/>
        </div>
        <div class="form-group">
          <label for="reg-phone">Mobile Phone Number</label>
          <input type="tel" id="reg-phone" placeholder="+91 98765 43210" required/>
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input type="password" id="reg-password" placeholder="Create a strong password" required/>
        </div>
        <button type="submit" class="auth-btn">Register Account</button>
      </form>
      
      <!-- Form View D (Authenticated Logout state) -->
      <div class="auth-form hidden" id="form-profile">
        <h2 class="profile-welcome">Welcome Back, Aryan!</h2>
        <button class="auth-btn secondary" id="btn-logout">Logout / Switch Account</button>
      </div>
      
    </div>
  </div>
</main>
"""

# Replace main content
html = re.sub(r'<!-- ═══════════════════ MAIN ═══════════════════ -->.*?<footer', auth_ui + '<footer', html, flags=re.DOTALL)

# Add CSS link
html = html.replace('<link rel="stylesheet" href="css/styles.css"/>', '<link rel="stylesheet" href="css/styles.css"/>\n  <link rel="stylesheet" href="css/auth.css"/>')

with open('Frontend/auth.html', 'w', encoding='utf-8') as f:
    f.write(html)
