with open('returns.html', 'r', encoding='utf-8') as f:
    text = f.read()
if '<a href="faq.html">FAQs</a>' in text:
    print('FAQs is in returns.html')
else:
    print('FAQs NOT in returns.html')
if '<a href="privacy.html">Privacy Policy</a>' in text:
    print('Privacy Policy is in returns.html')
else:
    print('Privacy Policy NOT in returns.html')
