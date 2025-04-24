// =============================================================================
// CSV upload flow
// =============================================================================
// It covers the process from admin registration to quiz creation via CSV import
// and finally verifies the game can be started and reaches the player lobby.
// The test ensures that the an admin user journey works as expected when they want to
// upload a CSV file.

window.describe("CSV upload flow", () => {
  // Create a unique admin email each time the test runs
  const adminEmail = `jason+${Date.now()}@example.com`;
  const adminPassword = "BigMarnJason!";

  // -------------------------------------------------------------------------
  // SECTION 1: Admin Registration Process
  // -------------------------------------------------------------------------
  // Basic smoke test to ensure the application loads properly
  window.it("website loads", () => {
    window.cy.visit("http://localhost:3000");
  });

  window.it("creates a game and tests player flow", () => {
    window.cy.viewport("macbook-15");
    window.cy.visit("http://localhost:3000");

    // 1. Register a new admin account
    window.cy.contains("a", "Sign up").should("be.visible").click();
    window.cy
      .get("input[name=name]")
      .should("be.visible")
      .focus()
      .type("Admin User");
    window.cy
      .get("input[name=email]")
      .should("be.visible")
      .focus()
      .type(adminEmail);
    window.cy
      .get("input[name=password]")
      .should("be.visible")
      .focus()
      .type(adminPassword);
    window.cy.get("input[name=confirmPassword]").type(adminPassword);
    window.cy.get('button[type="submit"]').click();

    // Verify we reach the dashboard
    window.cy.url().should("include", "/dashboard");
    window.cy.contains("My Games").should("be.visible");

    // -------------------------------------------------------------------------
    // SECTION 2: Quiz Creation Using CSV Import
    // -------------------------------------------------------------------------
    // Wait for the dashboard to fully load before proceeding
    window.cy.wait(1000);

    // Verify and click the create game button
    window.cy.contains("Create your first game").should("be.visible");
    window.cy.contains("Create your first game").click();

    // Confirm navigation to the quiz creation page
    window.cy.url().should("eq", "http://localhost:3000/quiz/create");

    // Select the CSV import option for quiz creation
    window.cy.contains("CSV Import").click();

    // b. Use the Cypress fixture to upload the testing1.csv file
    window.cy
      .get("#csv-file-selector")
      .selectFile("cypress/fixtures/testing1.csv", { force: true });

    // Upload the test CSV file from fixtures folder
    window.cy.wait(1000);
    window.cy.get("#csv-import").click();

    // -------------------------------------------------------------------------
    // SECTION 3: Verification of Quiz Creation
    // -------------------------------------------------------------------------
    // Allow time for the import to complete and redirect    window.cy.wait(1000);
    window.cy.url().should("include", "/dashboard");
    // Check that we can play the game
    window.cy.contains("Play").should("be.visible");

    // Check that the quiz metadata is correctly displayed
    // This confirms the CSV was properly parsed and questions were added
    window.cy.contains("5").should("be.visible");
    window.cy.contains("2 mins, 40 secs").should("be.visible");

    // -------------------------------------------------------------------------
    // SECTION 4: Game Initiation Process
    // -------------------------------------------------------------------------
    // Start the game as an admin to prepare for players to join
    window.cy.contains("button", "Play").click();
    // Check that we can continue to the game lobby
    window.cy.contains("Continue").should("be.visible");

    window.cy.contains("button", "Continue").click();
    // Check that we are on the lobby screen
    window.cy.contains("Waiting for players...").should("be.visible");
  });
});
