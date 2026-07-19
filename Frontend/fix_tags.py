suffix = '\n<script src="js/script.js"></script>\n</body>\n</html>\n'
for file in ['faq.html', 'privacy.html']:
    with open(file, 'a', encoding='utf-8') as f:
        f.write(suffix)
print('Fixed missing closing tags')
