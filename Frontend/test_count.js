const fs = require('fs');
const script = fs.readFileSync('Frontend/js/script.js', 'utf8');
const count = (script.match(/"id":/g) || []).length;
console.log('Product count in script.js:', count);
