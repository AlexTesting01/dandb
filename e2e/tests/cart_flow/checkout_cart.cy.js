import {
  TEST_PASSWORD,
  TEST_USER,
  TEST_ITEMS,
} from "../../common/test_config.js";
import {
  APP_EMAIL_PASSWORD,
  APP_EMAIL_USER,
  PROCEESD_CHECKOUT,
} from "./helpers/cart_selectors.js";

it("verify checkout cart", () => {
  //checkout when user logout
  cy.get(PROCEESD_CHECKOUT).click();
  cy.contains("Sign in or create account").should("be.visible");

  //login
  cy.get(APP_EMAIL_USER).type(TEST_USER, { delay: 100 });
  cy.get("#continue").click();
  cy.get(APP_EMAIL_PASSWORD).type(TEST_PASSWORD, { delay: 100 });
  cy.get("#signInSubmit").click();

  //verify check out form is available
  cy.contains("Add a new delivery address").should("be.visible");

  //verify all items exists in the cart when user login
  cy.get("#nav-checkout-cart-icon").click();
  cy.wait(3000);
  TEST_ITEMS.forEach((item) => {
    cy.contains(item).should("exist");
  });
});
