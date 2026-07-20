const fs = require('fs');
let script = fs.readFileSync('Frontend/js/script.js', 'utf8');

// 1. Rewrite `renderFilteredProducts` slicing and count logic
const startSlice = script.indexOf('    window.allFilteredProducts = filtered;');
const endSlice = script.indexOf('  window.loadMoreProducts = function() {');
if (startSlice === -1 || endSlice === -1) {
    console.error("Could not find start/end slices for replacing renderFilteredProducts logic.");
    process.exit(1);
}

const newLogic = `    window.allFilteredProducts = filtered;
    
    const itemsPerPage = 12;
    if (typeof window.currentPage === 'undefined') window.currentPage = 1;
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    if (window.currentPage > totalPages) window.currentPage = 1;
    
    const startIndex = (window.currentPage - 1) * itemsPerPage;
    const endIndex = window.currentPage * itemsPerPage;
    const visibleProducts = filtered.slice(startIndex, endIndex);
    
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
      grid.innerHTML = visibleProducts.length ? visibleProducts.map(buildCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No products found matching filters.</div>';
    }
    
    const countEl = document.getElementById('result-count');
    if (countEl) {
      const displayStart = visibleProducts.length ? startIndex + 1 : 0;
      const displayEnd = startIndex + visibleProducts.length;
      countEl.innerHTML = \`Showing <strong>\${displayStart} - \${displayEnd}</strong> of <strong>\${filtered.length}</strong> products\`;
    }
    
    renderPaginationControls(totalPages);
  }

  window.goToPage = function(page) {
    window.currentPage = page;
    renderFilteredProducts();
    // Scroll to top of grid slightly smoothly
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
       const y = grid.getBoundingClientRect().top + window.scrollY - 150;
       window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  function renderPaginationControls(totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    
    // Start & Prev
    html += \`<button class="page-btn" \${window.currentPage === 1 ? 'disabled' : ''} onclick="goToPage(1)">Start</button>\`;
    html += \`<button class="page-btn" \${window.currentPage === 1 ? 'disabled' : ''} onclick="goToPage(\${window.currentPage - 1})">Prev</button>\`;
    
    // Page Numbers (Show window of +/- 2)
    let startPage = Math.max(1, window.currentPage - 2);
    let endPage = Math.min(totalPages, window.currentPage + 2);
    
    // Adjust window if near edges
    if (endPage - startPage < 4) {
      if (startPage === 1) endPage = Math.min(totalPages, startPage + 4);
      else if (endPage === totalPages) startPage = Math.max(1, endPage - 4);
    }
    
    if (startPage > 1) {
       html += \`<span style="padding: 0 4px; color: var(--text-muted)">...</span>\`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
      html += \`<button class="page-btn \${window.currentPage === i ? 'active' : ''}" onclick="goToPage(\${i})">\${i}</button>\`;
    }
    
    if (endPage < totalPages) {
       html += \`<span style="padding: 0 4px; color: var(--text-muted)">...</span>\`;
    }

    // Next & End
    html += \`<button class="page-btn" \${window.currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(\${window.currentPage + 1})">Next</button>\`;
    html += \`<button class="page-btn" \${window.currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(\${totalPages})">End</button>\`;

    container.innerHTML = html;
  }

`;

// The endSlice stops at `  window.loadMoreProducts = function() {`. We want to delete `loadMoreProducts` entirely.
const loadMoreEnd = script.indexOf('};', endSlice) + 2; 

script = script.substring(0, startSlice) + newLogic + script.substring(loadMoreEnd);

// Now, we need to reset `window.currentPage = 1;` when filters are changed.
// Instead of replacing every single listener, we can just intercept `renderFilteredProducts` calls globally?
// No, a simpler way is to redefine a wrapper if needed, or simply let `renderFilteredProducts` check if filters changed by comparing previous filters?
// Actually, `window.currentPage = 1` is naturally enforced if `window.currentPage > totalPages`. 
// However, if we are on page 5 and apply a filter that has 6 pages, it keeps us on page 5. We should reset it explicitly.
// Let's replace `renderFilteredProducts()` with `{ window.currentPage = 1; renderFilteredProducts(); }` in the listeners?
// Actually, in `script.js`, we can do string replaces:
script = script.replace(/renderFilteredProducts\(\);/g, "window.currentPage = 1; renderFilteredProducts();");
// But wait, my `goToPage` and `renderFilteredProducts` itself might be affected!
// Let's manually replace the listener bindings.
script = script.replace(/addEventListener\('change', renderFilteredProducts\)/g, "addEventListener('change', () => { window.currentPage = 1; renderFilteredProducts(); })");

fs.writeFileSync('Frontend/js/script.js', script);
console.log('script.js updated with pagination logic');
