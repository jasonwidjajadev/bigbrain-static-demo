
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from '@/components/button/Button';

// Mock icon component
const MockIcon = () => <svg data-testid="mock-icon" />;

describe('Button component', () => {
  it('renders a Link button correctly (Join a game)', () => {
    render(
      <MemoryRouter>
        <Button to="/join" icon={MockIcon}>
          Join a game
        </Button>
      </MemoryRouter>
    );
    expect(screen.getByText(/join a game/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/join');
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders a normal button and triggers onClick (Logout)', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} color="gray">
        Logout
      </Button>
    );
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders a disabled button', () => {
    render(
      <Button disabled color="gray">
        Logout
      </Button>
    );
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeDisabled();
  });

  it('renders icon image when icon is a string path', () => {
    render(
      <Button icon="/icon.svg">
        Icon Only
      </Button>
    );
    const img = screen.getByRole('img', { hidden: true });
    expect(img).toHaveAttribute('src', '/icon.svg');
  });
});
