// https://gist.github.com/in2Unknown/b47cdd304d5fff309a4a7948154c4025
// https://vitest.dev/api/
// https://testing-library.com/docs/queries/about/
// https://github.com/testing-library/jest-dom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from "vitest";
import FormInput from '@/components/inputs/FormInput';

vi.mock('lottie-web', () => {
  return {
    loadAnimation: vi.fn(() => ({
      play: vi.fn(),
      stop: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

/**
 * Test Auth Registration Form
 *  - npm run test
 *
vi.fn()	                                          Vitest’s mock function (same as jest.fn())
render(...)	                                      Renders your React component into a test DOM

screen.getByText('Login')	                        Fails if not found,find an element with exact text "login"
screen.queryByText('Error')	                      Returns null if not found (no fail)

screen.getByLabelText	                            Only for form elements with <label>, Selects element associated with a <label for="...">
screen.getByLabelText('Email');                   Find input/textarea by <label>

getByRole('heading')	                            Use when targeting elements by semantic role
screen.getByRole	                                Grabs element by ARIA role (e.g., alert, button, textbox)
screen.getByRole('button')	                      find a <button>, <textbox>, etc. For accessibility


screen.getByLabelText('Email')	                  Matches <label> text
screen.getByPlaceholderText('Search')	            Matches input placeholder, find by placeholder attribute

getByText('Text')	                                Use when you're trying to find visible text
<div>Hello world</div>                            expect(screen.getByText('Hello world')).toBeInTheDocument();

getByTestId('some-id')	                          Use when nothing else is reliable (as fallback)
<div data-testid="myDiv">Custom component</div>   expect(screen.getByTestId('myDiv')).toHaveTextContent('Custom component');

fireEvent                                         Simulates DOM events like typing, clicking, focusing, etc.
fireEvent.change(...)	                            Simulates user typing or interaction (you can also use click, etc.)
fireEvent.click(screen.getByText('Submit'));      Click submit button

expect(...).toBe...()	                            Asserts the result of the interaction or query



 */
describe('FormInput Component Test2', () => {
  // 1. Interaction test (simulate typing/clicking)
  it('calls onChange when user types in input', () => {
    const handleChange = vi.fn(); // Create a mock function

    render(
      <FormInput
        id="name"
        name="name"
        labelContent="Full Name"
        value=""
        onChange={handleChange}
      />
    );

    // Simulate typing
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });

    // Expect the mock to have been called
    expect(handleChange).toHaveBeenCalled();
  });

  // 2. Basic rendering test
  it('renders the label and input correctly', () => {
    render(
      <FormInput
        id="email"
        name="email"
        labelContent="Email"
        placeholder="Enter your email"
        value=""
        onChange={() => {}}
      />
    );

    // `getByLabelText` finds the input via the label's `htmlFor`
    expect(screen.getByLabelText('Email')).toBeInTheDocument();

    // `getByPlaceholderText` checks if placeholder is present
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });


  // 3. Error rendering test
  it('shows error message when provided', () => {
    render(
      <FormInput
        id="password"
        name="password"
        labelContent="Password"
        value=""
        onChange={() => {}}
        errorMessage="Password too short"
      />
    );

    // Look for the error in an alert role
    expect(screen.getByRole('alert')).toHaveTextContent('Password too short');
  });

  // 4. Accessibility attributes
  it('sets proper aria attributes when error is present', () => {
    render(
      <FormInput
        id="username"
        name="username"
        labelContent="Username"
        value=""
        onChange={() => {}}
        errorMessage="Username is required"
      />
    );

    const input = screen.getByLabelText('Username');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'username-error');
  });

  // 5. AutoFocus test
  it('auto-focuses if autoFocus is true', () => {
    render(
      <FormInput
        id="focusTest"
        name="focusTest"
        labelContent="Focus Me"
        autoFocus
        value=""
        onChange={() => {}}
      />
    );

    // Check if the element has focus
    expect(screen.getByLabelText('Focus Me')).toHaveFocus();
  });
});