import { CART_URL, SCISSORS_URL } from "./helpers/cart_urls.js";
import "cypress-xpath";
import {
  SEARCH_INPUT,
  ADD_TO_CART_BUTTON,
  ADDED_TO_CART_TEXT,
  DELETE_BUTTONS,
  CART_COUNT,
  INCREASE_QUANTITY,
  YGB_COLOR_ITEM,
  CART_ITEM_IMAGE,
} from "./helpers/cart_selectors.js";
import { URL } from "../../common/test_config.js";
import {
  clickUntilGone,
  compareScreenshots,
  openPage,
} from "../../utils/functionals.js";
const SCREENSHOT_NAME = "cart_main_view";
const FIRST_ITEM =
  "Office Personal Electric Pencil Sharpener, Powerful Stall-Free Motor, High Capacity Shavings Tray, Blue";

// Prevent Amazon site errors from breaking Cypress tests
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe("Amazon Cart Management Suite", () => {
  beforeEach(() => {
    openPage(URL);

    // Add Pencil Sharpener
    cy.get(SEARCH_INPUT).type(FIRST_ITEM + "{enter}", {
      delay: 100,
    });
    cy.get("h2[aria-label*='" + FIRST_ITEM + "']")
      .first()
      .click();
    cy.get(ADD_TO_CART_BUTTON).click();
    cy.contains(ADDED_TO_CART_TEXT).should("exist");

    // Add Scissors
    cy.visit(SCISSORS_URL);
    cy.wait(3000); // wait for page to load
    cy.get("[data-action-type='DISMISS']").then(($el) => {
      if ($el.length) cy.wrap($el).click();
    });
    cy.xpath(YGB_COLOR_ITEM)
      .first()
      .click({ waitForAnimations: false })
      .then(() => {
        cy.wait(2000);
      });
    cy.get(ADD_TO_CART_BUTTON).click();
    cy.contains(ADDED_TO_CART_TEXT).should("exist");
  });

  afterEach(() => {
    cy.visit(CART_URL);
    cy.wait(3000);
    clickUntilGone(DELETE_BUTTONS);
    // Assert cart count should be 0 after cleanup
    cy.get(CART_COUNT, { timeout: 10000 })
      .invoke("text")
      .then((finalCount) => {
        expect(parseInt(finalCount)).to.eq(0);
      });
  });

  it("verify both products are in the cart", () => {
    cy.visit(CART_URL);
    cy.contains("Bostitch").should("exist");
    cy.contains("Scissors").should("exist");
  });

  it("verify cart content by screenshot comparing", () => {
    cy.visit(CART_URL);
    cy.wait(3000);

    let fileName = SCREENSHOT_NAME;
    let folderName = `${Cypress.spec.fileName}.js`;

    compareScreenshots(CART_ITEM_IMAGE, fileName, folderName, 500, 0.7);
  });

  it("verify free shipping available after adding more items", () => {
    cy.visit(CART_URL);
    // Set location to enable free shipping
    const location_code = "10001"; // Example ZIP code for free shipping
    cy.get("#nav-global-location-popover-link").click();
    cy.wait(2000);
    cy.get('[id*="ZipUpdateInput"]').type(location_code, { delay: 300 });
    cy.wait(2000);
    cy.get('[data-action*="PostalUpdateAction"]').click();
    cy.wait(3000);
    cy.get('[data-action*="ConfirmAction"]').last().click();

    // Verify free shipping not available initially
    cy.contains("get FREE delivery").should("be.visible");
    Cypress._.times(3, () => {
      cy.get(INCREASE_QUANTITY).eq(1).click();
      cy.wait(500);
    });
    // Verify free shipping available after adding more items
    cy.contains("Your order qualifies for FREE Shipping.").should("be.visible");
  });
});
