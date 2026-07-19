for file in ['returns.html', 'shipping.html', 'contact.html', 'privacy.html', 'faq.html']:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove any existing padding-top inside inline style to reset, then set to 16px
    content = content.replace('padding-top: 20px;', '')
    
    # Add padding-top: 16px to returns and shipping which didn't have it
    content = content.replace('<section class="section" style="max-width: 800px; margin: 0 auto;">', '<section class="section" style="max-width: 800px; margin: 0 auto; padding-top: 16px;">')
    
    # Add padding-top: 16px to contact, privacy, faq which had 20px removed
    content = content.replace('<section class="section" style="max-width: 900px; margin: 0 auto; ">', '<section class="section" style="max-width: 900px; margin: 0 auto; padding-top: 16px;">')
    content = content.replace('<section class="section" style="max-width: 1100px; margin: 0 auto; ">', '<section class="section" style="max-width: 1100px; margin: 0 auto; padding-top: 16px;">')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed padding in static pages")
