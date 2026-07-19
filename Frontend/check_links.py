import os

files = [f for f in os.listdir('.') if f.endswith('.html')]
missing = []
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        if '<a href="faq.html">FAQs</a>' not in content:
            missing.append(f)

print(f"Missing FAQ link in: {missing}")
