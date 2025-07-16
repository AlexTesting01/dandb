describe('Amazon Customer Service Test', () => {
  it('should navigate to Customer Service and track package', () => {
    cy.visit('https://www.amazon.com');

    cy.contains('Customer Service').click();
    cy.url().should('include', '/gp/help/customer');

    cy.get('#helpsearch').type('Where is my stuff{enter}');

    cy.contains('Track your package').click();
    cy.url().should('include', '/gp/help/customer/display.html');
  });
});