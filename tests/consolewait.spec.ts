import { test, expect } from '@playwright/test'

test('listen for console message', async ({ page }) => {

    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/')

    page.on('console', (msg) => { //onging event listener - consider using .once if this is an event that shoould only be listened for once
        console.log(`The message was ${msg.text()}`) //will run each time the browser console has an event
    })

    await page.waitForTimeout(30000)

});

test('wait for console message before continuing', async ({ page }) => {

    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/')


    await page.waitForEvent('console', { //will wait here until the specific console message is found (or the wait times out)
        predicate: (message) => message.text().includes('hi'),
        timeout: 15000,
    }); //Now do a console.log('hi') in the browser dev tools to continue. Any other message will be ignored.

    await page.goto('https://www.google.com')
    await page.waitForTimeout(10000)

});