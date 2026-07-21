const sequelize = require('./config/database');
const Product = require('./models/Product');

const gstRates = {
  groceries: 5.0,
  fashion: 5.0,
  shoes: 5.0,
  beauty: 5.0,
  sports: 5.0,
  electronics: 18.0,
  gadgets: 18.0,
  'home-kitchen': 18.0,
};

async function setGstRates() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Note: If the gstRate column doesn't exist yet, we might need to sync.
    // We will do alter: true to safely add the column without dropping data
    await sequelize.sync({ alter: true });
    console.log('Database synced (altered).');

    for (const [category, rate] of Object.entries(gstRates)) {
      const [updatedRows] = await Product.update(
        { gstRate: rate },
        { where: { category: category } }
      );
      console.log(`Updated ${updatedRows} products in category '${category}' with GST ${rate}%.`);
    }

    console.log('Successfully applied GST rates based on 2026 data!');
    process.exit(0);
  } catch (err) {
    console.error('Error applying GST rates:', err);
    process.exit(1);
  }
}

setGstRates();
