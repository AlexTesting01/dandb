describe('Amazon Cart Management Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.amazon.com');

    // Add Pencil Sharpener
    cy.get('#twotabsearchtextbox').type('Bostitch Personal Electric Pencil Sharpener{enter}');
    cy.contains('Bostitch Personal Electric Pencil Sharpener').first().click();
    cy.get('#add-to-cart-button').click();
    cy.contains('Added to Cart').should('be.visible');

    // Add Scissors
    cy.visit('https://www.amazon.com/Scissors-iBayam-Crafting-Scrapbooking-Knitting/dp/B07H3QKN2Z');
    cy.contains('Yellow, Grey, Blue').click();
    cy.get('#add-to-cart-button').click();
    cy.contains('Added to Cart').should('be.visible');
  });

  afterEach(() => {
    // Cleanup: Clear cart (Amazon uses dynamic cart URLs, pseudo-code follows)
    cy.visit('https://www.amazon.com/gp/cart/view.html');
    cy.get('.sc-action-delete input').each(($btn) => cy.wrap($btn).click());
    cy.contains('Your Amazon Cart is empty').should('be.visible');
  });

  it('should verify both products are in the cart and free shipping after adding more items', () => {
    cy.visit('https://www.amazon.com/gp/cart/view.html');
    cy.contains('Bostitch').should('exist');
    cy.contains('Scissors').should('exist');

    // Increase quantity of pencil sharpeners to 4 total
    cy.get('.sc-list-item').contains('Bostitch').parent().within(() => {
      cy.get('select[name="quantity"]').select('4');
    });

    cy.contains('FREE Shipping').should('exist');
  });
});
