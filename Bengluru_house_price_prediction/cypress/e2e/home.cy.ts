// This is a basic End-to-End test to ensure the application loads and navigating works
describe('BangaloreHomes App', () => {
  it('successfully loads the home page', () => {
    cy.visit('/');
    cy.contains('BangaloreHomes');
  });
});
