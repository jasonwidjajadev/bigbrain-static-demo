# Extra features, please have a look at BigBrain.pdf in the same folder

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

## Add/Edit question

- Image associated with a question will show up as a preview.

## Micro-interactions

- Dashboard: hoverability on quiz cards to slightly expand and make a shadow to show they can be interacted and are focused on the screen
- Tooltip on hover icon shows what each icon means
- Orange buttons, and buttons throughout the website has a move up y-axis when hovered

## Quiz

- thumbnails for job card, allowing user to personalize their quiz
  - thumbnails can take svg format (which required additional thinking
    and functionality to handle this case)
- Edit question and edit answer: indication for required fields with server-side validation

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

- Deployed frontend and (maybe if have time backend too)
