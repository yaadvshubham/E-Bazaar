const fs = require('fs'); 
const lines = fs.readFileSync('Frontend/js/script.js', 'utf8').split('\n'); 
lines.forEach((line, i) => { 
  if (line.includes('DOMContentLoaded') || line.includes('load') || line.includes('document.body.dataset.page')) {
    console.log((i+1) + ': ' + line); 
  }
});
