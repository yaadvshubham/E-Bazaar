import json
import re

file_path = 'Frontend/js/script.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "Levis Mens 511 Slim Fit Jeans": "jeans,fashion,mens",
    "Wrangler Mens Regular Fit Jeans": "jeans,denim,mens",
    "H&M Mens Cotton Chino Pants": "chinos,trousers,mens",
    "Allen Solly Mens Casual Trousers": "trousers,fashion,mens",
    "Zara Mens Turtleneck Sweater": "sweater,turtleneck,mens",
    "Puma Mens Essential Hoodie": "hoodie,apparel,mens",
    "Nike Sportswear Club Fleece Hoodie": "fleece,hoodie,mens",
    "Urbanic Womens Bodycon Dress": "dress,bodycon,womens",
    "Zara Ribbed Bodycon Midi Dress": "dress,midi,womens",
    "H&M Womens Floral Onepiece": "dress,floral,womens",
    "Mango Womens A-Line Onepiece": "dress,aline,womens",
    "Forever 21 Womens Crop Top": "croptop,fashion,womens",
    "FabIndia Womens Silk Saree": "saree,silk,womens",
    "Biba Womens Cotton Salwar Suit": "salwar,suit,womens",
    "Manyavar Mens Kurta Set": "kurta,ethnic,mens",
    "Nike Air Max Sneakers": "sneakers,shoes,nike",
    "Puma RS-X Sneakers": "sneakers,shoes,puma",
    "Steve Madden Womens Stiletto Heels": "heels,stiletto,womens",
    "Van Heusen Mens Office Wear Shirt": "shirt,formal,mens",
    "Arrow Womens Formal Trousers": "trousers,formal,womens",
    "Calvin Klein Womens Push-Up Bra": "bra,lingerie,womens",
    "Calvin Klein Womens Panty Briefs": "panties,lingerie,womens",
    "Victoria Secret Lace Bralette": "bralette,lace,womens",
    "Victoria Secret Cotton Panty": "panty,cotton,womens",
    "Calvin Klein Mens Trunks 3-Pack": "trunks,underwear,mens",
    "Calvin Klein Mens Cotton Vest": "vest,cotton,mens",
    "Macho Mens Sporto Vest": "vest,sports,mens",
    "Macho Mens Innerwear Briefs": "briefs,underwear,mens"
}

i = 100
for title, keywords in replacements.items():
    new_url = f"https://loremflickr.com/500/600/{keywords}/all?lock={i}"
    i += 1
    
    # We want to replace the current image URL for this product
    pattern = r'("title":\s*"' + re.escape(title) + r'",[^}]+?"image":\s*")[^"]+(")'
    content = re.sub(pattern, r'\g<1>' + new_url + r'\2', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated placeholders to loremflickr successfully")
