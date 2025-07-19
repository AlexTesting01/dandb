import { URL, QUICK_SOLUTIONS } from "../../common/test_config.js";
import { openPage, openMainMenuItem, validateListItemsVisibility } from "../../utils/functionals.js";

describe("Amazon Customer Service - Track Package", () => {
  beforeEach(() => {
    openPage(URL);
    openMainMenuItem("Customer Service");
  });

  it('search "Where is my stuff", validate track package page', () => {
    // Validate that the customer service page is loaded
    cy.url().should("include", "/gp/help/customer");
    cy.contains("Welcome to Amazon Customer Service").should("be.visible");

    cy.get("#hubHelpSearchInput").type("Where is my stuff{enter}");
    cy.url().should("include", "/gp/help/customer/display.html");
    
    // Validate that the quick solutions are visible
    validateListItemsVisibility('p', QUICK_SOLUTIONS);
  });

});
