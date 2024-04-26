//File created by playwright extention Test>Record New
//feel free to rename 'test-1' to something more appropriate
//but 'spec.ts' should be kept as this indicates this a Typescript file that contains tests.
import { test, expect } from '@playwright/test';
import { smoothDrag } from './helperfunctions/helperlib';

test('test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  await page.getByRole('searchbox', { name: 'Search for:' }).click();
  await page.getByRole('searchbox', { name: 'Search for:' }).fill('cap'); //Clears the text box before entering text *but* does not send actual key presses. Sometimes the page has JS that expects key presses (and wont get them with fill)
  //await page.getByRole('searchbox', { name: 'Search for:' }).pressSequentially('cap', {delay: 250}) //This *does* send key presses, and those key presses can have a pause between each. Should solve JS page problems.
  await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter'); //Send an enter key key press, can also send keyboard shortcusts e.g. 'Control+a'
  await page.getByRole('button', { name: /^Add to.*/ }).click(); //name could use a RexEx to find the element
  await page.locator('#content').getByRole('link', { name: 'View CART', exact: true }).click(); //Normally the string is a substring match and case insesitive, but you can make it look for an exact math. This step will fail with {exact: true}
  await page.getByLabel('Remove this item').click();

  //You can define a locator and then later use that locator...
  const returnBtn = page.getByRole('link', { name: 'Return to shop' })
  await returnBtn.click(); //...with an action. Only when the action is called is the element search performed.
  //Remember to 'await' the action. Note no await needed for const returnBtn = ... (but it wouldnt cause any issues either)

  //Once one element is found, you can chain on another search that will take place *inside* the first element.
  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();
});


test('all products', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = await page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual match logging the text
  };
  
});

test('drag drop slider', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/cssXPath.html')

  await page.locator('#apple').scrollIntoViewIfNeeded();
  //Dragging 'outside' of an element normally fails due to 'actionability' checks. force:true tells Playwright just to do the action skipping any checks.
  //await page.dragAndDrop('#slider a', '#slider a', {targetPosition: {x: 100, y:0}, force: true}) //While this moves the gripper it wont change the size of the apple - this is due to the JS on the page that does the resizing not firing properly for large movements

  //So instead do lots of little jumps. Just make sure that you 'jump' far enough to get 'outside' the gripper each time
  // await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  // await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  // await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  // await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  //We should probably write a custom function for this 'lots of little jumps' drag and drop...
  await smoothDrag(page, '#slider a', 200, 5);

})



