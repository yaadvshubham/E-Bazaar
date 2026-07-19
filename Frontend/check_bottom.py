with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('class="footer-bottom"')
print(text[idx:idx+200])
