import re

file_path = 'Frontend/js/script.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the broken image strings:
# "image": "https://placehold.co/500x600/EBE6DD/5C534F/png?text=...
# ...
# ...&font=Playfair+Display",

# Use regex to find placehold.co urls that are spread across multiple lines
# and replace the actual newlines inside them with %0A
def replacer(match):
    url = match.group(0)
    # Replace literal newlines with %0A
    fixed_url = url.replace('\n', '%0A')
    return fixed_url

pattern = r'"https://placehold\.co/500x600/[^"]+"'
# Wait, if there's a newline, [^"] will match it.
# Let's do a broader regex.
content = re.sub(r'"https://placehold\.co/500x600/.*?&font=Playfair\+Display"', replacer, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed newlines successfully")
