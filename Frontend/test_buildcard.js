const fs = require('fs');
let script = fs.readFileSync('Frontend/js/script.js', 'utf8');
const startIdx = script.indexOf('const MASTER_PRODUCTS = [');
let endIdx = script.indexOf('];\n', startIdx);
if (endIdx === -1) endIdx = script.indexOf('];\r\n', startIdx);
let arrStr = script.substring(startIdx + 24, endIdx + 1);
let arr = eval('(' + arrStr + ')'); 

for (let p of arr) {
  try {
     const pStr = encodeURIComponent(JSON.stringify(p)).replace(/'/g, "%27");
     const bCls = { new:'b-new', sale:'b-sale', hot:'b-hot' }[p.badge] || '';
     const bLbl = { new:'New', sale:'Sale', hot:'🔥 Hot' }[p.badge] || '';
     const isWished = false;
     const stroke = isWished ? '#E03E3E' : '#999';
     const wishCls = isWished ? 'cat-wish-btn wished' : 'cat-wish-btn';
     const title = p.title ? p.title.replace(/"/g, '&quot;') : '';
     const title2 = p.title ? p.title.replace(/'/g, "\\'") : '';
     const price = p.price ? p.price.toLocaleString('en-IN') : '';
     const orig = p.originalPrice ? p.originalPrice.toLocaleString('en-IN') : '';
  } catch(e) {
     console.log('Error on product:', p.id, e.message);
  }
}
