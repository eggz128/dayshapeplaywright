import { test, expect } from '@playwright/test';
import HomePOM from './POMClasses/homepagepom';
import LoginPOM from './POMClasses/loginpagepom';

test('test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('pomified', async({page, browserName})=>{
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');

  //We should be on Home page so init the HomePOM

  const HomePage = new HomePOM(page);
  await HomePage.goLogin();
  const LoginPage = new LoginPOM(page);
  await LoginPage.loginWithValidUsernamePassword('edgewords', 'edgewords123');

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html')
  await page.screenshot({path: './manualscreenshots/page-screenshot.png'});
  await page.screenshot({path: './manualscreenshots/whole-page-screenshot.png', fullPage: true});
  await page.locator('#htmlTable').screenshot({path: './manualscreenshots/htmltable.png', 
    mask: [page.locator('#TableVal2')],
    maskColor: 'rgba(214, 21, 179,0.5)',
    style: `#htmlTable tr:nth-child(3) {border: 10px solid red}
            table#htmlTable {border-collapse: collapse}
    ` //HTML table rows cannot have a border unless the table's border collapse model is set to collapse
  })
  if(browserName==='chromium' ){
    await page.pdf({path: './manualscreenshots/printed.pdf'})
  }
  



})

test('report attachments', {annotation: {type: 'Some custom type', description: "Some discription for the test"}},async({page, browserName}, testInfo)=>{
  
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html')
  await page.screenshot({path: './manualscreenshots/page-screenshot.png'});
  await testInfo.attach('Viewpoert screenshot', {path: './manualscreenshots/page-screenshot.png'})

  await testInfo.attach('Some text to attach', {
    contentType: 'text/plain',
    body: 'This is the attached text'
  })

  const screenshot = await page.screenshot({path: './manualscreenshots/whole-page-screenshot.png', fullPage: true});
  await testInfo.attach('Screenshot stored in memory', {
    contentType: 'image/png',
    body: screenshot
  });

  await page.locator('#htmlTable').screenshot({path: './manualscreenshots/htmltable.png', 
    mask: [page.locator('#TableVal2')],
    maskColor: 'rgba(214, 21, 179,0.5)',
    style: `#htmlTable tr:nth-child(3) {border: 10px solid red}
            table#htmlTable {border-collapse: collapse}
    ` //HTML table rows cannot have a border unless the table's border collapse model is set to collapse
  })




  if(browserName==='chromium' ){
    await page.pdf({path: './manualscreenshots/printed.pdf'})
  }
  



})