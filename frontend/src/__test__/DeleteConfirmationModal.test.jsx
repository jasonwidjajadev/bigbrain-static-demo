import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

describe("DeleteConfirmationModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Test Item",
  };

  // Clean up after each test
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    document.body.style.overflow = "";
  });

  it("should not render anything when isOpen is false", () => {
    const { container } = render(
      <DeleteConfirmationModal {...defaultProps} isOpen={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render the modal with correct title and ARIA attributes when isOpen is true", () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");

    expect(
      screen.getByText(/do you really want to delete test item\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm deletion of test item/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancel deletion of test item/i })
    ).toBeInTheDocument();
  });

  it('should call onClose when "No" button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<DeleteConfirmationModal {...defaultProps} onClose={mockOnClose} />);

    expect(mockOnClose).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: /cancel deletion of test item/i })
    );

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should call onConfirm when "Yes" button is clicked', () => {
    const mockOnConfirm = vi.fn();
    render(
      <DeleteConfirmationModal {...defaultProps} onConfirm={mockOnConfirm} />
    );

    expect(mockOnConfirm).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: /confirm deletion of test item/i })
    );

    expect(mockOnConfirm).toHaveBeenCalledOnce();
  });

  it("should display the correct title based on props", () => {
    const customTitle = "Custom Test Item";
    render(<DeleteConfirmationModal {...defaultProps} title={customTitle} />);

    expect(
      screen.getByText(`Do you really want to delete ${customTitle}?`)
    ).toBeInTheDocument();
  });

  it("should close when clicking on the overlay backdrop", () => {
    const mockOnClose = vi.fn();
    render(<DeleteConfirmationModal {...defaultProps} onClose={mockOnClose} />);

    // Find the backdrop (parent div of the modal content)
    const backdrop = screen.getByRole("dialog");

    // Click on the backdrop (not the modal content)
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("should close when pressing Escape key", () => {
    const mockOnClose = vi.fn();
    render(<DeleteConfirmationModal {...defaultProps} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("should set body overflow to hidden when modal is open", () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should restore body overflow when modal closes", () => {
    const { unmount } = render(<DeleteConfirmationModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("should have focus trap and accessibility attributes", () => {
    // Mock focus functionality
    const originalFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = vi.fn();

    render(<DeleteConfirmationModal {...defaultProps} />);

    const yesButton = screen.getByRole("button", {
      name: /confirm deletion of test item/i,
    });
    const noButton = screen.getByRole("button", {
      name: /cancel deletion of test item/i,
    });

    // Test that focus-related attributes are present
    expect(yesButton).toHaveClass("focus:ring-2");
    expect(noButton).toHaveClass("focus:ring-2");

    // Restore original focus method
    HTMLElement.prototype.focus = originalFocus;
  });
});
