import os

# 1. Update category.html to add values to the inputs
with open('category.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add values to rating inputs
html = html.replace('<input type="radio" name="rating"/><div class="rating-stars-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span class="rating-label">4★ &amp; above</span>', '<input type="radio" name="rating" value="4"/><div class="rating-stars-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span class="rating-label">4★ &amp; above</span>')
html = html.replace('<input type="radio" name="rating"/><div class="rating-stars-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span class="rating-label">3★ &amp; above</span>', '<input type="radio" name="rating" value="3"/><div class="rating-stars-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span class="rating-label">3★ &amp; above</span>')
html = html.replace('<input type="radio" name="rating"/><div class="rating-stars-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span class="rating-label">2★ &amp; above</span>', '<input type="radio" name="rating" value="2"/><div class="rating-stars-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" color="#E8A030"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span class="rating-label">2★ &amp; above</span>')

# Add values to discount inputs
html = html.replace('<input type="checkbox"/><span class="discount-label">10% and above</span>', '<input type="checkbox" value="10" name="discount"/><span class="discount-label">10% and above</span>')
html = html.replace('<input type="checkbox"/><span class="discount-label">20% and above</span>', '<input type="checkbox" value="20" name="discount"/><span class="discount-label">20% and above</span>')
html = html.replace('<input type="checkbox"/><span class="discount-label">30% and above</span>', '<input type="checkbox" value="30" name="discount"/><span class="discount-label">30% and above</span>')
html = html.replace('<input type="checkbox"/><span class="discount-label">40% and above</span>', '<input type="checkbox" value="40" name="discount"/><span class="discount-label">40% and above</span>')
html = html.replace('<input type="checkbox"/><span class="discount-label">50% and above</span>', '<input type="checkbox" value="50" name="discount"/><span class="discount-label">50% and above</span>')

with open('category.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update script.js
with open('js/script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Fix bought count randomness
js_content = js_content.replace('${Math.floor(Math.random()*5 + 1)}k+ bought in past month', '${p.bought}k+ bought in past month')

# Add p.bought to product generation
gen_block = '''
      badge: ['hot', 'new', 'sale', ''][Math.floor(Math.random()*4)],
      color: `hsl(${Math.random()*360}, 50%, 60%)`,
      shape: categoryData.shape,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      reviews: Math.floor(Math.random() * 5000) + 50,
      bought: Math.floor(Math.random() * 5 + 1)
    };'''
    
# Wait, I need to match the original generateMockProductsForCategory block
old_gen_block = '''
      badge: ['hot', 'new', 'sale', ''][Math.floor(Math.random()*4)],
      color: `hsl(${Math.random()*360}, 50%, 60%)`,
      shape: categoryData.shape,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      reviews: Math.floor(Math.random() * 5000) + 50
    };'''
# Let's use regex or string replace with less context
import re
js_content = re.sub(
    r'reviews:\s*Math.floor\(Math.random\(\)\s*\*\s*5000\)\s*\+\s*50\s*\}', 
    'reviews: Math.floor(Math.random() * 5000) + 50,\n      bought: Math.floor(Math.random() * 5 + 1)\n    }', 
    js_content
)

# Update filter logic to include Rating and Discount
new_filter_logic = '''
    // Brand filter
    const checkedBrands = [...document.querySelectorAll('.brand-check input:checked')].map(cb => cb.value);
    if (checkedBrands.length > 0) {
      filtered = filtered.filter(p => checkedBrands.includes(p.brand));
    }
    
    // Rating filter
    const ratingInput = document.querySelector('.rating-row input:checked');
    if (ratingInput) {
      const minRating = parseInt(ratingInput.value);
      filtered = filtered.filter(p => parseFloat(p.rating) >= minRating);
    }

    // Discount filter
    const checkedDiscounts = [...document.querySelectorAll('.discount-row input:checked')].map(cb => parseInt(cb.value));
    if (checkedDiscounts.length > 0) {
      const minDiscount = Math.min(...checkedDiscounts);
      filtered = filtered.filter(p => {
        const discStr = p.disc || '0%';
        const discNum = parseInt(discStr.replace('%', ''));
        return discNum >= minDiscount;
      });
    }
    
    // Price filter'''

js_content = js_content.replace('''
    // Brand filter
    const checkedBrands = [...document.querySelectorAll('.brand-check input:checked')].map(cb => cb.value);
    if (checkedBrands.length > 0) {
      filtered = filtered.filter(p => checkedBrands.includes(p.brand));
    }
    
    // Price filter''', new_filter_logic)

# Add event listeners for rating and discount
listeners_addition = '''
  document.querySelectorAll('.rating-row input').forEach(input => input.addEventListener('change', renderFilteredProducts));
  document.querySelectorAll('.discount-row input').forEach(input => input.addEventListener('change', renderFilteredProducts));
'''
js_content = js_content.replace("document.querySelector('.sort-select')?.addEventListener('change', renderFilteredProducts);", "document.querySelector('.sort-select')?.addEventListener('change', renderFilteredProducts);\n" + listeners_addition)

with open('js/script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Updated features part 2')
