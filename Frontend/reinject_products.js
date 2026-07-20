const fs = require('fs');

const generateProducts = () => {
    let newProducts = [];
    let idCounter = 2000;
    const addP = (title, price, category, image, brand, badge='', oldPrice=null) => {
        newProducts.push({
            id: `custom_${idCounter++}`,
            title,
            price,
            originalPrice: oldPrice || price * 1.3,
            badge,
            image,
            category,
            brand
        });
    };

    // 1. Mid Range Phones
    const phones = [
        ['Samsung Galaxy M34 5G', 16999, 'Samsung'],
        ['Samsung Galaxy F54 5G', 24999, 'Samsung'],
        ['Vivo T2 Pro 5G', 23999, 'Vivo'],
        ['Vivo T2x 5G', 12999, 'Vivo'],
        ['Oppo F23 5G', 24999, 'Oppo'],
        ['Oppo F21s Pro', 21999, 'Oppo'],
        ['Redmi Note 13 Pro', 25999, 'Xiaomi'],
        ['Redmi Note 12 5G', 15999, 'Xiaomi'],
        ['Motorola Edge 40 Neo', 22999, 'Motorola'],
        ['Moto G84 5G', 18999, 'Motorola']
    ];
    phones.forEach(p => addP(p[0], p[1], 'smartphones', 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&q=80', p[2], 'new'));

    // 2. Premium Phones
    const premiumPhones = [
        ['Samsung Galaxy S24 Ultra', 129999, 'Samsung'],
        ['Samsung Galaxy S23', 64999, 'Samsung'],
        ['Apple iPhone 15 Pro Max', 159900, 'Apple'],
        ['Apple iPhone 15', 79900, 'Apple'],
        ['Vivo X100 Pro', 89999, 'Vivo'],
        ['Oppo Find N3 Flip', 94999, 'Oppo']
    ];
    premiumPhones.forEach(p => addP(p[0], p[1], 'smartphones', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80', p[2], 'hot'));

    // 3. Wearables
    const wearables = [
        ['Apple Watch Series 9', 41900, 'Apple'],
        ['Samsung Galaxy Watch 6', 29999, 'Samsung'],
        ['boAt Lunar Connect Smartwatch', 1999, 'boAt'],
        ['Noise ColorFit Pro 4', 2499, 'Noise'],
        ['Fire-Boltt Visionary', 2999, 'Fire-Boltt'],
        ['Meta Quest 3 Smart Goggles', 49999, 'Meta'],
        ['Ray-Ban Meta Smart Glasses', 32999, 'Meta']
    ];
    wearables.forEach(p => addP(p[0], p[1], 'gadgets', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80', p[2]));

    // 4. Electronics (TV, CPU, Monitors, Refrigerators, AC, Laptops)
    const electronics = [
        ['Sony Bravia 55 inch 4K Ultra HD TV', 62990, 'Sony', 'appliances'],
        ['Samsung 65 inch QLED 4K TV', 89990, 'Samsung', 'appliances'],
        ['LG 1.5 Ton 5 Star AI DUAL Inverter AC', 45990, 'LG', 'appliances'],
        ['Voltas 1.5 Ton 3 Star Split AC', 32990, 'Voltas', 'appliances'],
        ['Symphony Diet 3D 55i+ Cooler', 10499, 'Symphony', 'appliances'],
        ['Samsung 236 L 3 Star Refrigerator', 24490, 'Samsung', 'appliances'],
        ['Whirlpool 240 L Frost Free Refrigerator', 25990, 'Whirlpool', 'appliances'],
        ['Intel Core i9-13900K Processor CPU', 52999, 'Intel', 'gadgets'],
        ['AMD Ryzen 9 7950X Processor CPU', 55999, 'AMD', 'gadgets'],
        ['LG 27 inch 4K UHD Monitor', 32000, 'LG', 'gadgets'],
        ['BenQ 32 inch 4K Designer Monitor', 45000, 'BenQ', 'gadgets'],
        ['Apple MacBook Air M2', 99900, 'Apple', 'laptops'],
        ['Dell XPS 15 Laptop', 189990, 'Dell', 'laptops'],
        ['HP Pavilion 14 Laptop', 62990, 'HP', 'laptops'],
        ['Asus ROG Zephyrus G14', 139990, 'Asus', 'laptops']
    ];
    electronics.forEach(p => addP(p[0], p[1], p[3], 'https://images.unsplash.com/photo-1550009158-9effb66236b2?w=500&q=80', p[2], 'sale'));

    // 5. Clothing & Fashion (Female & Male)
    const clothes = [
        ['Levis Mens 511 Slim Fit Jeans', 2599, 'Levis', 'bottoms'],
        ['Wrangler Mens Regular Fit Jeans', 1999, 'Wrangler', 'bottoms'],
        ['H&M Mens Cotton Chino Pants', 1499, 'H&M', 'bottoms'],
        ['Allen Solly Mens Casual Trousers', 1799, 'Allen Solly', 'bottoms'],
        ['Zara Mens Turtleneck Sweater', 2999, 'Zara', 'mens-shirts'], // mapping to existing
        ['Puma Mens Essential Hoodie', 2299, 'Puma', 'mens-shirts'],
        ['Nike Sportswear Club Fleece Hoodie', 3499, 'Nike', 'mens-shirts'],
        ['Urbanic Womens Bodycon Dress', 1299, 'Urbanic', 'womens-dresses'],
        ['Zara Ribbed Bodycon Midi Dress', 2599, 'Zara', 'womens-dresses'],
        ['H&M Womens Floral Onepiece', 1999, 'H&M', 'womens-dresses'],
        ['Mango Womens A-Line Onepiece', 3499, 'Mango', 'womens-dresses'],
        ['Forever 21 Womens Crop Top', 799, 'Forever 21', 'tops'],
        ['FabIndia Womens Silk Saree', 5999, 'FabIndia', 'traditional'],
        ['Biba Womens Cotton Salwar Suit', 2499, 'Biba', 'traditional'],
        ['Manyavar Mens Kurta Set', 3999, 'Manyavar', 'traditional'],
        ['Nike Air Max Sneakers', 8999, 'Nike', 'womens-shoes'],
        ['Puma RS-X Sneakers', 7499, 'Puma', 'womens-shoes'],
        ['Steve Madden Womens Stiletto Heels', 4599, 'Steve Madden', 'womens-shoes'],
        ['Van Heusen Mens Office Wear Shirt', 1599, 'Van Heusen', 'office-wear'],
        ['Arrow Womens Formal Trousers', 1899, 'Arrow', 'office-wear'],
        ['Calvin Klein Womens Push-Up Bra', 2499, 'Calvin Klein', 'womens-innerwear'],
        ['Calvin Klein Womens Panty Briefs', 999, 'Calvin Klein', 'womens-innerwear'],
        ['Victoria Secret Lace Bralette', 3599, 'Victoria Secret', 'womens-innerwear'],
        ['Victoria Secret Cotton Panty', 1299, 'Victoria Secret', 'womens-innerwear'],
        ['Calvin Klein Mens Trunks 3-Pack', 2999, 'Calvin Klein', 'mens-innerwear'],
        ['Calvin Klein Mens Cotton Vest', 1499, 'Calvin Klein', 'mens-innerwear'],
        ['Macho Mens Sporto Vest', 299, 'Macho', 'mens-innerwear'],
        ['Macho Mens Innerwear Briefs', 249, 'Macho', 'mens-innerwear']
    ];
    clothes.forEach(p => addP(p[0], p[1], p[3], 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80', p[2]));

    return newProducts;
};

const newProducts = generateProducts();

let script = fs.readFileSync('Frontend/js/script.js', 'utf8');

const startIdx = script.indexOf('const MASTER_PRODUCTS = [');
let endIdx = script.indexOf('];\n', startIdx);
if (endIdx === -1) endIdx = script.indexOf('];\r\n', startIdx);

if (endIdx !== -1) {
    const arrayStart = startIdx + 24;
    const arrayEnd = endIdx + 1;
    let arrayStr = script.substring(arrayStart, arrayEnd);
    arrayStr = arrayStr.replace(/;\s*$/, ''); // clean up trailing semicolon if any
    
    // Convert to JSON robustly to inject
    const newProductsStr = JSON.stringify(newProducts, null, 2);
    // Remove the opening '[' and trailing ']'
    const newItemsStr = newProductsStr.substring(1, newProductsStr.length - 1);
    
    // Inject right before the closing ']'
    const insertPos = arrayStr.lastIndexOf(']');
    const modifiedArrayStr = arrayStr.substring(0, insertPos) + ',' + newItemsStr + '\n]';
    
    script = script.substring(0, arrayStart) + modifiedArrayStr + script.substring(arrayEnd);
    fs.writeFileSync('Frontend/js/script.js', script);
    console.log(`Injected ${newProducts.length} products successfully.`);
} else {
    console.log("Could not find MASTER_PRODUCTS end.");
}
