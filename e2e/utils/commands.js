import 'cypress-xpath';

/**
 * Validates that the trimmed inner text of elements found by a selector matches an expected list of strings.
 * This command uses `cy.xpath` to locate elements.
 *
 * @param {string} selector - The XPath selector to find the elements.
 * @param {string[]} expectedList - An array of strings representing the expected trimmed inner text for each element.
 */
Cypress.Commands.add('validateInnerText', (selector, expectedList) => {
  cy.xpath(selector).then(($elements) => {
    // Map the jQuery elements to an array of their trimmed innerText content.
    const actualList = [...$elements].map(el => el.innerText.trim());
    expect(actualList).to.deep.eq(expectedList);
  });
});