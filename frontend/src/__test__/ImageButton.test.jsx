import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageButton from "@/components/button/ImageButton";

// Mock the react-icons module
vi.mock("react-icons/lu", () => ({
  LuImage: () => <div data-testid="mock-image-icon" />,
}));

// Mock the tailwind classes
vi.mock("@/components/ui/tailwind", () => ({
  blueButtonClassSmall: "mock-blue-button-class",
}));

describe("ImageButton", () => {
  it("should render the image button with icon and text", () => {
    render(<ImageButton onClick={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /add image/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-image-icon")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
  });

  it("should have the correct styling classes", () => {
    render(<ImageButton onClick={vi.fn()} />);

    const button = screen.getByRole("button", { name: /add image/i });
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("justify-center");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("mock-blue-button-class");
    expect(button).toHaveClass("min-w-[100px]");
  });

  it("should call the onClick handler when clicked", () => {
    const mockOnClick = vi.fn();
    render(<ImageButton onClick={mockOnClick} />);

    expect(mockOnClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /add image/i }));

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("should be a button type element with proper aria-label", () => {
    render(<ImageButton onClick={vi.fn()} />);

    const button = screen.getByRole("button", { name: /add image/i });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-label", "Add image");
  });
});
