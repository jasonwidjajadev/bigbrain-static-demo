# Extra features, please have a look at BigBrain.pdf in the same folder

## User testing

We conducted comprehensive user testing with a diverse sample of six participants to evaluate and refine our application. This systematic approach revealed several key usability issues and opportunities for enhancement. By incorporating user feedback across multiple testing rounds, we implemented specific improvements to navigation paths, content accessibility, and interaction patterns. These evidence-based refinements help to make our application intuitive and engaging. The iterative testing process ensured that our final product delivers a polished, user-centered interface that anticipates user needs and aligns with established usability principles.

#### z5519996

- Performed 3 rounds of user testing with family members to gather diverse perspectives. My mother and father were selected to get the perspective of users who may be older.
  - Round 1: With my brother - he identified the need for photo management functionality. We discovered users needed to be able to delete photos they had uploaded in the create game section. This functionality was implemented to improve user control and prevent frustration when incorrect images were selected.
  - Round 2: With my mum - she highlighted modal interaction issues. When attempting to delete a game, she found it annoying that the escape key didn't dismiss the confirmation dialog. This functionality was added to provide a more intuitive user experience that aligns with standard UI patterns.
  - Round 3: With my dad - he identified readability concerns with the question text. He required larger text for the questions to improve accessibility and readability. This change was implemented to ensure the game content was accessible to users with various visual capabilities.

#### z5494973

- Performed 3 rounds of user testing with friends.
  - Round 1: First friend identified navigation issues within the application. They suggested adding explicit "Back to Dashboard" buttons on both the QuizEdit and QuizCreate pages. While this functionality was already available by clicking the logo, the user found this unintuitive and had difficulty returning to the dashboard. Additionally, they recommended implementing a clear call-to-action button when no games are present to improve initial user experience and application usability. We implemented this with a clear "Create your first game" button.
  - Round 2: Second friend also identified the need for photo management functionality, specifically the ability to delete uploaded photos. This aligned with feedback from previous testing with my brother. They also suggested enhancing the gameplay experience with background music, which would improve user engagement and create a more immersive quiz atmosphere.
  - Round 3: Third friend was happy with his experience on the app and provided no actionable feedback. This round was done close to the end of the project, after substantial user testing was done, indicating that earlier feedback had been successfully incorporated into the application.

## Branding

- Favicon: on the tab of the webpage to make the site clearly distinguishable
- Colour: hot pink and cyan as the primary color, but throughout the game we used bold primary colour to show the fun quiz nature of the game
- Font Nunito as distinguishable easy to read and fun font

## Navigation

- Throughout the websites we have consistent logo that user can click to, depending on if they are logged in or not will bring them to the appropriate back page

## Landing Page

- Fun and inviting landing page for user, allows to user to see branding of the site before they sign in or login
- Animation and typewriter effect makes the homepage more unique and exciting for the viewer

## Authentication

- Inviting layout and easy to navigate, for both registration and login
- Registration: Validation that email is an email in the correct format
- Registration/ Login: names must be at least one character long

## Dashboard

- Navigation bar: that switches format for mobile with hamburger icon

## Quiz Metadata

- The edit quiz metadata screen displays a live preview of the current quiz image, giving users immediate visual context. This intuitive feature eliminates guesswork by showing exactly what image is currently in use, enabling users to make informed decisions about whether to retain or replace it with more suitable imagery. The visual confirmation streamlines the editing process and reduces potential user errors.
- The quiz thumbnail has been configured to allow for SVG uploads. This feature allows thumbnails to remain crisp and clear at any display size without pixelation, ensuring optimal visual presentation across all devices from mobile phones to large monitors. This feature helps to align with industry trends, as SVGs are being more popular in modern web interfaces.

## Add/Edit question

- Similar to the edit quiz metadata, associated with a question will show up as a preview. This intuitive design element allows users to immediately visualize how the question will appear during gameplay, eliminating uncertainty and reducing editing cycles.
- We have also implemented a preview of the youtube video once selected on the question edit page. This admins to be sure they have selected the correct video when creating a quesiton.

## Micro-interactions

- Dashboard: hoverability on quiz cards to slightly expand and make a shadow to show they can be interacted and are focused on the screen
- Tooltip on hover icon shows what each icon means
- Pink buttons, and buttons throughout the website has a move up y-axis when hovered

## Quiz Join

- shows the required field/ error message needed for user needed to join the quiz

## Session

### Host - Game Lobby

- Host lobby shows the player who just joined, so they know they have who has just successfully joined the game
- added 3 different music representing the different stages of the game for lobby, question time and final result, there is also a button to mute it and adjust volume

### Host - Game Play

- During Game Play, added 3 seconds countdown preparing player for question reveal, and showing the type of question it is, this is both very informative and build suspense to the game
- Quiz cover images: if an image or video is not uploaded an image of 'Big Brain' in chalkboard font is displayed
- During game play host and player is able to see how many question is left and what stage they are
- Host is able to skip and end game at any stage of the game

### Player - Game Lobby

- Whilst waiting for host, player is able to watch a youtube video of the mario kart olympic

### Player - Game Play

- added 3 seconds extra buffer to match host before question reveal and showing the type of question it is
- During the period of results reveal for player it also shows how much score they got
- if a user submitted early, shows a 'answer submitted page' and shows waiting for other player to answer, and a spinner to show user to wait for the countdown to finish

## Deployment

- Deployed frontend
