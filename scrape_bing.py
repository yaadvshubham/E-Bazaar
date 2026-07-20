import urllib.request
import urllib.parse
import re
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

def get_image(title):
    # Try searching without site filter first to get the best match from e-commerce
    query = title + " buy online myntra amazon flipkart"
    url = 'https://www.bing.com/images/search?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # match murl
        matches = re.findall(r'murl&quot;:&quot;(http[^&]+(?:jpg|png|jpeg))&quot;', html)
        if matches:
            # Try to find one from amazon, myntra, flipkart, etc. if possible
            for m in matches:
                if any(domain in m for domain in ['amazon', 'myntra', 'flipkart', 'meesho', 'zara', 'hm', 'puma', 'nike']):
                    return m
            return matches[0] # fallback
    except Exception as e:
        print(f"Error on {title}: {e}")
    return None

for title in products:
    img_url = get_image(title)
    if img_url:
        print(f"Found for {title}: {img_url}")
        # Replace the loremflickr URL
        pattern = r'("title":\s*"' + re.escape(title) + r'",[^}]+?"image":\s*")[^"]+(")'
        content = re.sub(pattern, r'\g<1>' + img_url + r'\2', content, flags=re.DOTALL)
    else:
        print(f"Not found for {title}")
    time.sleep(1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished Bing scraping")
