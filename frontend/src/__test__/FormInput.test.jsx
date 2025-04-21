import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from '@/components/inputs/FormInput';

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
