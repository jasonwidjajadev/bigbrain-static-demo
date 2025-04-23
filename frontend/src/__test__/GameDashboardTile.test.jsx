import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GameDashboardTile from "@/components/cards/GameDashboardTile";

// Mock the formatBase64Image util function
vi.mock("@/util/imageUtils", () => ({
  formatBase64Image: vi.fn((image) => `formatted-${image}`),
}));

// Mock the react-icons/lu components
vi.mock("react-icons/lu", () => ({
  LuPencil: () => <div data-testid="icon-pencil" />,
  LuPlay: () => <div data-testid="icon-play" />,
  LuTrash2: () => <div data-testid="icon-trash" />,
  LuClipboardPaste: () => <div data-testid="icon-clipboard" />,
  LuCircleStop: () => <div data-testid="icon-stop" />,
  LuExternalLink: () => <div data-testid="icon-external-link" />,
}));

// Mock the QuizEndedModal component
vi.mock("../modals/QuizEndedModal", () => ({
  default: ({ isOpen, onClose, sessionId }) =>
    isOpen ? (
      <div data-testid="quiz-ended-modal" onClick={onClose}>
        Mock Quiz Ended Modal
      </div>
    ) : null,
}));

// Mock the tailwind classes
vi.mock("@/components/ui/tailwind", () => ({
  cyanButtonClass: "mock-cyan-button-class",
  redButtonClass: "mock-red-button-class",
}));

// Helper function to render with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("GameDashboardTile", () => {
  // Sample game data for tests
  const mockGame = {
    id: "game-123",
    name: "Test Quiz Game",
    thumbnail: "test-thumbnail-base64",
    questions: [{ duration: 30 }, { duration: 45 }, { duration: 60 }],
    oldSessions: ["session1", "session2"],
    active: null, // No active session by default
  };

  const mockGameWithActiveSession = {
    ...mockGame,
    active: "active-session-123",
  };

  // Mock handler functions
  const mockHandlers = {
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onPreviousSessionResults: vi.fn(),
    onPlay: vi.fn(),
    onStop: vi.fn(),
    onGoToSession: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render game information correctly", () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    // Check title
    expect(screen.getByText("Test Quiz Game")).toBeInTheDocument();

    // Check play count
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Plays")).toBeInTheDocument();

    // Check question count
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Questions")).toBeInTheDocument();

    // Check duration
    expect(screen.getByText("2 mins, 15 secs")).toBeInTheDocument();

    // Check thumbnail
    const thumbnail = screen.getByAltText("Thumbnail for Test Quiz Game");
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail.src).toContain("formatted-test-thumbnail-base64");
  });

  it('should display "Play" button when no active session exists', () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    const playButton = screen.getByRole("button", { name: /play this game/i });
    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveTextContent("Play");
    expect(
      screen.queryByRole("button", { name: /go to active game session/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /stop active game session/i })
    ).not.toBeInTheDocument();
  });

  it('should display "Go to Session" and "Stop" buttons when active session exists', () => {
    renderWithRouter(
      <GameDashboardTile game={mockGameWithActiveSession} {...mockHandlers} />
    );

    expect(
      screen.queryByRole("button", { name: /play this game/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to active game session/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /stop active game session/i })
    ).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    fireEvent.click(screen.getByLabelText(/edit game/i));

    expect(mockHandlers.onEdit).toHaveBeenCalledOnce();
    expect(mockHandlers.onEdit).toHaveBeenCalledWith("game-123");
  });

  it("should call onDelete when delete button is clicked", () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    fireEvent.click(screen.getByLabelText(/delete game/i));

    expect(mockHandlers.onDelete).toHaveBeenCalledOnce();
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(
      "game-123",
      "Test Quiz Game"
    );
  });

  it("should call onPreviousSessionResults when previous sessions button is clicked", () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    fireEvent.click(screen.getByLabelText(/view previous sessions/i));

    expect(mockHandlers.onPreviousSessionResults).toHaveBeenCalledOnce();
    expect(mockHandlers.onPreviousSessionResults).toHaveBeenCalledWith(
      "game-123"
    );
  });

  it("should call onPlay when play button is clicked", () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    const playButton = screen.getByRole("button", { name: /play this game/i });
    fireEvent.click(playButton);

    expect(mockHandlers.onPlay).toHaveBeenCalledOnce();
    expect(mockHandlers.onPlay).toHaveBeenCalledWith("game-123");
  });

  it("should call onGoToSession when go to session button is clicked", () => {
    renderWithRouter(
      <GameDashboardTile game={mockGameWithActiveSession} {...mockHandlers} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /go to active game session/i })
    );

    expect(mockHandlers.onGoToSession).toHaveBeenCalledOnce();
    expect(mockHandlers.onGoToSession).toHaveBeenCalledWith(
      "game-123",
      "active-session-123"
    );
  });

  it("should call onStop and show modal when stop button is clicked", () => {
    renderWithRouter(
      <GameDashboardTile game={mockGameWithActiveSession} {...mockHandlers} />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /stop active game session/i })
    );

    expect(mockHandlers.onStop).toHaveBeenCalledOnce();
    expect(mockHandlers.onStop).toHaveBeenCalledWith("game-123");

    // Check that the modal is displayed by looking for its heading text
    expect(screen.getByText("The Quiz has ended early!")).toBeInTheDocument();
  });

  it("should hide the quiz ended modal when onClose is triggered", () => {
    renderWithRouter(
      <GameDashboardTile game={mockGameWithActiveSession} {...mockHandlers} />
    );

    // Show the modal
    fireEvent.click(
      screen.getByRole("button", { name: /stop active game session/i })
    );
    expect(screen.getByText("The Quiz has ended early!")).toBeInTheDocument();

    // Close the modal by clicking the Close button
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(
      screen.queryByText("The Quiz has ended early!")
    ).not.toBeInTheDocument();
  });

  it("should show singular text when there is 1 play", () => {
    const singlePlayGame = {
      ...mockGame,
      oldSessions: ["session1"],
    };

    renderWithRouter(
      <GameDashboardTile game={singlePlayGame} {...mockHandlers} />
    );

    const playCountDiv = screen.getByLabelText("There have been 1 Play");
    expect(playCountDiv).toBeInTheDocument();
    expect(playCountDiv).toHaveTextContent("1");
    expect(playCountDiv).toHaveTextContent("Play");
  });

  it("should show singular text when there is 1 question", () => {
    const singleQuestionGame = {
      ...mockGame,
      questions: [{ duration: 30 }],
    };

    renderWithRouter(
      <GameDashboardTile game={singleQuestionGame} {...mockHandlers} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Question")).toBeInTheDocument();
  });

  it("should handle games with no plays (undefined oldSessions)", () => {
    const noPlaysGame = {
      ...mockGame,
      oldSessions: undefined,
    };

    renderWithRouter(
      <GameDashboardTile game={noPlaysGame} {...mockHandlers} />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Plays")).toBeInTheDocument();
  });

  it("should calculate duration correctly from question durations", () => {
    renderWithRouter(<GameDashboardTile game={mockGame} {...mockHandlers} />);

    // Total duration is 30 + 45 + 60 = 135 seconds = 2 mins, 15 secs
    expect(screen.getByText("2 mins, 15 secs")).toBeInTheDocument();
  });
});
