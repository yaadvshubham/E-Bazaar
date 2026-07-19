import os
import glob

html_files = glob.glob('*.html')
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'css/category.css' not in content:
        content = content.replace('css/styles.css"/>', 'css/styles.css"/>\n  <link rel="stylesheet" href="css/category.css"/>')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
