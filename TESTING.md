# Testing

## Component testing

- setup: https://gist.github.com/in2Unknown/b47cdd304d5fff309a4a7948154c4025
- todo

## UI testing

#### Alternative path testing

player-flow-path focuses on the player experience when joining and participating in games. This test is primarily focused on the ability for users to join a game and answer a question successfully. Just noting that it also tests the admins ability to load a game using a csv file (which is different from the happy path).

Following are the steps and rationale for the test:

1. Website loading
   - Necessary to create the quiz (duplicates the happy path)
2. Admin account creation
   - As the database is empty, we must create an admin account. Again, this is duplicating the happy path, but necessary in order to test the functionality of our alternative path.
3. Game Creation via CSV Import
   - Test: Create a quiz by importing a prepared CSV file
   - Rationale: This tests both the import functionality and creates the necessary content for testing player interactions.
4. Game Initialization
   - Test: Start the game and capture the session ID
   - Rationale: Session IDs are critical for joining games. This step verifies that a unique session is properly created and that the system displays the join information needed for players.
5. Player Join Process
   - Test: Visit the join page, enter the session ID and player name
   - Rationale: Tests the entry point for all players, verifying that the join mechanism works as expected. This is the key way that players access games, so it's critical functionality.
6. Game Start from Admin Panel
   - Test: Return to admin view and start the game
   - Rationale: Tests the admin's ability to control the game flow, which is necessary for synchronized gameplay. This also verifies that the admin panel shows joined players correctly.
7. Game Participation
   - Test: Answer questions as a player and verify feedback
   - Rationale: This tests the core gameplay experience, validating that:
     - Questions display correctly
     - Answer submission works
     - Feedback systems function properly

## User testing

- we tested our app on 700 people who said they look great, some of them were just being nice
