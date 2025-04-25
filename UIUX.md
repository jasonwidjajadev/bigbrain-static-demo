# UI & UX Design Summary

**Please refer to `BigBrain.pdf` in the same folder for visual examples.**

---

## Visual Hierarchy & Fonts

- We use **Nunito** for major headings (h1, h2), giving a friendly and modern look while maintaining readability.
- **Serif fonts** are applied to body text, enhancing legibility, especially for users with cognitive impairments.
- Font sizes and weights are used to create a strong **visual hierarchy**, helping users understand what to focus on.

---

## Colours & Contrast

- Buttons are styled with **Tailwind pink-600** (for primary actions) and **blue-600** (for actions like “Play”)—both meeting **AAA accessibility standards** for contrast.
- **Green** indicates success or confirmation actions, while **red** signals destructive actions like “Delete.”
- A consistent **cyan background** is used for the navbar across all pages to aid in site navigation and brand recognition.

---

## Form Inputs & Validation

- Custom input components show clear focus states when interacted with, providing consistent styling and color feedback.
- **Placeholder text** (e.g., "Enter password") offers intuitive guidance for first-time users.
- **Submit buttons are disabled** until all required fields are valid.
- **Inline error messages** appear immediately below problematic fields for real-time feedback—avoiding disruptive alerts or modals.

---

## Keyboard Compatibility

- The website is fully **navigable via keyboard**, enhancing usability for:
  - Screen reader users
  - Users who cannot use a mouse
  - Power users who prefer keyboard navigation
- All interactive elements (buttons, links, modals) follow logical tab order.

---

## Images & Alt Text

- All images include meaningful **alt text** to describe their purpose and enhance screen reader support.
- This also improves usability in cases where images fail to load.

---

## Modals

- Confirmation **modals** are used throughout (e.g., for deletion) with:
  - Clear messages
  - Distinct call-to-action buttons
  - Icons to visually support the modal’s purpose

---

## Dashboard Design

- **Grid layout** organizes the dashboard into clear, stackable content blocks.
- **Minimalist design** ensures clarity and quick scannability.
- The **navbar remains visible and consistent**, allowing users to always log out or navigate easily.

---

## Hoverability & Affordance

- **Buttons and cards respond to hover** via:
  - Subtle scale-up animations
  - Shadow enhancement
  - Color transitions (e.g., lighter shades)
- These cues indicate interactivity and make the UI feel responsive and polished.
- **Tooltips** appear on icons (like delete/edit) to clarify their purpose.
- **Explicit affordances** (e.g., labeled buttons) are prioritized for clarity.
- **Pattern affordance** is used:
  - Hamburger menu on mobile
  - Clickable logo in top-left to return to dashboard
- **False affordances** are deliberately avoided to prevent confusion.

---

## File Upload UX (CSV)

- The **Game Upload** feature supports CSV input using a **predefined template format**.
- Clear instructions and file validation ensure the upload process is easy and error-resistant.
- Inline error feedback helps users correct issues quickly.

---

## Thumbnail Editing

- Quiz creators can **edit thumbnail images** during quiz creation and editing.
- A real-time preview is shown, along with a **confirmation pop-up** before changes are saved.

---

## Hosting Experience & Live Feedback

- The **host lobby screen** dynamically shows which players have joined.
- A **3-second countdown** is displayed before answers are revealed, creating anticipation and keeping the flow smooth.
- Confetti and **sound effects** are played at the end of the game for added excitement.

---

## Game Play & Answer Feedback

- **Immediate feedback** is provided after answer submission, showing if the choice was correct.
- A **point system** rewards correct answers to encourage engagement.
- Use of color (green for correct, red for incorrect) provides quick, accessible feedback.

---

## Seamless Join Flow

- Players can join a quiz via:
  - A **direct URL** (`/quiz/join/:sessionId`)
  - Entering a **Game PIN** on the join screen
- Logged-in and logged-out states are handled appropriately with user-friendly redirection.
- **Invalid session links** lead to a styled "inactive session" screen that explains the issue.

---

## Error & Not Found Pages

- Custom-designed pages are used for:
  - **404 - Page Not Found**
  - **Inactive Game Sessions**
- These pages provide:
  - Friendly messages
  - Links back to the homepage or dashboard
  - Visual consistency with the rest of the site

---

## Additional UX Considerations

### Responsiveness

- All pages are fully **responsive** and optimized for:
  - Desktop
  - Tablet
  - Mobile devices

### Feedback States

- **Loading**, **empty**, and **error states** are clearly communicated using spinners, icons, or messages to prevent confusion.

### Accessibility Labels

- Inputs, icons, and interactive components include **ARIA labels** or are built with semantic HTML for screen reader compatibility.

## Add/Edit Quesiton

- Edit question and edit answer have require fields to ensure that a question is created properly. This allows users have a seamless interaction when creating questions, as they are effectively guided to fill in what is required, without any large infringements into their work flow.

---
