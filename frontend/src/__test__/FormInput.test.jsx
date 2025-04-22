import { render, screen, fireEvent } from '@testing-library/react';
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

// https://gist.github.com/in2Unknown/b47cdd304d5fff309a4a7948154c4025
// https://vitest.dev/api/
// https://testing-library.com/docs/queries/about/
// https://github.com/testing-library/jest-dom
describe('FormInput', () => {
  it('renders label and input correctly', () => {
    render(<FormInput label="Email" name="email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const handleChange = vi.fn();
    render(<FormInput label="Name" name="name" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when provided', () => {
    render(<FormInput label="Password" name="password" errorMessage="Password is too short" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Password is too short');
  });
});
