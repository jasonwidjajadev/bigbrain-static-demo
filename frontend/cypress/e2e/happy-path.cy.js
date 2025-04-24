// https://gist.github.com/in2Unknown/1f4b682f5a244b3537dea24c8d4b53ed
// npm run cypress
// import svg from '../../src/assets/react'

// =============================================================================
// Admin Flow
// =============================================================================

// Write a test for the "happy path" of an admin that is described as:
let uniqueEmail;
window.describe("Admin Flow", () => {
  window.it("website loads", () => {
    window.cy.visit("http://localhost:3000");
  });
  window.it("generates a unique email", () => {
    uniqueEmail = `mark+${Date.now()}@email.com`;
    window.cy.wrap(uniqueEmail).as("email");
  });

  window.it("Happy path host", () => {
    const name = "mark3000.5";
    const password = "MarkTheGreat!";
    const game1 = "Geography";

    // 0. Arrive at welcome page
    window.cy.viewport("macbook-15");
    window.cy.visit("http://localhost:3000");

    // =========================================================================
    // 1. Registers successfully
    // =========================================================================

    window.cy.wait(1000);
    window.cy.contains("a", "Sign up").should("be.visible").click();
    window.cy.get("input[name=name]").should("be.visible").focus().type(name);
    window.cy
      .get("input[name=email]")
      .should("be.visible")
      .focus()
      .type(uniqueEmail);
    window.cy
      .get("input[name=password]")
      .should("be.visible")
      .focus()
      .type(password);

    // Wrong Password
    window.cy.get('input[name="confirmPassword"]').type("wrongpassword");
    window.cy.get('button[type="submit"]').click();
    window.cy.contains("Passwords do not match.").should("be.visible");

    // Correct Password
    window.cy.get("input[name=confirmPassword]").clear().type(password);
    window.cy.get('button[type="submit"]').click();

    // Arrive at dashboard
    window.cy.wait(1000);
    window.cy.url().should("include", "/dashboard");
    window.cy.contains("My Games").should("be.visible");
    window.cy
      .get('[data-testid="quiz-create-button-big-screen"]')
      .should("be.visible")
      .click();

    // =========================================================================
    // 2. Creates a new game successfully
    // =========================================================================

    window.cy.wait(1000);
    window.cy.contains("Create Quiz").should("be.visible");
    window.cy.get('button[type="submit"]').click();
    window.cy.url().should("eq", "http://localhost:3000/quiz/create"); // still on same page

    // =========================================================================
    // 3. Updates the thumbnail and name of the game successfully (yes, it will have no questions)
    // =========================================================================
    window.cy.contains("Upload a File").should("be.visible");
    window.cy
      .get('input[type="file"]')
      .selectFile("cypress/fixtures/react.svg", { force: true });
    window.cy.get("input[name=title]").type(game1);
    window.cy.get('button[type="submit"]').click();

    // =========================================================================
    // 4. Starts a game successfully
    // =========================================================================
    window.cy.wait(1000);
    window.cy.url().should("eq", "http://localhost:3000/dashboard");
    window.cy.contains("button", "Play").click();
    window.cy
      .contains("http://localhost:3000/join/")
      .invoke("text")
      .then((link) => {
        const sessionId = link.trim().split("/").pop();
        window.cy.log("Session ID from link:", sessionId);
        window.cy.wrap(sessionId).as("sessionId");
      });

    window.cy.contains("button", "Continue").click();

    // =========================================================================
    // 5. Ends a game successfully (yes, no one will have played it)
    // =========================================================================
    window.cy.wait(1000);
    window.cy.get("@sessionId").then((id) => {
      window.cy.url().should("include", `/host/${id}`);
    });
    window.cy.contains("Waiting for players...").should("be.visible");
    window.cy.contains("button", "End").click();

    // =========================================================================
    // 6. Loads the results page successfully
    // =========================================================================
    window.cy.contains("Scoreboard").should("be.visible");
    window.cy.wait(1000);

    // =========================================================================
    // 7. Logs out of the application successfully
    // =========================================================================
    window.cy.contains("Logout").filter(":visible").click();
    window.cy.url().should("eq", "http://localhost:3000/home");
    window.cy.wait(1000);

    // =========================================================================
    // 8. Logs back in, into the application successfully
    // =========================================================================
    window.cy.visit("http://localhost:3000/auth/login");
    window.cy.get('input[name="email"]').type(uniqueEmail);
    window.cy.get('input[name="password"]').type(password);
    window.cy.get('button[type="submit"]').click();

    // Arrive at dashboard
    window.cy.wait(1000);
    window.cy.url().should("include", "/dashboard");
    window.cy.contains("My Games");
  });
});

// =============================================================================
// Player Flow
// =============================================================================

// (For pairs only) also required to write a test for another path through the program,
// describing the steps and the rationale behind this choice in TESTING.md,
// this path must contain different features than the ones described in the previous path.

window.describe("Player Flow", () => {
  window.it("lets a user join", () => {
    window.cy.visit("http://localhost:3000/join");
    // test join flow
  });

  window.it("shows error on wrong sessionId", () => {
    // test invalid session
  });
});
