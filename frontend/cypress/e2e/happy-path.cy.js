// https://gist.github.com/in2Unknown/1f4b682f5a244b3537dea24c8d4b53ed
/**
npm run cypress
*/



// (🙉🙉🙉 For pairs only) also required to write a test for another path through the program,
// describing the steps and the rationale behind this choice in TESTING.md,
// this path must contain different features than the ones described in the previous path.

//TODO


// Write a test for the "happy path" of an admin that is described as:
window.describe('UI testing', () => {
  window.it('website loads', () => {
    window.cy.visit('http://localhost:3000');
  });

  window.it('Happy path', () => {
    const name = 'mark';
    const email = 'mark@email.com';
    const password = 'MarkTheGreat!';

    // 0. Arrive at welcome page
    window.cy.visit('http://localhost:3000');

    // 1. Registers successfully
    window.cy.contains('Link', 'Sign up').click();
    window.cy.get('input[name=name]').focus().type(name);
    window.cy.get('input[name=email]').focus().type(email);
    window.cy.get('input[name=password]').focus().type(password);
    window.cy.get('input[name=confirmPassword]').focus().type(password);
    window.cy.get('button[type="submit"]').click();


    // const presentationName = 'presentationName';
    // const thumbnail = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg';
    // const newPresentationName = 'newPresentationName';

    // 2. Creates a new game successfully


    // 3. (Not required) Updates the thumbnail and name of the game successfully (yes, it will have no questions)


    // 4. Starts a game successfully


    // 5. Ends a game successfully (yes, no one will have played it)


    // 6. Loads the results page successfully


    // 7. Logs out of the application successfully


    // 8. Logs back in, into the application successfully

  });
});





/*
    // Go to register page
    window.cy.contains('span', 'Register').click();

    window.cy.get('input[name=name]').focus().type(name);
    window.cy.get('input[name=email]').focus().type(email);
    window.cy.get('input[name=password]').focus().type(password);
    window.cy.get('input[name=confirmPassword]').focus().type(password);
    window.cy.get('input[type=submit]').click();

    // Check that user has successfully registered by checking dashboard
    window.cy.contains('Dashboard');

    // Create a new presentation successfully
    window.cy.contains('button', 'New presentation').click();
    window.cy.get('input[name=name]').focus().type(presentationName);
    window.cy.contains('button', 'Create').click();

    // Check if presentation has been created
    window.cy.get('[aria-label="Presentation-card"]').should('exist');
    window.cy.get('[aria-label="Presentation-card"]').click();

    // Updates the thumbnail and name of the presentation
    window.cy.contains('button', 'Edit Thumbnail').click();
    window.cy.get('input[name=thumbnail]').focus().type(thumbnail);
    window.cy.contains('button', 'Update').click();

    window.cy.get('button[aria-label="edit-title"]').click();
    window.cy.get('input[name=title]').focus().clear().type(newPresentationName);
    window.cy.get('button[aria-label="update-title"]').click();

    // Add some slides in a slideshow deck
    window.cy.contains('button', 'Create New Slide').click();
    window.cy.contains('button', 'Create New Slide').click();
    window.cy.contains('button', 'OK').click();

    // Slide now has 3 slides
    window.cy.get('img[alt="button to forward slides"]').click();
    window.cy.contains('.flex.text-base', 2).should('exist');

    // Go to third slide
    window.cy.get('img[alt="button to forward slides"]').click();
    window.cy.contains('.flex.text-base', 3).should('exist');

    // Delete a presentation
    window.cy.contains('button', 'Delete Presentation').click();
    window.cy.contains('button', 'Yes').click();

    // Confirm it's deleted
    window.cy.contains('Dashboard');
    window.cy.get('[aria-label="Presentation-card"]').should('not.exist');

    // Log out
    window.cy.contains('button', 'Logout').click();
    window.cy.contains('Welcome to Presto!');

    // Go to login page
    window.cy.contains('span', 'Login').click();

    // Log back in
    window.cy.get('input[name=email]').focus().type(email);
    window.cy.get('input[name=password]').focus().type(password);
    window.cy.get('input[type=submit]').click();

    // Check login was successful
    window.cy.contains('Dashboard');
*/