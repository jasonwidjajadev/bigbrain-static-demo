// =============================================================================
// Player Flow
// =============================================================================
// This test focuses on the player experience joining and participating in games,
// containing different features than those tested in the admin flow.

window.describe("Player Flow", () => {
  // Create a unique admin email each time the test runs
  const adminEmail = `jason+${Date.now()}@example.com`;
  const adminPassword = "BigMarnJason!";
  const playerName = "Jason";

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

    // 2. Create a new quiz
    window.cy.wait(1000);
    window.cy.contains("Create your first game").should("be.visible");
    window.cy.contains("Create your first game").click();
    window.cy.url().should("eq", "http://localhost:3000/quiz/create"); // still on same page

    // a. Import the CSV file
    window.cy.contains("CSV Import").click();

    // b. Use the Cypress fixture to upload the testing1.csv file
    window.cy
      .get("#csv-file-selector")
      .selectFile("cypress/fixtures/testing1.csv", { force: true });

    // c. Click the Import button
    window.cy.wait(1000);
    window.cy.get("#csv-import").click();

    // d. Verify the quiz was created successfully
    window.cy.url().should("include", "/dashboard");
    // Check that we can play the game
    window.cy.contains("Play").should("be.visible");

    // 3. Start the game
    // This might be a button like "Start Game" or similar
    window.cy.contains("button", "Play").click();

    // 4. Store the session ID or game code if needed
    // If your app displays a game code or session ID, capture it
    window.cy
      .contains("http://localhost:3000/join/")
      .invoke("text")
      .then((link) => {
        const sessionId = link.trim().split("/").pop();
        window.cy.log("Session ID from link:", sessionId);
        window.cy.wrap(sessionId).as("sessionId");
      });

    window.cy.contains("button", "Continue").click();

    // Store the admin control panel URL
    window.cy.url().then((adminControlUrl) => {
      window.cy.wrap(adminControlUrl).as("adminControlUrl");
    });

    // 5. Open a new game window to simulate a player joining
    window.cy.get("@sessionId").then((sessionId) => {
      // Open a new tab/window for the player
      window.cy.visit("http://localhost:3000/join");

      // Enter the session ID/game code
      window.cy.get("#sessionIdInput").type(sessionId);

      // Enter player name
      window.cy.get("#nickName").type(playerName);

      // Join the game
      window.cy.contains("button", "Join").click();

      // Verify the player has joined
      window.cy.contains("Waiting for host to Start ...").should("be.visible");

      // Save this URL for returning to the player view
      window.cy.url().then((playerUrl) => {
        window.cy.wrap(playerUrl).as("playerUrl");

        // 6. Return to admin window to start the game
        window.cy.get("@adminControlUrl").then((adminUrl) => {
          window.cy.visit(adminUrl);
          // Verify the player has joined
          window.cy.contains(playerName).should("be.visible");

          // Start the game (find the start button and click it)
          window.cy.wait(1000);
          window.cy.get("#start-button-main").click();

          // 7. Return to player window to play the game
          window.cy.wait(1000);
          window.cy.get("@playerUrl").then((playerUrl) => {
            window.cy.visit(playerUrl);

            // The game should now be started for the player
            // Wait for the first question to appear
            window.cy
              .contains("What is the colour of the sky?", { timeout: 10000 })
              .should("be.visible");

            // Continue with answering questions
            // Select the first answer button in the grid
            window.cy.wait(5000);
            window.cy.get("div.grid button").first().click();
            // Check the answer is submitted
            window.cy.contains("Answer Submitted").should("be.visible");
            window.cy.wait(20000);
            // Then wait for all other 'players' to answer, and see the result
            // (which is correct in this case)
            window.cy.contains("Correct").should("be.visible");
          });
        });
      });
    });
  });
});
