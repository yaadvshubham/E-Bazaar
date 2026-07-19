with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()
if '<a href="faq.html">FAQs</a>' in text:
    print('FAQs is in index.html')
else:
    print('FAQs NOT in index.html')
