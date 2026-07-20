const fs   = require('fs');
const path = require('path');

const AUTH_TAG    = '<script src="js/auth.js"></script>';
const SCRIPT_TAG  = '<script src="js/script.js"';

// All HTML pages that have the nav (acc-btn exists)
const files = [
  'index.html', 'category.html', 'brand-store.html', 'product-detail.html',
  'wishlist.html', 'orders.html', 'cart.html', 'account.html', 'auth.html',
];

let updated = 0;
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) { console.log(`SKIP (missing): ${file}`); return; }

  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('js/auth.js')) { console.log(`SKIP (exists): ${file}`); return; }

  // Insert BEFORE </body> to ensure it runs after script.js
  html = html.replace('</body>', `  ${AUTH_TAG}\n</body>`);
  fs.writeFileSync(filePath, html);
  console.log(`INJECTED auth.js: ${file}`);
  updated++;
});

// Patch auth.html: remove the old inline <script> block that does localStorage-only auth
// (We keep it for tab switching fallback, but strip the old form submit handlers)
const authPath = path.join(__dirname, 'auth.html');
let authHtml = fs.readFileSync(authPath, 'utf8');

const oldRegisterHandler = `    // Handle Register
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();`;
const oldLoginHandler = `    // Handle Login
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();`;

// Find the inline script block with old auth handlers and comment it out cleanly
const inlineScriptStart = authHtml.lastIndexOf('<script>');
const inlineScriptEnd   = authHtml.lastIndexOf('</script>');
if (inlineScriptStart !== -1 && inlineScriptEnd !== -1) {
  const inlineContent = authHtml.substring(inlineScriptStart, inlineScriptEnd + 9);
  // Only replace if it still has the old localStorage-based submit handlers
  if (inlineContent.includes('localStorage.setItem') && inlineContent.includes('form-register')) {
    const safeContent = inlineContent
      .replace(/\/\/ Handle Register[\s\S]*?(?=\/\/ Handle Login)/m, '// Register is now handled by js/auth.js\n\n    ')
      .replace(/\/\/ Handle Login[\s\S]*?(?=\}\);[\s\r\n]*<\/script>)/m, '// Login is now handled by js/auth.js\n  ');
    authHtml = authHtml.substring(0, inlineScriptStart) + safeContent + authHtml.substring(inlineScriptEnd + 9);
    fs.writeFileSync(authPath, authHtml);
    console.log('PATCHED: auth.html inline script (removed old localStorage handlers)');
  }
}

console.log(`\nDone. ${updated} files updated.`);
