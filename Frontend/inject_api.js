const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'category.html',
  'brand-store.html',
  'product-detail.html',
  'wishlist.html',
];

const scriptTag = '<script src="js/api.js" defer></script>';
const anchorTag = '<script src="js/script.js"';

let updated = 0;
let skipped = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${file}`);
    skipped++;
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('js/api.js')) {
    console.log(`SKIP (already injected): ${file}`);
    skipped++;
    return;
  }
  // Inject api.js AFTER script.js so it can access functions defined in script.js
  if (html.includes(anchorTag)) {
    // Find the line with script.js and insert api.js right after the closing </script> tag of that line
    const scriptJsEndIdx = html.indexOf('>', html.indexOf(anchorTag)) + 1;
    // Find the closing </script> for the script.js tag
    const closeScriptIdx = html.indexOf('</script>', html.indexOf(anchorTag));
    let insertAfter;
    if (closeScriptIdx !== -1 && closeScriptIdx < html.indexOf(anchorTag) + 300) {
      insertAfter = closeScriptIdx + 9; // after </script>
    } else {
      // self-closing or src-only: insert after the > of the tag
      insertAfter = scriptJsEndIdx;
    }
    html = html.slice(0, insertAfter) + '\n  ' + scriptTag + html.slice(insertAfter);
    fs.writeFileSync(filePath, html);
    console.log(`INJECTED api.js: ${file}`);
    updated++;
  } else {
    // Fallback: inject before </body>
    html = html.replace('</body>', `  ${scriptTag}\n</body>`);
    fs.writeFileSync(filePath, html);
    console.log(`INJECTED api.js (before </body>): ${file}`);
    updated++;
  }
});

console.log(`\nDone. ${updated} files updated, ${skipped} skipped.`);
