import os

# 1. Update category.css with list-view styles
css_update = '''
/* List view styles */
.cat-grid.list-view {
  grid-template-columns: 1fr !important;
}
.cat-grid.list-view .cat-card {
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
.cat-grid.list-view .cat-img-box {
  width: 200px;
  margin-bottom: 0;
  flex-shrink: 0;
}
.cat-grid.list-view .cat-badge-wrap {
  position: absolute;
}
.cat-grid.list-view .cat-add-btn {
  width: auto;
  min-width: 150px;
}
'''
with open('css/category.css', 'a', encoding='utf-8') as f:
    f.write(css_update)


# 2. Update script.js
with open('js/script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add highlighting for navigation in initDynamicCategory
nav_fix = '''
  // Highlight active category in header
  document.querySelectorAll('.mega-item > a').forEach(a => {
    if (a.getAttribute('href') && a.getAttribute('href').includes('cat=' + catId)) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
'''
if 'Highlight active category in header' not in js_content:
    js_content = js_content.replace("const categoryData = CATEGORY_MAP[catId];", "const categoryData = CATEGORY_MAP[catId];\n" + nav_fix)


# Add global tracking for products
if 'window.currentCategoryProducts =' not in js_content:
    js_content = js_content.replace("const products = generateMockProductsForCategory(catId);", "window.currentCategoryProducts = generateMockProductsForCategory(catId);\n    const products = window.currentCategoryProducts;")

# Replace initCategoryFilters completely to implement filtering
old_init_filters_start = js_content.find('function initCategoryFilters() {')
old_init_filters_end = js_content.find('function updateFilterTags() {', old_init_filters_start)

new_init_filters = '''function initCategoryFilters() {
  initDynamicCategory();

  // Filter accordions
  document.querySelectorAll('.f-section-head').forEach(head => {
    head.addEventListener('click', () => {
      head.closest('.f-section').classList.toggle('open');
    });
  });

  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minDisplay = document.getElementById('price-min-display');
  const maxDisplay = document.getElementById('price-max-display');
  const fill = document.getElementById('range-fill');

  function updatePriceUI() {
    if (!minInput || !maxInput) return;
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    const total = parseInt(minInput.max);
    if (minDisplay) minDisplay.textContent = `₹${min.toLocaleString('en-IN')}`;
    if (maxDisplay) maxDisplay.textContent = `₹${max.toLocaleString('en-IN')}`;
    if (fill) {
      fill.style.left  = (min / total * 100) + '%';
      fill.style.width = ((max - min) / total * 100) + '%';
    }
  }

  function renderFilteredProducts() {
    if (!window.currentCategoryProducts) return;
    let filtered = [...window.currentCategoryProducts];
    
    // Brand filter
    const checkedBrands = [...document.querySelectorAll('.brand-check input:checked')].map(cb => cb.value);
    if (checkedBrands.length > 0) {
      filtered = filtered.filter(p => checkedBrands.includes(p.brand));
    }
    
    // Price filter
    if (minInput && maxInput) {
      const minPrice = parseInt(minInput.value || 0);
      const maxPrice = parseInt(maxInput.value || 100000);
      filtered = filtered.filter(p => {
        const priceNum = parseInt(p.price.replace(/[^\\d]/g, ''));
        return priceNum >= minPrice && priceNum <= maxPrice;
      });
    }

    // Sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === 'price-low') {
        filtered.sort((a, b) => parseInt(a.price.replace(/[^\\d]/g, '')) - parseInt(b.price.replace(/[^\\d]/g, '')));
      } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => parseInt(b.price.replace(/[^\\d]/g, '')) - parseInt(a.price.replace(/[^\\d]/g, '')));
      } else if (sortVal === 'newest') {
        filtered.sort((a, b) => (b.badge === 'new' ? -1 : (a.badge === 'new' ? 1 : 0)));
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }
    }

    // Render
    const grid = document.getElementById('main-cat-grid');
    if (grid) {
      grid.innerHTML = filtered.length ? filtered.map(buildCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No products found matching filters.</div>';
    }
    
    const countEl = document.getElementById('result-count');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filtered.length} products</strong>`;
    }
  }

  if (minInput) { minInput.addEventListener('input', () => { if (parseInt(minInput.value) >= parseInt(maxInput.value)) minInput.value = parseInt(maxInput.value) - 500; updatePriceUI(); renderFilteredProducts(); }); }
  if (maxInput) { maxInput.addEventListener('input', () => { if (parseInt(maxInput.value) <= parseInt(minInput.value)) maxInput.value = parseInt(minInput.value) + 500; updatePriceUI(); renderFilteredProducts(); }); }
  updatePriceUI();

  // Brand checkboxes
  document.getElementById('filter-brand-list')?.addEventListener('change', () => {
    updateFilterTags();
    renderFilteredProducts();
  });

  document.querySelector('.sort-select')?.addEventListener('change', renderFilteredProducts);

  // Clear filters
  const clearBtn = document.querySelector('.filter-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.brand-check input').forEach(cb => cb.checked = false);
    if (minInput) { minInput.value = minInput.min; }
    if (maxInput) { maxInput.value = maxInput.max; }
    updatePriceUI();
    updateFilterTags();
    renderFilteredProducts();
    showToast('🔄 Filters cleared');
  });

  // Filter tag removal
  document.addEventListener('click', e => {
    if (e.target.closest('.filter-tag-rm')) {
      const brand = e.target.closest('.filter-tag')?.dataset.brand;
      const cb = document.querySelector(`.brand-check input[value="${brand}"]`);
      if (cb) cb.checked = false;
      e.target.closest('.filter-tag')?.remove();
      renderFilteredProducts();
    }
  });
  
  // Grid / List toggling
  const viewGridBtn = document.getElementById('view-grid');
  const viewListBtn = document.getElementById('view-list');
  const mainGrid = document.getElementById('main-cat-grid');
  if (viewGridBtn && viewListBtn && mainGrid) {
    viewGridBtn.addEventListener('click', () => {
      mainGrid.classList.remove('list-view');
      viewGridBtn.style.color = 'var(--text)';
      viewListBtn.style.color = 'var(--text-muted)';
    });
    viewListBtn.addEventListener('click', () => {
      mainGrid.classList.add('list-view');
      viewListBtn.style.color = 'var(--text)';
      viewGridBtn.style.color = 'var(--text-muted)';
    });
  }

  updateFilterTags();
}
'''

if old_init_filters_start != -1 and old_init_filters_end != -1:
    js_content = js_content[:old_init_filters_start] + new_init_filters + js_content[old_init_filters_end:]

with open('js/script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Updated features successfully')
