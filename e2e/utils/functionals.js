

const SEARCH_BAR_SELECTOR = '#twotabsearchtextbox'; // Common Amazon search bar ID
const MAIN_MENU_SELECTOR = '#nav-main';             // Common Amazon main navigation bar ID

/**
 * Visits a URL and reloads the page until key elements (search bar and main menu) are visible.
 *
 * @param {string} url - The URL to visit.
 * @param {number} [maxAttempts=5] - Maximum number of reload attempts.
 */
export const openPage = (url, maxAttempts = 5) => {
  let attempt = 1;

  const checkAndReload = () => {
    cy.log(`Attempt ${attempt} to load page correctly.`);

    // Check for the existence of critical elements first without failing immediately
    // Use a short timeout for 'body' or the initial element, as we'll retry on visibility.
    cy.get('body', { timeout: 5000 }).then(($body) => {
      const searchBarExists = $body.find(SEARCH_BAR_SELECTOR).length > 0;
      const mainMenuExists = $body.find(MAIN_MENU_SELECTOR).length > 0;

      if (searchBarExists && mainMenuExists) {
        // If elements exist, now wait for them to be visible and actionable.
        cy.get(SEARCH_BAR_SELECTOR, { timeout: 10000 }) 
          .should('be.visible')
          .and('not.be.disabled');

        cy.get(MAIN_MENU_SELECTOR, { timeout: 10000 })
          .should('be.visible');

        cy.log(`Page loaded successfully after ${attempt} attempt(s).`);
        // Test execution will continue from here.
      } else {
        // Elements are not yet present/found
        if (attempt < maxAttempts) {
          attempt++;
          cy.log(`Page not fully loaded (missing search bar/main menu). Reloading...`);
          cy.wait(2000); // Wait a bit before reloading to give the page a chance to settle or for network to recover
          cy.reload({ cache: false }); // Perform a hard reload to get a fresh page load
          checkAndReload(); // Recurse: call the function again for the next attempt
        } else {
          // Max attempts reached, throw an error to fail the test
          throw new Error(`Page did not load correctly (missing search bar/main menu) after ${maxAttempts} attempts. Last URL: ${url}`);
        }
      }
    });
  };

  // Initial visit to the URL
  cy.visit(url);
  // Start the check and reload loop
  checkAndReload();
};


/**
 * Clicks on a main navigation menu item identified by its text content within the "#nav-main" element.
 *
 * @param {string} menuName - The text content of the menu item to click.
 */
export const openMainMenuItem = (menuName) => {
  cy.get("#nav-main").contains(menuName).click();
};

/**
 * Validates that all provided items are visible within a specified parent element.
 *
 * @param {string|JQuery<HTMLElement>} element - A CSS selector or a JQuery element representing the parent container.
 * @param {string[]} itemsList - An array of strings, each being the text content of an item expected to be visible.
 */
export const validateListItemsVisibility = (element, itemsList) => {
  itemsList.forEach((item) => {
    // Finds the item by text within the parent element and asserts its visibility.
    cy.contains(element ,item).should('be.visible');
  });
};

/**
 * Clicks on elements matching a selector repeatedly until no such elements are found in the DOM.
 * Useful for dismissing dynamic pop-ups or clearing lists.
 *
 * @param {string} selector - The CSS selector of the element(s) to click.
 */
export const clickUntilGone = (selector) => {
  cy.get("body").then(($body) => {
    // Check if any element matching the selector exists in the DOM.
    if ($body.find(selector).length > 0) {
      cy.get(selector).first().click({ force: true });
      cy.wait(500);
      clickUntilGone(selector); // Recursive call to continue clicking until no more elements are found.
    }
  });
};

/**
 * Takes a screenshot of the first element matching the selector, saves it temporarily,
 * and then compares it against a baseline image using a custom Node.js task.
 * This function allows for configurable comparison thresholds and acceptable pixel difference counts.
 *
 * @param {string} selector - The CSS selector for the element to screenshot.
 * @param {string} fileName - The base name for the screenshot and comparison files (e.g., 'homepage-hero').
 * @param {string} folderName - A subfolder name used for organizing the actual, expected, and diff screenshot files within the configured screenshot directories.
 * @param {number} diffCount - The maximum number of differing pixels allowed for the screenshot comparison to pass.
 * @param {number} threshold - The pixelmatch comparison threshold (a value between 0 and 1, where lower is stricter) used in the Node.js task.
 */
export const compareScreenshots = (selector, fileName, folderName, diffCount, threshold) => {
  cy.get(selector).first().screenshot(`actual/${fileName}-actual`).then(() => {
    cy.task('compareScreenshotsTask', { fileName, folderName, threshold }).then((diffPixels) => {
      // Assert that the number of differing pixels is below a predefined threshold.
      expect(diffPixels, `Screenshot comparison failed: ${diffPixels} pixels differ expected: ${diffCount} pixels.`)
        .to.be.lessThan(diffCount);
    });
  });
};