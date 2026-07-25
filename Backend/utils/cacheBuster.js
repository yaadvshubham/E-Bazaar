const fs = require('fs');
const path = require('path');

/**
 * Cache Buster Utility for E-Bazaar
 * Scans all HTML files in Frontend directory and appends a dynamic version query parameter (?v=timestamp)
 * to all local CSS and JS asset tags.
 */
function cacheBustHtmlFiles(customVersion) {
  const versionTag = customVersion || Date.now();
  
  // Resolve Frontend directory path
  const candidatePaths = [
    path.resolve(__dirname, '../../Frontend'),
    path.resolve(__dirname, '../Frontend'),
    path.resolve(process.cwd(), 'Frontend'),
    path.resolve(process.cwd())
  ];

  let frontendDir = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'index.html'))) {
      frontendDir = p;
      break;
    }
  }

  if (!frontendDir) {
    console.log('[CacheBuster] Skipping: Frontend directory containing index.html not found.');
    return;
  }

  const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));
  let updatedCount = 0;

  // Regex patterns to match local CSS and JS assets
  // Matches: href="css/styles.css", href="css/orders.css?v=123", src="js/script.js", src="sw.js"
  const cssRegex = /(href=["'])((?:css\/|\.\/css\/|(?:\.\.\/)+css\/)[\w-]+\.css)(?:\?v=[^"']*)?(["'])/gi;
  const jsRegex = /(src=["'])((?:js\/|\.\/js\/|(?:\.\.\/)+js\/|sw\.js)[\w-]+\.js)(?:\?v=[^"']*)?(["'])/gi;

  htmlFiles.forEach(file => {
    const filePath = path.join(frontendDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const newContent = content
      .replace(cssRegex, (match, p1, p2, p3) => {
        modified = true;
        return `${p1}${p2}?v=${versionTag}${p3}`;
      })
      .replace(jsRegex, (match, p1, p2, p3) => {
        modified = true;
        return `${p1}${p2}?v=${versionTag}${p3}`;
      });

    if (modified && newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updatedCount++;
    }
  });

  console.log(`[CacheBuster] Processed ${htmlFiles.length} HTML files in "${frontendDir}". Updated ${updatedCount} files with version tag: ?v=${versionTag}`);
}

module.exports = cacheBustHtmlFiles;

if (require.main === module) {
  cacheBustHtmlFiles();
}
