import json
import re
from duckduckgo_search import DDGS
import time

file_path = 'Frontend/js/script.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

products = [
    "Levis Mens 511 Slim Fit Jeans",
    "Wrangler Mens Regular Fit Jeans",
    "H&M Mens Cotton Chino Pants",
    "Allen Solly Mens Casual Trousers",
    "Zara Mens Turtleneck Sweater",
    "Puma Mens Essential Hoodie",
    "Nike Sportswear Club Fleece Hoodie",
    "Urbanic Womens Bodycon Dress",
    "Zara Ribbed Bodycon Midi Dress",
    "H&M Womens Floral Onepiece",
    "Mango Womens A-Line Onepiece",
    "Forever 21 Womens Crop Top",
    "FabIndia Womens Silk Saree",
    "Biba Womens Cotton Salwar Suit",
    "Manyavar Mens Kurta Set",
    "Nike Air Max Sneakers",
    "Puma RS-X Sneakers",
    "Steve Madden Womens Stiletto Heels",
    "Van Heusen Mens Office Wear Shirt",
    "Arrow Womens Formal Trousers",
    "Calvin Klein Womens Push-Up Bra",
    "Calvin Klein Womens Panty Briefs",
    "Victoria Secret Lace Bralette",
    "Victoria Secret Cotton Panty",
    "Calvin Klein Mens Trunks 3-Pack",
    "Calvin Klein Mens Cotton Vest",
    "Macho Mens Sporto Vest",
    "Macho Mens Innerwear Briefs"
]

with DDGS() as ddgs:
    for title in products:
        try:
            results = list(ddgs.images(title, max_results=1))
            if results:
                new_url = results[0]['image']
                
                # Replace the old placehold.co URL for this product
                pattern = r'("title":\s*"' + re.escape(title) + r'",[^}]+?"image":\s*")https://placehold\.co/500x600/[^"]+(")'
                content = re.sub(pattern, r'\g<1>' + new_url.replace('\\', '\\\\') + r'\2', content, flags=re.DOTALL)
                print(f"Replaced {title}")
            else:
                print(f"No image found for {title}")
            time.sleep(1)  # rate limit precaution
        except Exception as e:
            print(f"Error on {title}: {e}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Finished scraping images")
