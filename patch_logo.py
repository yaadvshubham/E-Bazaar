import re

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the logoEl.innerHTML logic
new_logo_logic = r'''        const safeBrand = brand.toLowerCase();
        logoEl.innerHTML = `<img src="images/logos/${safeBrand}.png" 
        onerror="this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.com'; this.onerror=function(){this.onerror=null; this.src='https://logo.clearbit.com/${safeBrand}.coop'; this.onerror=function(){this.onerror=null; this.src='https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33'};};" 
          alt="${brand} Logo" style="width:100%; height:100%; object-fit:contain; border-radius:50%;">`;'''

# Using regex to find and replace the whole block accurately
pattern = re.compile(r'logoEl\.innerHTML = `<img src="https://logo\.clearbit\.com/\$\{brand\.toLowerCase\(\)\}\.com".*?border-radius:50%;">`;', re.DOTALL)
js = pattern.sub(new_logo_logic, js)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Logo logic replaced successfully.")
