const sequelize = require('./config/database');
const Product = require('./models/Product');

async function seedAmazonData() {
    try {
        await sequelize.authenticate();
        console.log('Database authenticated successfully.');

        const url = 'https://real-time-amazon-data.p.rapidapi.com/search?query=smartphones&page=1&country=IN';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'afea48884dmshe70ce0668a6f33cp128d9ejsn9c10661b3c77',
                'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
            }
        };

        const response = await fetch(url, options);
        const json = await response.json();

        if (json.data && json.data.products) {
            for (const item of json.data.products) {
                const parsePrice = (priceStr) => {
                    if (!priceStr) return 0;
                    const match = priceStr.replace(/[^0-9.]/g, '');
                    return parseFloat(match) || 0;
                };

                const price = parsePrice(item.product_price);
                const originalPrice = parsePrice(item.product_original_price) || price;

                await Product.create({
                    category: 'smartphones',
                    brand: 'Amazon', 
                    title: item.product_title || 'Unknown Product',
                    price: price,
                    originalPrice: originalPrice,
                    discount: null,
                    rating: item.product_star_rating ? parseFloat(item.product_star_rating) : 4.0,
                    reviews: item.product_num_ratings ? parseInt(item.product_num_ratings) : 0,
                    sales: item.sales_volume || null,
                    badge: item.is_best_seller ? 'Bestseller' : null,
                    imageUrl: item.product_photo || null,
                    description: item.product_url || ''
                });
            }
            console.log('Products successfully appended to database.');
        } else {
            console.log('Failed to fetch products or invalid response format:', json);
        }
    } catch (error) {
        console.error('Error in seeder script:', error);
    } finally {
        process.exit();
    }
}

seedAmazonData();
