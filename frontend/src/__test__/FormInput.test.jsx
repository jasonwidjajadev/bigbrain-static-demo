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