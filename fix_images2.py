import json
import re
import urllib.parse

file_path = 'Frontend/js/script.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "Levis Mens 511 Slim Fit Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
    "Wrangler Mens Regular Fit Jeans": "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&q=80",
    "H&M Mens Cotton Chino Pants": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
    "Allen Solly Mens Casual Trousers": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80",
    "Zara Mens Turtleneck Sweater": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
    "Puma Mens Essential Hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    "Nike Sportswear Club Fleece Hoodie": "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500&q=80",
    "Urbanic Womens Bodycon Dress": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    "Zara Ribbed Bodycon Midi Dress": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80",
    "H&M Womens Floral Onepiece": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
    "Mango Womens A-Line Onepiece": "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&q=80",
    "Forever 21 Womens Crop Top": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
    "FabIndia Womens Silk Saree": "https://images.unsplash.com/photo-1610189013233-5c8c5040e3f2?w=500&q=80",
    "Biba Womens Cotton Salwar Suit": "https://images.unsplash.com/photo-1583391733958-d15f0d35a1a1?w=500&q=80",
    "Manyavar Mens Kurta Set": "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&q=80",
    "Nike Air Max Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    "Puma RS-X Sneakers": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80",
    "Steve Madden Womens Stiletto Heels": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
    "Van Heusen Mens Office Wear Shirt": "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80",
    "Arrow Womens Formal Trousers": "https://images.unsplash.com/photo-1509631179647-0c37cb502f1a?w=500&q=80",
    "Calvin Klein Womens Push-Up Bra": "https://images.unsplash.com/photo-1617391654484-cfbe53f01f8f?w=500&q=80",
    "Calvin Klein Womens Panty Briefs": "https://images.unsplash.com/photo-1617391654516-7fdb6e118804?w=500&q=80",
    "Victoria Secret Lace Bralette": "https://images.unsplash.com/photo-1582297125301-3844fbd5f257?w=500&q=80",
    "Victoria Secret Cotton Panty": "https://images.unsplash.com/photo-1522047879668-5431c46320a5?w=500&q=80",
    "Calvin Klein Mens Trunks 3-Pack": "https://images.unsplash.com/photo-1620803403335-5b43daee8278?w=500&q=80",
    "Calvin Klein Mens Cotton Vest": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80",
    "Macho Mens Sporto Vest": "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=500&q=80",
    "Macho Mens Innerwear Briefs": "https://images.unsplash.com/photo-1579899318854-9457884d5df6?w=500&q=80"
}

for title, old_url in replacements.items():
    # Make a placehold.co URL with the title
    # e.g., Calvin Klein Womens Push-Up Bra -> Calvin+Klein\nWomens+Push-Up\nBra
    words = title.split()
    lines = []
    for i in range(0, len(words), 2):
        lines.append('+'.join(words[i:i+2]))
    text = '\\n'.join(lines)
    
    new_url = f"https://placehold.co/500x600/EBE6DD/5C534F/png?text={text}&font=Playfair+Display"
    
    pattern = r'("title":\s*"' + re.escape(title) + r'",[^}]+?"image":\s*")' + re.escape(old_url) + r'(")'
    content = re.sub(pattern, r'\g<1>' + new_url + r'\2', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated placeholders successfully")
