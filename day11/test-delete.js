const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Go to the app
  await page.goto('http://localhost:5173/');
  
  // Wait for login
  await page.waitForSelector('input#employeeId');
  await page.type('input#employeeId', 'admin');
  await page.type('input#password', 'admin123');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForSelector('.dashboard-title');
  
  // Go to Employee Management tab
  const tabs = await page.$$('.menu-item-btn');
  for (let tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text.includes('Employee Management')) {
      await tab.click();
      break;
    }
  }
  
  // Wait for search input
  await page.waitForSelector('input[placeholder="Search employee..."]');
  
  // Check how many Auto Testers there are before add
  const employeesBefore = await page.$$('.employee-card h3');
  let countBefore = 0;
  for (let h3 of employeesBefore) {
    const name = await page.evaluate(el => el.textContent, h3);
    if (name.includes('Auto Tester')) countBefore++;
  }
  console.log('Auto Testers before add:', countBefore);
  
  // Add Employee
  await page.type('input[name="name"]', 'Auto Tester');
  await page.type('input[name="email"]', 'autotester@mail.com');
  await page.type('input[name="phone"]', '9876543210');
  await page.type('input[name="designation"]', 'QA Automation Lead');
  await page.type('input[name="salary"]', '85000');
  await page.click('button[type="submit"].btn-signin');
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Check how many Auto Testers there are after add
  const employeesAfter = await page.$$('.employee-card h3');
  let countAfter = 0;
  for (let h3 of employeesAfter) {
    const name = await page.evaluate(el => el.textContent, h3);
    if (name.includes('Auto Tester')) countAfter++;
  }
  console.log('Auto Testers after add:', countAfter);
  
  // Search for Auto Tester
  await page.type('input[placeholder="Search employee..."]', 'Auto Tester');
  await new Promise(r => setTimeout(r, 1000));
  
  // Override window.confirm as selenium does
  await page.evaluate(() => {
    window.confirm = function() { return true; };
  });
  
  const deleteBtns = await page.$$('.delete-btn');
  if (deleteBtns.length > 0) {
    console.log('Found delete button, clicking...');
    await deleteBtns[0].click();
  } else {
    console.log('No delete button found!');
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Check if Auto Tester is still there
  const employeesFinal = await page.$$('.employee-card h3');
  let countFinal = 0;
  for (let h3 of employeesFinal) {
    const name = await page.evaluate(el => el.textContent, h3);
    if (name.includes('Auto Tester')) countFinal++;
  }
  console.log('Auto Testers after delete:', countFinal);
  
  await browser.close();
})();
