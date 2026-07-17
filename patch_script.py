import re

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

if 'initAuth();' not in js:
    js = js.replace('});', "  if(document.body.dataset.page === 'auth') initAuth();\n});")

auth_js = """
function initAuth() {
  const tabLogin = document.getElementById('tab-login');
  const tabReg = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formReg = document.getElementById('form-register');
  const formOtp = document.getElementById('form-otp');
  const linkOtp = document.getElementById('link-otp');

  if (tabLogin && tabReg && formLogin && formReg) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabReg.classList.remove('active');
      formLogin.classList.remove('hidden');
      formReg.classList.add('hidden');
      if(formOtp) formOtp.classList.add('hidden');
    });
    tabReg.addEventListener('click', () => {
      tabReg.classList.add('active');
      tabLogin.classList.remove('active');
      formReg.classList.remove('hidden');
      formLogin.classList.add('hidden');
      if(formOtp) formOtp.classList.add('hidden');
    });
  }

  if (linkOtp && formOtp) {
    linkOtp.addEventListener('click', (e) => {
      e.preventDefault();
      formLogin.classList.add('hidden');
      formOtp.classList.remove('hidden');
      startOtpTicker();
    });
  }

  // Numeric Focus Jump
  const otpBoxes = document.querySelectorAll('.otp-box');
  otpBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      if (box.value.length === 1 && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && box.value.length === 0 && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });
  });
}

function startOtpTicker() {
  const ticker = document.getElementById('otp-timer');
  if (!ticker) return;
  let time = 59;
  ticker.textContent = '00:59';
  const timer = setInterval(() => {
    time--;
    const sec = String(time % 60).padStart(2, '0');
    ticker.textContent = `00:${sec}`;
    if (time <= 0) clearInterval(timer);
  }, 1000);
}

// Active Link Freeze Indicator
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.toLowerCase().includes('auth.html')) {
    const accNav = document.getElementById('nav-account');
    if (accNav) accNav.classList.add('active');
  }
});
"""

if 'function initAuth' not in js:
    js += auth_js
else:
    js = re.sub(r'function initAuth\(\) \{.*?\}', auth_js, js, flags=re.DOTALL)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
