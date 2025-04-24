# Testing

## Component testing

- setup: https://gist.github.com/in2Unknown/b47cdd304d5fff309a4a7948154c4025

## UI testing

#### Alternative path testing

The CSV Upload Flow test case documents the alternative path for quiz creation within our application, specifically focusing on the administrator's ability to bulk-import questions via CSV files rather than manually entering them one by one. This comprehensive test validates the entire user journey from initial application access through administrator registration, quiz creation via file import, and game initiation.

Following are the steps and rationale for the test:

1. Website Loading
   - Test: Verify that the application loads properly
   - Rationale: This is a fundamental check to ensure the application is accessible before proceeding with more complex testing operations. It establishes that the base environment is functioning correctly.

2 Admin Account Creation

- Test: Register a new admin account with unique credentials
- Rationale: Since the test database starts empty, we need to create an administrator account to access the quiz creation functionality. This step is prerequisite to testing the CSV upload feature, as only authenticated administrators can create quizzes.
- Implementation Detail: The test generates a unique email with a timestamp to avoid conflicts from previous test runs.

3 Game Creation via CSV Import

- Test: Create a quiz by importing a prepared CSV file
- Rationale: This is the central test case that verifies the alternative path for quiz creation. While quizzes can be created manually, the CSV import feature allows administrators to quickly create quizzes from existing question banks.
  Implementation Detail: The test uploads a fixture file "testing1.csv" and verifies successful import by checking that the dashboard displays the correct number of questions (5) and total quiz duration (2 mins, 40 secs). This is an important verification for ensuring that the correct number of quesitons were uploaded, with the correct total time.

4 Game Initiation Process

- Test: Start the created game and proceed to the player lobby
- Rationale: This verifies that quizzes created via CSV import are fully functional and can be initiated for gameplay. It confirms that the import process correctly configures all necessary game parameters.
- Implementation Detail: The test clicks the "Play" button, proceeds to the lobby, and confirms the "Waiting for players..." message is displayed, indicating the game is ready for players to join.

## User testing

- we tested our app on 700 people who said they look great, some of them were just being nice
