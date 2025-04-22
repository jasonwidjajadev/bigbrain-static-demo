import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthRegister from '@/pages/auth/AuthRegister';
import AuthProvider from '@/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/util/apiCall', () => ({
  apiCall: vi.fn(() =>
    Promise.resolve({ token: 'mock-token' })
  ),
}));

describe('AuthRegister Form', () => {
  it("renders all fields and registers a user", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthRegister />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it("shows validation error if passwords don't match", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthRegister />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'kaws' },
    });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'kaws@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });
});
