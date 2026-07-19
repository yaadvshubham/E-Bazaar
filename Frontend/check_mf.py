with open('master_footer.txt', 'r', encoding='utf-8') as f:
    text = f.read()
if '<a href="faq.html">FAQs</a>' in text:
    print('faq.html is inside master_footer')
else:
    print('faq.html IS NOT IN master_footer')
if '<a href="privacy.html">Privacy Policy</a>' in text:
    print('privacy.html is inside master_footer')
else:
    print('privacy.html IS NOT IN master_footer')
