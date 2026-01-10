describe('Habit Tracker E2E', () => {
  beforeEach(() => {
    // Clear localStorage before each test to start fresh
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit('/');
  });

  it('should create a new habit and show it on the home page', () => {
    // Navigate to create habit page
    cy.contains('+ New Habit').click();
    cy.url().should('include', '/habits');

    // Fill the form
    cy.get('input[placeholder*="e.g. Read"]').type('Cypress Test Habit');
    cy.contains('Daily').click();
    cy.contains('Create Habit').click();

    // Should redirect to home and show the new habit
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Cypress Test Habit').should('be.visible');
    cy.contains('🔥 0 day streak').should('be.visible');
  });

  it('should toggle habit completion and increment streak', () => {
    // Create a habit first
    cy.contains('+ New Habit').click();
    cy.get('input[placeholder*="e.g. Read"]').type('Toggle Habit');
    cy.contains('Create Habit').click();

    // The toggle button should exist
    cy.get('[data-testid="habit-toggle"]').should('be.visible');
    
    // Check that it doesn't have the checkmark yet
    cy.get('[data-testid="habit-toggle"]').should('not.contain', '✓');
    
    // Click the toggle button
    cy.get('[data-testid="habit-toggle"]').click();

    // Should show checkmark and increment streak
    cy.contains('✓').should('be.visible');
    cy.contains('🔥 1 day streak').should('be.visible');

    // Toggle off
    cy.get('[data-testid="habit-toggle"]').click();
    cy.contains('✓').should('not.exist');
    cy.contains('🔥 0 day streak').should('be.visible');
  });
});
