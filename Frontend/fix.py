import re

with open('js/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the massive new product arrays and the updated generator functions
new_generators = """
// Mock product generator based on category parameters
function generateMockProductsForCategory(catId) {
  const products = [];
  const categoryData = CATEGORY_MAP[catId] || CATEGORY_MAP['all'];
  const allBrands = Object.values(CATEGORY_MAP).filter(c => c.brands).flatMap(c => c.brands);
  
  const productNames = {
    'electronics': ['Smartphone', 'OLED Smart TV', 'Laptop Pro', 'Tablet Ultra', 'Noise Cancelling Earbuds', 'Mirrorless Camera', 'Drone 4K', 'Smartwatch Series', 'Gaming Console', 'VR Headset'],
    'gadgets': ['Wireless Earbuds', 'Smart Speaker', 'Power Bank 20000mAh', 'Fitness Tracker', '4K Webcam', 'Gaming Mouse', 'Mechanical Keyboard', 'Smart Ring', 'Portable Projector', 'Dash Cam'],
    'clothing': ['T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Cashmere Sweater', 'Summer Dress', 'Cargo Shorts', 'Puffer Coat', 'Athleisure Set', 'Formal Blazer', 'Linen Shirt'],
    'shoes': ['Sneakers', 'Running Shoes', 'Formal Oxfords', 'Trekking Boots', 'Slip-on Loafers', 'High-Top Kicks', 'Basketball Shoes', 'Flip Flops', 'Chelsea Boots', 'Trainers'],
    'beauty': ['Face Wash', 'Hydrating Moisturizer', 'Matte Lipstick', 'SPF 50 Sunscreen', 'Eau De Parfum', 'Vitamin C Serum', 'Anti-aging Cream', 'Eye Contour Gel', 'Hair Treatment Mask', 'Foundation'],
    'sports': ['Badminton Racket', 'Pro Football', 'Eco Yoga Mat', 'Adjustable Dumbbells', 'Tennis Ball Pack', 'Skipping Rope', 'Resistance Bands', 'Protein Shaker', 'Cycling Helmet', 'Treadmill'],
    'home-kitchen': ['Blender Pro', 'Non-stick Cookware Set', 'Ceramic Dinner Set', 'Insulated Water Bottle', 'Glass Storage Container', 'Mixer Grinder', 'Air Fryer', 'Smart Coffee Maker', 'Vacuum Cleaner', 'Microwave Oven'],
    'groceries': ['Premium Atta', 'Basmati Rice', 'Organic Dal', 'Olive Oil', 'Green Tea', 'Instant Coffee', 'Dry Fruits Mix', 'Dark Chocolate', 'Quinoa', 'Peanut Butter']
  };
  const categoryNames = productNames[catId] || ['Premium Item', 'Signature Product', 'Exclusive Collection', 'Limited Edition', 'Bestseller'];
  
  // Mix in other brands for diversity (80% primary brand, 20% random brand)
  for(let i=0; i<36; i++) {
    let brand;
    if (Math.random() > 0.2 && categoryData.brands && categoryData.brands.length > 0) {
      brand = categoryData.brands[Math.floor(Math.random() * categoryData.brands.length)];
    } else {
      brand = allBrands[Math.floor(Math.random() * allBrands.length)] || 'E-Bazaar Exclusive';
    }
    
    const itemName = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    products.push({
      id: `prod_${catId}_${i}`,
      brand: brand,
      name: `${brand} ${itemName} - Edition ${i+1}`,
      price: `₹${(Math.floor(Math.random() * 80) + 10) * 100}`,
      orig: `₹${(Math.floor(Math.random() * 120) + 90) * 100}`,
      disc: `${Math.floor(Math.random() * 50) + 10}%`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: `${Math.floor(Math.random() * 1500) + 50}`,
      badge: Math.random() > 0.8 ? 'new' : (Math.random() > 0.6 ? 'sale' : (Math.random() > 0.9 ? 'hot' : '')),
      color: `hsl(${Math.floor(Math.random() * 360)}, 25%, 35%)`,
      shape: ['circle','oval','diamond','hexagon','rect'][Math.floor(Math.random()*5)]
    });
  }
  return products;
}

function generateBrandProducts(brand, catId) {
    const products = [];
    const productNames = {
        'electronics': ['Smartphone', 'OLED Smart TV', 'Laptop Pro', 'Tablet Ultra', 'Noise Cancelling Earbuds', 'Mirrorless Camera', 'Drone 4K', 'Smartwatch Series', 'Gaming Console', 'VR Headset'],
        'gadgets': ['Wireless Earbuds', 'Smart Speaker', 'Power Bank 20000mAh', 'Fitness Tracker', '4K Webcam', 'Gaming Mouse', 'Mechanical Keyboard', 'Smart Ring', 'Portable Projector', 'Dash Cam'],
        'clothing': ['T-Shirt', 'Denim Jeans', 'Leather Jacket', 'Cashmere Sweater', 'Summer Dress', 'Cargo Shorts', 'Puffer Coat', 'Athleisure Set', 'Formal Blazer', 'Linen Shirt'],
        'shoes': ['Sneakers', 'Running Shoes', 'Formal Oxfords', 'Trekking Boots', 'Slip-on Loafers', 'High-Top Kicks', 'Basketball Shoes', 'Flip Flops', 'Chelsea Boots', 'Trainers'],
        'beauty': ['Face Wash', 'Hydrating Moisturizer', 'Matte Lipstick', 'SPF 50 Sunscreen', 'Eau De Parfum', 'Vitamin C Serum', 'Anti-aging Cream', 'Eye Contour Gel', 'Hair Treatment Mask', 'Foundation'],
        'sports': ['Badminton Racket', 'Pro Football', 'Eco Yoga Mat', 'Adjustable Dumbbells', 'Tennis Ball Pack', 'Skipping Rope', 'Resistance Bands', 'Protein Shaker', 'Cycling Helmet', 'Treadmill'],
        'home-kitchen': ['Blender Pro', 'Non-stick Cookware Set', 'Ceramic Dinner Set', 'Insulated Water Bottle', 'Glass Storage Container', 'Mixer Grinder', 'Air Fryer', 'Smart Coffee Maker', 'Vacuum Cleaner', 'Microwave Oven'],
        'groceries': ['Premium Atta', 'Basmati Rice', 'Organic Dal', 'Olive Oil', 'Green Tea', 'Instant Coffee', 'Dry Fruits Mix', 'Dark Chocolate', 'Quinoa', 'Peanut Butter']
    };
    
    // For brand store, strictly generate only this brand's products
    let catNames = [];
    if (catId && productNames[catId]) {
        catNames = productNames[catId];
    } else {
        // Mix if unknown category
        catNames = Object.values(productNames).flat();
    }
    
    // Generate massive list for brand store (48 items)
    for(let i=0; i<48; i++) {
        const itemName = catNames[Math.floor(Math.random() * catNames.length)];
        products.push({
            id: `prod_brand_${brand}_${i}`,
            brand: brand,
            name: `${brand} ${itemName} - Signature ${i+1}`,
            price: `₹${(Math.floor(Math.random() * 80) + 15) * 100}`,
            orig: `₹${(Math.floor(Math.random() * 120) + 95) * 100}`,
            disc: `${Math.floor(Math.random() * 45) + 5}%`,
            rating: (Math.random() * 1.0 + 4.0).toFixed(1),
            reviews: `${Math.floor(Math.random() * 3000) + 100}`,
            badge: Math.random() > 0.85 ? 'new' : (Math.random() > 0.7 ? 'sale' : (Math.random() > 0.9 ? 'hot' : '')),
            color: `hsl(${Math.floor(Math.random() * 360)}, 25%, 35%)`,
            shape: ['circle','oval','diamond','hexagon','rect'][Math.floor(Math.random()*5)]
        });
    }
    return products;
}
"""

# Extract the region to replace
# From 'function generateMockProductsForCategory(catId) {'
# To 'function makeSVG'

start_marker = "function generateMockProductsForCategory(catId) {"
end_marker = "function makeSVG(color, shape, w = 200, h = 190) {"
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # We replace from start_idx to end_idx with new_generators + some spacing
    content = content[:start_idx] + new_generators + "\n// Reuse SVG generator\n" + content[end_idx:]
    
    # Now replace generateBrandProducts as well (if it exists)
    start_brand = content.find("function generateBrandProducts(brand, cat) {")
    if start_brand != -1:
        end_brand = content.find("function renderBrandPage() {", start_brand)
        if end_brand != -1:
            # We already defined it in new_generators, so we can just remove the old one
            content = content[:start_brand] + content[end_brand:]

    with open('js/script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched script.js successfully")
else:
    print("Could not find markers")
