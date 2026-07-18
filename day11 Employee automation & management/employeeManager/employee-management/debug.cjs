const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`[BROWSER ERROR] ${error.message}`);
    });

    // We need to set localStorage to be logged in as admin
    await page.goto('http://localhost:5173/admin-login');
    
    // Evaluate to set localStorage
    await page.evaluate(() => {
      const userSession = {
        username: "admin",
        email: "admin@company.com",
        role: "admin",
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("userSession", JSON.stringify(userSession));
    });
    
    await page.goto('http://localhost:5173/admin-dashboard');
    
    // Wait a bit for the page to load and errors to pop up
    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
