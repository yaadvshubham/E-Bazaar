const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('file:///C:/Users/yaadv/OneDrive/Desktop/E-Bazaar/Frontend/deals.html', { waitUntil: 'networkidle0' });
    const content = await page.$eval('#tech-deals-grid', el => el.innerHTML);
    console.log('HTML CONTENT LENGTH:', content.length);
    
    await browser.close();
  } catch (e) {
    console.log('Test Error:', e);
  }
})();
