const fs = require('fs');
let html = fs.readFileSync('Frontend/category.html', 'utf8');

// Replace load-more-wrap with pagination-wrap
html = html.replace(/<div class="load-more-wrap">[\s\S]*?<\/div>/, `<div class="pagination-wrap" id="pagination-container" style="display:flex;justify-content:center;align-items:center;gap:8px;padding:40px 0;flex-wrap:wrap;"></div>`);

// Add CSS if not present
if (!html.includes('.page-btn')) {
  const css = `
    .page-btn {
      padding: 8px 12px;
      min-width: 40px;
      border: 1px solid var(--border);
      background: var(--bg-white);
      color: var(--text);
      cursor: pointer;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .page-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
`;
  html = html.replace('</style>', css + '</style>');
}

fs.writeFileSync('Frontend/category.html', html);
console.log('category.html updated');
