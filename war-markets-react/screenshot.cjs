const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the server to be up
    let retries = 5;
    while (retries > 0) {
      try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
        break;
      } catch (e) {
        retries--;
        if (retries === 0) throw e;
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // Click on "Fiscal Impact"
    await page.getByText('Fiscal Impact').click();
    
    // Wait for a bit for chart animations if any
    await page.waitForTimeout(1000);
    
    // Take a screenshot
    await page.screenshot({ path: 'fiscal-impact.png', fullPage: true });
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();