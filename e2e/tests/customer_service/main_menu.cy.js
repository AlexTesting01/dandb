import { openPage } from "../utils/functionals.js";
import { MAIN_MENU_ITEMS, URL } from "../common/test_config.js";
import "../utils/commands.js";

describe("Amazon Main Menu Test", () => {
  beforeEach(() => {
    openPage(URL);
  });

  it("validates main menu items on homepage", () => {
    // Validates the text content of main menu items on the homepage.
    cy.validateInnerText(
      "//*[@class='nav-progressive-content']//a[contains(@class,'nav-a')]",
      MAIN_MENU_ITEMS
    );
  });
});
