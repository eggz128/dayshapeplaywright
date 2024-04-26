import {test, expect} from '@playwright/test' //imports playwright code for our use. ES6 style module import.

test('My First Test', async ({page})=>{ //A test. 1st arg is the test name. 2nd arg is a call back function with the test code
    //Test code goes here
    await page.goto('webdriver2/'); //All playwright code executes "in the future" when a browser is avalable. 
    //You need to 'await' each statements completion before moving on to the next step.
    //Without 'await'ing each line this whole test could 'execute' to completion before the browser has even finished launching.

    //Steps recorded via Playwright extention
    //Place cursor in test() block then Tests>(PLAYWRIGHT)Record at cursor
    await page.goto('about:blank');
    await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
    await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
    await page.locator('#password').click();
    await page.locator('#password').fill('edgewords123');
    await page.getByRole('link', { name: 'Submit' }).click();

    //await page.close(); //Not necessary to close the web browser after a test has finished.
    //The browser can be safely reused by other tests without 'cross talk' e.g. cookies persisting. 
    //Playwright Test will automatically establish a new test 'Context' the next time the existing browser is used.
})

//Recording at cursor when outside the test callback function will break the test file
//await page.getByRole('link', { name: 'Login To Restricted Area' }).click();

