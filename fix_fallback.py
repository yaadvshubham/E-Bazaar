import re
import os

with open('Frontend/js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

logo_replacement = r'''logoEl.innerHTML = `<img src="https://logo.clearbit.com/${brand.toLowerCase()}.com" 
        onerror="this.onerror=null; this.src='https://logo.clearbit.com/${brand.toLowerCase()}.coop'; this.onerror=function(){this.onerror=null; this.src='https://logo.clearbit.com/${brand.toLowerCase()}.in'; this.onerror=function(){this.onerror=null; this.src='https://ui-avatars.com/api/?name=${brand}&background=0D8ABC&color=fff&size=140&font-size=0.33'};};" 
        alt="${brand} Logo" style="width:100%; height:100%; object-fit:contain; border-radius:50%;">`;'''

# Using string matching to replace
pattern = re.compile(r'logoEl\.innerHTML = `<img src="https://logo\.clearbit\.com/\$\{brand\.toLowerCase\(\)\}\.com".*?>`;', re.DOTALL)
js = pattern.sub(logo_replacement, js)

with open('Frontend/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated logo fallback logic in script.js')

