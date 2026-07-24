const sequelize = require('../config/database');
const Product = require('../models/Product');

const newProducts = [
  // CONDOMS - Manforce
  {
    title: 'Manforce Strawberry Flavoured Condoms - 10 Pack',
    description: 'Manforce Strawberry flavoured condoms for a pleasurable experience. Made from premium natural rubber latex with smooth lubrication. Electronically tested for reliability. 10 condoms in pack. ISI certified quality.',
    price: 89.00, originalPrice: 120.00, discount: '26% OFF',
    rating: 4.3, reviews: 2841, sales: '5000+ bought in past month', badge: 'SALE',
    category: 'health', brand: 'Manforce',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80',
    stock: 200, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Manforce More Dots Condoms - Ribbed & Dotted 20 Pack',
    description: 'Manforce More 20-count condoms with ribbed and dotted texture for enhanced mutual pleasure. Extra lubricated for smooth experience. Made from natural rubber latex, ISI marked. 20 condoms per pack.',
    price: 149.00, originalPrice: 200.00, discount: '25% OFF',
    rating: 4.2, reviews: 1925, sales: '3200+ bought in past month', badge: 'SALE',
    category: 'health', brand: 'Manforce',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80',
    stock: 180, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Manforce Extra Time Delay Condoms - 10 Pack',
    description: 'Manforce Extra Time Delay Condoms help you last longer. Special desensitizing lubricant on inside for men. Natural latex, smooth outer surface. 10 condoms. ISI certified.',
    price: 110.00, originalPrice: 150.00, discount: '27% OFF',
    rating: 4.1, reviews: 1432, sales: '2000+ bought in past month', badge: 'SALE',
    category: 'health', brand: 'Manforce',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80',
    stock: 150, gstRate: 12.0, isDeal: false, isNew: false
  },
  // CONDOMS - Durex
  {
    title: 'Durex Pleasure Me Condoms - 10 Pack',
    description: 'Durex Pleasure Me condoms with revolutionary ribbing and dots for maximum stimulation. Extra lubricated with silicone-based lubricant. Premium quality tested to international standards. 10 condoms per pack.',
    price: 220.00, originalPrice: 280.00, discount: '21% OFF',
    rating: 4.5, reviews: 3120, sales: '4500+ bought in past month', badge: 'HOT',
    category: 'health', brand: 'Durex',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    stock: 250, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Durex Invisible Extra Thin Condoms - 10 Pack',
    description: 'Durex Invisible condoms are extra thin for enhanced sensitivity — so thin you barely feel anything but closeness. Ultra-thin latex for a natural feel. International quality certified. 10 condoms per pack.',
    price: 249.00, originalPrice: 320.00, discount: '22% OFF',
    rating: 4.6, reviews: 2560, sales: '3800+ bought in past month', badge: 'HOT',
    category: 'health', brand: 'Durex',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    stock: 200, gstRate: 12.0, isDeal: false, isNew: false
  },
  {
    title: 'Durex Real Feel Non-Latex Condoms - 10 Pack',
    description: 'Durex Real Feel condoms are made from polyisoprene for a skin-on-skin feeling. Latex-free, suitable for latex allergies. Extra lubricated for comfort. Works with water and silicone-based lubricants. 10 pack.',
    price: 299.00, originalPrice: 380.00, discount: '21% OFF',
    rating: 4.4, reviews: 890, sales: '1200+ bought in past month', badge: 'NEW',
    category: 'health', brand: 'Durex',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    stock: 100, gstRate: 12.0, isDeal: false, isNew: true
  },
  // RED TAPE SHOES
  {
    title: 'Red Tape Sports Sneakers - White & Blue',
    description: 'Red Tape lightweight sports sneakers with breathable mesh upper and cushioned EVA sole. Ideal for daily wear, gym workouts, and casual outings. Slip-resistant rubber outsole for grip. Available in sizes 6-12.',
    price: 1299.00, originalPrice: 2499.00, discount: '48% OFF',
    rating: 4.2, reviews: 3456, sales: '800+ sold', badge: 'SALE',
    category: 'shoes', brand: 'Red Tape',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    stock: 120, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Red Tape Walking Shoes - Black Leather',
    description: 'Premium Red Tape genuine leather walking shoes with padded collar and tongue. Memory foam insole for all-day comfort. Flexible rubber outsole. Classic professional styling for office and casual wear.',
    price: 1899.00, originalPrice: 3499.00, discount: '46% OFF',
    rating: 4.3, reviews: 2190, sales: '600+ sold', badge: 'SALE',
    category: 'shoes', brand: 'Red Tape',
    imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80',
    stock: 85, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Red Tape Running Shoes - Mesh Grey',
    description: 'Red Tape ultra-lightweight running shoes with high-performance mesh upper for ventilation. Responsive EVA midsole absorbs impact. Rubber outsole with multi-directional grip. Ideal for road running.',
    price: 1599.00, originalPrice: 2999.00, discount: '47% OFF',
    rating: 4.1, reviews: 1850, sales: '500+ sold', badge: 'SALE',
    category: 'shoes', brand: 'Red Tape',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961a28b?auto=format&fit=crop&w=600&q=80',
    stock: 100, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Red Tape Casual Loafers - Brown Suede',
    description: 'Stylish Red Tape suede loafers for casual and semi-formal occasions. Slip-on design with elastic gore panel for easy wear. Cushioned footbed with memory foam. Durable rubber sole. Sizes 6-11.',
    price: 1699.00, originalPrice: 2999.00, discount: '43% OFF',
    rating: 4.4, reviews: 920, sales: '300+ sold', badge: 'SALE',
    category: 'shoes', brand: 'Red Tape',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
    stock: 70, gstRate: 12.0, isDeal: false, isNew: false
  },
  {
    title: 'Red Tape High-Top Sneakers - Black & White',
    description: 'Trendy Red Tape high-top sneakers with ankle support and retro styling. Canvas upper with vulcanized rubber sole. Metal eyelet lacing system. Padded collar and insole. Unisex styling. Sizes 5-11.',
    price: 1499.00, originalPrice: 2499.00, discount: '40% OFF',
    rating: 4.2, reviews: 1340, sales: '450+ sold', badge: 'NEW',
    category: 'shoes', brand: 'Red Tape',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    stock: 90, gstRate: 12.0, isDeal: false, isNew: true
  },
  // GROCERIES
  {
    title: 'Kurkure Masala Munch Chips - Pack of 6',
    description: 'Kurkure Masala Munch is a one-of-a-kind snack made from a unique blend of rice meal, corn meal, and spices. Tangy masala flavour with a satisfying crunch. Pack of 6 x 78g. No artificial colours. Popular Indian snack.',
    price: 120.00, originalPrice: 150.00, discount: '20% OFF',
    rating: 4.4, reviews: 8920, sales: '15000+ bought in past month', badge: 'HOT',
    category: 'groceries', brand: 'Kurkure',
    imageUrl: 'https://images.unsplash.com/photo-1633436374961-09b92742047b?auto=format&fit=crop&w=600&q=80',
    stock: 500, gstRate: 5.0, isDeal: true, isNew: false
  },
  {
    title: 'Kurkure Chilli Chatka - Pack of 12',
    description: 'Kurkure Chilli Chatka packs a spicy punch in every bite! Made from corn and rice with chilli flavouring. Perfect for snack time, parties and sharing. Pack of 12 x 38g pouches. Baked not fried.',
    price: 96.00, originalPrice: 120.00, discount: '20% OFF',
    rating: 4.3, reviews: 5400, sales: '8000+ bought in past month', badge: 'HOT',
    category: 'groceries', brand: 'Kurkure',
    imageUrl: 'https://images.unsplash.com/photo-1633436374961-09b92742047b?auto=format&fit=crop&w=600&q=80',
    stock: 450, gstRate: 5.0, isDeal: true, isNew: false
  },
  {
    title: 'Bingo Tedhe Medhe Masala Snack - Pack of 6',
    description: 'Bingo! Tedhe Medhe is the iconic twisted snack with a bold masala flavour. Unique curly shape with crunchy texture. Made with real spices. Pack of 6 x 70g. Loved by kids and adults alike.',
    price: 114.00, originalPrice: 138.00, discount: '17% OFF',
    rating: 4.5, reviews: 12300, sales: '20000+ bought in past month', badge: 'HOT',
    category: 'groceries', brand: 'Bingo',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    stock: 600, gstRate: 5.0, isDeal: true, isNew: false
  },
  {
    title: 'Bingo Tedhe Medhe Original Masala Jumbo Pack 160g',
    description: 'Bingo Tedhe Medhe Jumbo 160g pack — more of the curly, tangy, spicy snack you love! Twisted shape for extra crunch. Made from corn, seasoned with authentic Indian masala. Great for movie nights.',
    price: 55.00, originalPrice: 65.00, discount: '15% OFF',
    rating: 4.4, reviews: 7850, sales: '12000+ bought in past month', badge: 'HOT',
    category: 'groceries', brand: 'Bingo',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    stock: 800, gstRate: 5.0, isDeal: false, isNew: false
  },
  {
    title: 'Britannia Good Day Cashew Cookies - 600g Value Pack',
    description: 'Britannia Good Day Cashew Cookies are rich butter cookies loaded with real cashew pieces. Golden baked with a buttery aroma. 600g value pack — great for sharing and gifting. Loved by all ages.',
    price: 155.00, originalPrice: 185.00, discount: '16% OFF',
    rating: 4.6, reviews: 18400, sales: '30000+ bought in past month', badge: 'SALE',
    category: 'groceries', brand: 'Britannia',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    stock: 700, gstRate: 5.0, isDeal: true, isNew: false
  },
  {
    title: 'Britannia Good Day Butter Cookies - 200g Pack of 4',
    description: 'Britannia Good Day Butter Cookies — classic golden buttery biscuits with crumble texture. Made with real butter and zero trans fats. Pack of 4 x 200g. A perfect tea-time snack.',
    price: 80.00, originalPrice: 100.00, discount: '20% OFF',
    rating: 4.5, reviews: 9800, sales: '18000+ bought in past month', badge: 'SALE',
    category: 'groceries', brand: 'Britannia',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    stock: 650, gstRate: 5.0, isDeal: true, isNew: false
  },
  {
    title: "Haldiram's Aloo Bhujia Namkeen - 1kg",
    description: "Haldiram's Aloo Bhujia Namkeen — the OG Indian snack! Made from potato and besan with authentic spice blend. Crispy, crunchy and packed with flavour. 1kg bulk pack. No artificial colours. Perfect for snacking and cooking.",
    price: 189.00, originalPrice: 220.00, discount: '14% OFF',
    rating: 4.7, reviews: 25600, sales: '40000+ bought in past month', badge: 'HOT',
    category: 'groceries', brand: 'Haldiram',
    imageUrl: 'https://images.unsplash.com/photo-1619221882266-5d1b38a6c68e?auto=format&fit=crop&w=600&q=80',
    stock: 900, gstRate: 5.0, isDeal: true, isNew: false
  },
  {
    title: "Haldiram's Mixture Namkeen - 400g",
    description: "Haldiram's Mixture namkeen is a classic blend of sev, boondi, chana dal, and dry fruits. Lightly spiced with Indian herbs. 400g pack. Made with fresh ingredients and zero trans fats. A timeless Indian snack.",
    price: 89.00, originalPrice: 105.00, discount: '15% OFF',
    rating: 4.6, reviews: 14200, sales: '22000+ bought in past month', badge: 'SALE',
    category: 'groceries', brand: 'Haldiram',
    imageUrl: 'https://images.unsplash.com/photo-1619221882266-5d1b38a6c68e?auto=format&fit=crop&w=600&q=80',
    stock: 750, gstRate: 5.0, isDeal: false, isNew: false
  },
  {
    title: "Haldiram's Moong Dal Namkeen - 200g Pack of 4",
    description: "Haldiram's crispy moong dal namkeen seasoned with light spices and salt. Made from premium yellow lentils, deep fried to perfection. 200g x 4 packs. Rich in protein. Great with tea or as a standalone snack.",
    price: 149.00, originalPrice: 180.00, discount: '17% OFF',
    rating: 4.5, reviews: 8900, sales: '14000+ bought in past month', badge: 'SALE',
    category: 'groceries', brand: 'Haldiram',
    imageUrl: 'https://images.unsplash.com/photo-1619221882266-5d1b38a6c68e?auto=format&fit=crop&w=600&q=80',
    stock: 600, gstRate: 5.0, isDeal: true, isNew: false
  },
  // HEALTH / MEDICINES
  {
    title: 'i-Pill Emergency Contraceptive Pill - Pack of 1',
    description: 'i-Pill Emergency Contraceptive contains levonorgestrel 1.5mg. Take within 72 hours of unprotected sex for maximum effectiveness. Single tablet per pack. NOT for regular contraception or abortion. Consult your doctor.',
    price: 99.00, originalPrice: 110.00, discount: '10% OFF',
    rating: 4.1, reviews: 6200, sales: '9000+ bought in past month', badge: 'SALE',
    category: 'health', brand: 'i-Pill',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    stock: 300, gstRate: 12.0, isDeal: false, isNew: false
  },
  {
    title: 'Prega News Pregnancy Test Card - Pack of 2',
    description: "Prega News is India's most trusted pregnancy test card. Early detection from the first day of missed period. Results in 3 minutes. 99%+ accuracy. 2 cards in one pack. Easy to use, no prescription required.",
    price: 55.00, originalPrice: 70.00, discount: '21% OFF',
    rating: 4.5, reviews: 14500, sales: '25000+ bought in past month', badge: 'HOT',
    category: 'health', brand: 'Prega News',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    stock: 500, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'ClearBlue Digital Pregnancy Test - Pack of 2',
    description: 'ClearBlue Digital Pregnancy Test shows result in words - Pregnant or Not Pregnant. No confusing lines. Early pregnancy detection 5 days before missed period. 99% accurate. Pack of 2 tests.',
    price: 379.00, originalPrice: 480.00, discount: '21% OFF',
    rating: 4.6, reviews: 4200, sales: '6000+ bought in past month', badge: 'SALE',
    category: 'health', brand: 'Clearblue',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    stock: 200, gstRate: 12.0, isDeal: false, isNew: false
  },
  {
    title: 'Dettol Antiseptic Liquid - 500ml',
    description: 'Dettol Antiseptic Liquid for first aid and hygiene. Kills 99.9% of germs. Use diluted for wound cleansing, bathing and surface disinfection. 500ml bottle. The trusted health protection brand since 1932.',
    price: 185.00, originalPrice: 210.00, discount: '12% OFF',
    rating: 4.7, reviews: 38200, sales: '60000+ bought in past month', badge: 'HOT',
    category: 'health', brand: 'Dettol',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    stock: 1000, gstRate: 18.0, isDeal: true, isNew: false
  },
  {
    title: 'Disprin Regular Tablets - 100 Tablets',
    description: 'Disprin Regular aspirin 350mg effervescent tablets for fast, effective pain relief. Works for headache, cold and flu, toothache, and muscular pain. 100 tablets. Dissolves in water for quick absorption.',
    price: 89.00, originalPrice: 100.00, discount: '11% OFF',
    rating: 4.4, reviews: 12000, sales: '18000+ bought in past month', badge: 'SALE',
    category: 'health', brand: 'Disprin',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=600&q=80',
    stock: 600, gstRate: 12.0, isDeal: false, isNew: false
  },
  {
    title: 'Vicks VapoRub Ointment - 50ml',
    description: 'Vicks VapoRub is a medicated ointment for temporary relief from nasal congestion, cough, minor aches. Contains camphor, menthol, eucalyptus oil. Apply on chest, throat, and back. 50ml jar. Trusted for generations.',
    price: 145.00, originalPrice: 165.00, discount: '12% OFF',
    rating: 4.6, reviews: 22400, sales: '35000+ bought in past month', badge: 'HOT',
    category: 'health', brand: 'Vicks',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=600&q=80',
    stock: 800, gstRate: 12.0, isDeal: true, isNew: false
  },
  // STATIONERY
  {
    title: 'Classmate Pulse Single Line Notebooks - Pack of 6',
    description: 'Classmate Pulse single line notebooks for school and college. 172 pages with clean ruled lines and thick cream-white paper. Spiral binding for flat writing. Pack of 6 notebooks. Durable cover with vibrant prints.',
    price: 180.00, originalPrice: 240.00, discount: '25% OFF',
    rating: 4.5, reviews: 18900, sales: '30000+ bought in past month', badge: 'SALE',
    category: 'stationery', brand: 'Classmate',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    stock: 600, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Navneet Youva A4 Ruled Notebooks - Pack of 4',
    description: 'Navneet Youva A4 ruled notebooks with super-white paper and clean printing. 192 pages, 80 GSM paper for no ink bleed. Sewn binding for durability. Pack of 4. Ideal for college notes, assignments and journaling.',
    price: 220.00, originalPrice: 280.00, discount: '21% OFF',
    rating: 4.4, reviews: 9200, sales: '14000+ bought in past month', badge: 'SALE',
    category: 'stationery', brand: 'Navneet',
    imageUrl: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=600&q=80',
    stock: 450, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Reynolds 045 Fine Ball Pen - Box of 20 Blue',
    description: "Reynolds 045 Fine Carbure ballpoint pen — India's favourite blue pen. Smooth writing, consistent ink flow. 0.45mm tip for fine writing. Box of 20 pens. Comfortable grip, long-lasting barrel. Ideal for school and office.",
    price: 85.00, originalPrice: 110.00, discount: '23% OFF',
    rating: 4.5, reviews: 32100, sales: '50000+ bought in past month', badge: 'HOT',
    category: 'stationery', brand: 'Reynolds',
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
    stock: 800, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Cello Gripper Gel Pen - Pack of 10 Black and Blue',
    description: 'Cello Gripper Gel Pens with non-slip rubber grip for comfortable long writing sessions. Smooth gel ink for clean, smear-free writing. 0.6mm tip. Pack of 10 — 5 black plus 5 blue. Refillable design.',
    price: 120.00, originalPrice: 160.00, discount: '25% OFF',
    rating: 4.3, reviews: 12500, sales: '18000+ bought in past month', badge: 'SALE',
    category: 'stationery', brand: 'Cello',
    imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
    stock: 500, gstRate: 12.0, isDeal: false, isNew: false
  },
  {
    title: 'Atomic Habits by James Clear - Paperback',
    description: 'Atomic Habits by James Clear — the No.1 New York Times bestseller on building good habits and breaking bad ones. Practical framework based on 1% improvements. 320 pages, English paperback. Must-read for self improvement.',
    price: 399.00, originalPrice: 599.00, discount: '33% OFF',
    rating: 4.8, reviews: 89000, sales: '120000+ bought in past month', badge: 'HOT',
    category: 'stationery', brand: 'Penguin',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    stock: 1000, gstRate: 0.0, isDeal: true, isNew: false
  },
  {
    title: 'Rich Dad Poor Dad by Robert Kiyosaki - Paperback',
    description: 'Rich Dad Poor Dad by Robert Kiyosaki — the bestselling personal finance book of all time. Teaches financial literacy, investing, and building wealth. 336 pages English paperback. A must-have in every household.',
    price: 290.00, originalPrice: 399.00, discount: '27% OFF',
    rating: 4.7, reviews: 64000, sales: '85000+ bought in past month', badge: 'HOT',
    category: 'stationery', brand: 'Plata',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    stock: 900, gstRate: 0.0, isDeal: true, isNew: false
  },
  {
    title: 'The Alchemist by Paulo Coelho - Paperback',
    description: 'The Alchemist by Paulo Coelho — a magical tale about following your dreams and listening to your heart. 197 pages, English paperback. One of the most translated books in history. Timeless wisdom in a beautiful story.',
    price: 199.00, originalPrice: 299.00, discount: '33% OFF',
    rating: 4.7, reviews: 78000, sales: '100000+ bought in past month', badge: 'HOT',
    category: 'stationery', brand: 'HarperCollins',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    stock: 1000, gstRate: 0.0, isDeal: true, isNew: false
  },
  {
    title: 'NCERT Mathematics Textbook Class 10 - Latest Edition',
    description: 'NCERT Mathematics Class 10 textbook — official curriculum book for CBSE board students. Covers Real Numbers, Polynomials, Triangles, Trigonometry, Statistics, Probability, and more. Latest 2025 edition.',
    price: 65.00, originalPrice: 75.00, discount: '13% OFF',
    rating: 4.6, reviews: 45000, sales: '70000+ bought in past month', badge: 'SALE',
    category: 'stationery', brand: 'NCERT',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80',
    stock: 2000, gstRate: 0.0, isDeal: false, isNew: false
  },
  {
    title: 'Faber-Castell 12 Classic Colour Pencils Set',
    description: 'Faber-Castell 12 Classic colour pencils with high-quality pigments for vibrant, consistent colour. Break-resistant lead for long use. Smooth laydown and easy to blend. Ideal for children and adults. Hexagonal barrel for non-roll grip.',
    price: 89.00, originalPrice: 120.00, discount: '26% OFF',
    rating: 4.6, reviews: 22000, sales: '35000+ bought in past month', badge: 'SALE',
    category: 'stationery', brand: 'Faber-Castell',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    stock: 700, gstRate: 12.0, isDeal: true, isNew: false
  },
  {
    title: 'Staedtler Mars Lumograph Pencil Set - 12 Grades',
    description: 'Staedtler Mars Lumograph professional drawing pencils — 12 grades from 6H to 6B. Superior break-resistant leads for technical drawing, sketching, and illustration. Smooth, consistent lines. Used by professionals and students worldwide.',
    price: 549.00, originalPrice: 750.00, discount: '27% OFF',
    rating: 4.8, reviews: 8900, sales: '12000+ bought in past month', badge: 'NEW',
    category: 'stationery', brand: 'Staedtler',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    stock: 300, gstRate: 12.0, isDeal: false, isNew: true
  }
];

async function seed() {
  try {
    console.log('[Seeder] Syncing schemas...');
    await sequelize.sync({ alter: true });
    console.log('[Seeder] Seeding ' + newProducts.length + ' new products...');
    let added = 0, updated = 0;
    for (const item of newProducts) {
      const [prod, created] = await Product.findOrCreate({ where: { title: item.title }, defaults: item });
      if (!created) { await prod.update(item); updated++; } else { added++; }
    }
    console.log('[Seeder] Done! Added: ' + added + ', Updated: ' + updated);
    process.exit(0);
  } catch (err) {
    console.error('[Seeder] Failed:', err);
    process.exit(1);
  }
}
seed();
