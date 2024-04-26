import { test, expect } from '@playwright/test'

test.beforeEach(async ({page})=>{
    await page.goto('/')
    console.log('Runs before each test')
})
test.afterEach(async ({page})=>{
    console.log('Runs after each test')
})
test.beforeAll(async ({page})=>{
    console.log('Runs once at start of test file')
    
})
test.afterAll(async ({page})=>{
    console.log('Runs once after all tests in file have completed')
})

test.describe('group 1', () => {
    test.setTimeout(10000);
    test("Assertion demos", async ({ page, actionTimeout, }) => {
        const defaultTimeout = actionTimeout //Store the project action timeout
        await page.pause()
        page.setDefaultTimeout(5000); //Chnage Action timeout for this test
        await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");

        await expect(page).toHaveURL(/.*forms\.html/) //Check we are on correct page

        await page.locator('#textInput').fill("Hello world");
        await page.locator('#checkbox').click({ timeout: 10000 }) //Override action timeout for this step

        page.setDefaultTimeout(defaultTimeout); //Restore project default timeout for rest of steps?

        await page.waitForSelector('#textInput', { state: "visible" });

        const heading = page.locator('#right-column > h1');
        await expect(heading).toContainText("For");
        //await expect(heading).toHaveText("For"); //Fails as "For" is not the exact text

        //Override timeout for just one step
        //await expect(heading).toHaveText("For", {timeout: 10000}); //Override default assertion timeout of 5s with 10s (10000ms)

        //Where you have multiple assertions that need a longer timeout, you can create a 'slow' expect
        const slowExpect = expect.configure({ timeout: 10000 });

        //await slowExpect.soft(heading).toHaveText("For"); //Soft assertions allow execution to continue after failiure

        //Try/catch can be used in PW Tests (as long as you await) - cannot by used in Cypress tests
        try {
            await slowExpect(heading).toHaveText("For");
        } catch (error) {
            //If we do nothing, exection will contine and the test will pass even if the tried expect has failed
            //test.info().status = 'failed' //Makes the test report as fail. 
        } //While you /can/ ty/catch - Just use a soft assert!

        // await slowExpect(heading).toHaveText(/For.*/); //Passes using this RegEx


        //Negate assertions with .not
        // await expect(page.locator('#checkbox')).not.toBeChecked();


        //Image validation
        //1st run will capture browser and os specific images
        //2nd run will compare against previously captured images.

        await expect(page).toHaveScreenshot('wholepage.png', { maxDiffPixels: 3000 });

        await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png', {
            maxDiffPixels: 3000,
            maxDiffPixelRatio: 0.1,
            threshold: 0.1,
        });

    })
    test.describe('inner group', ()=>{
        test("Capturing values", {tag: ['@RunMe', '@Smoke'], annotation: [{type: 'customtype', description: 'My annotation'}]}, async ({ page }) => {
            await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
    
            let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file
    
            console.log("The right column text is with textContent is: " + rightColText);
    
            rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)
    
            console.log("The right column text is with innertext is: " + rightColText);
    
            await page.pause();
    
    
            let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
            console.log("The text box contains" + textBoxText); //blank as <input> has no inner text
    
            //Using generic $eval to get the browser to return the INPUT text
            //This will *not* retry or wait
            textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
            console.log("The text box actually contains: " + textBoxText);
    
            // await page.$eval('#textInput', elm => {
            //     console.log(typeof(elm))
            // });
    
            expect(textBoxText).toBe("Hello world");
        });
    })
    
})


test("Generic methods", async ({ page }) => {

    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

    const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
    console.log(`There are ${menuLinks.length} links`)

    console.log("The link texts are:")

    for (const iterator of menuLinks) {
        console.log(iterator?.trim())
    }

    //Preferred - using retry-able Playwright locators
    const preferredLinks = await page.locator('#menu a').all();
    for (const elm of preferredLinks) {
        // const elmtext = await elm.textContent();
        // const elmtexttrimmed = elmtext?.trim();
        console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
    }
})

test("Waiting for a pop up window", async ({ page, context }) => {
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html")

    const [newPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
        context.waitForEvent('page'),
        page.locator("#right-column > a[onclick='return popUpWindow();']").click()
    ])



    await page.waitForTimeout(2000); //Thread.sleep(2000);


    const closeBtn = newPage.getByRole('link', { name: 'Close Window' }); //closes the newly opened popup //Not working in Firefox?
    await closeBtn.click();

    await page.getByRole('link', { name: 'Load Content' }).click();

})