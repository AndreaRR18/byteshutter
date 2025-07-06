import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockedFunction } from "vitest";
import { ImagePreview } from "../../../../src/Gallery/ImagePreview/ImagePreview";
import type { GalleryImageWithMetadata } from "../../../../src/Gallery/GalleryUtils";

// Interface for ImagePreview component props
interface ImagePreviewProps {
  image: GalleryImageWithMetadata;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

const mockImage: GalleryImageWithMetadata = {
  src: "test-image.jpg",
  alt: "Test image alt text",
  title: "Test Title",
  description: "Test description for the image",
  metadata: {
    iso: "400",
    shutter: "1/125",
    aperture: "2.8",
    camera: "Test Camera",
    lens: "50mm",
    ev: "+1.0",
  },
};

const mockImageWithoutMetadata: GalleryImageWithMetadata = {
  src: "test-image-minimal.jpg",
  alt: "Minimal test image",
  title: "Minimal Title",
  description: "Minimal description",
};

const defaultProps: ImagePreviewProps = {
  image: mockImage,
  isOpen: true,
  onClose: vi.fn() as MockedFunction<() => void>,
  onPrevious: vi.fn() as MockedFunction<() => void>,
  onNext: vi.fn() as MockedFunction<() => void>,
  currentIndex: 1,
  totalImages: 3,
  hasPrevious: true,
  hasNext: true,
};

describe("ImagePreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = "unset";
  });

  it("renders nothing when isOpen is false", () => {
    render(<ImagePreview {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders image preview when isOpen is true", () => {
    render(<ImagePreview {...defaultProps} />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-image.jpg");
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      "Test image alt text",
    );
  });

  it("displays image title and description", () => {
    render(<ImagePreview {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(
      screen.getByText("Test description for the image"),
    ).toBeInTheDocument();
  });

  it("displays image counter correctly", () => {
    render(<ImagePreview {...defaultProps} />);

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("displays metadata when available", () => {
    render(<ImagePreview {...defaultProps} />);

    expect(screen.getByText("Photo Details")).toBeInTheDocument();
    expect(screen.getByText("ISO")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("Shutter")).toBeInTheDocument();
    expect(screen.getByText("1/125")).toBeInTheDocument();
    expect(screen.getByText("Aperture")).toBeInTheDocument();
    expect(screen.getByText("f/2.8")).toBeInTheDocument();
    expect(screen.getByText("Camera")).toBeInTheDocument();
    expect(screen.getByText("Test Camera")).toBeInTheDocument();
    expect(screen.getByText("Lens")).toBeInTheDocument();
    expect(screen.getByText("50mm")).toBeInTheDocument();
    expect(screen.getByText("ev")).toBeInTheDocument();
    expect(screen.getByText("+1.0")).toBeInTheDocument();
  });

  it("does not display metadata section when metadata is not available", () => {
    render(<ImagePreview {...defaultProps} image={mockImageWithoutMetadata} />);

    expect(screen.queryByText("Photo Details")).not.toBeInTheDocument();
    expect(screen.queryByText("ISO")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close preview");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onPrevious when previous button is clicked", () => {
    const mockOnPrevious: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onPrevious={mockOnPrevious} />);

    const prevButton = screen.getByLabelText("Previous image");
    fireEvent.click(prevButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    const mockOnNext: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onNext={mockOnNext} />);

    const nextButton = screen.getByLabelText("Next image");
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it("does not render previous button when hasPrevious is false", () => {
    render(<ImagePreview {...defaultProps} hasPrevious={false} />);

    expect(screen.queryByLabelText("Previous image")).not.toBeInTheDocument();
  });

  it("does not render next button when hasNext is false", () => {
    render(<ImagePreview {...defaultProps} hasNext={false} />);

    expect(screen.queryByLabelText("Next image")).not.toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onClose={mockOnClose} />);

    // Find the overlay by its characteristics - it has tabindex="0" and is the backdrop
    const overlay = document.querySelector('[tabindex="0"]');
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking on content inside preview", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onClose={mockOnClose} />);

    const image = screen.getByRole("img");
    fireEvent.click(image);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation - Escape key", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard navigation - Left arrow key", () => {
    const mockOnPrevious: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onPrevious={mockOnPrevious} />);

    fireEvent.keyDown(document, { key: "ArrowLeft" });

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard navigation - Right arrow key", () => {
    const mockOnNext: MockedFunction<() => void> = vi.fn();

    render(<ImagePreview {...defaultProps} onNext={mockOnNext} />);

    fireEvent.keyDown(document, { key: "ArrowRight" });

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it("does not call onPrevious when ArrowLeft is pressed and hasPrevious is false", () => {
    const mockOnPrevious: MockedFunction<() => void> = vi.fn();

    render(
      <ImagePreview
        {...defaultProps}
        onPrevious={mockOnPrevious}
        hasPrevious={false}
      />,
    );

    fireEvent.keyDown(document, { key: "ArrowLeft" });

    expect(mockOnPrevious).not.toHaveBeenCalled();
  });

  it("does not call onNext when ArrowRight is pressed and hasNext is false", () => {
    const mockOnNext: MockedFunction<() => void> = vi.fn();

    render(
      <ImagePreview {...defaultProps} onNext={mockOnNext} hasNext={false} />,
    );

    fireEvent.keyDown(document, { key: "ArrowRight" });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("sets body overflow to hidden when opened", () => {
    render(<ImagePreview {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("resets body overflow when closed", () => {
    const { rerender } = render(<ImagePreview {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");

    rerender(<ImagePreview {...defaultProps} isOpen={false} />);

    expect(document.body.style.overflow).toBe("unset");
  });

  it("cleans up event listeners on unmount", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();
    const { unmount } = render(
      <ImagePreview {...defaultProps} onClose={mockOnClose} />,
    );

    unmount();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("handles edge cases for image counter", () => {
    render(<ImagePreview {...defaultProps} currentIndex={0} totalImages={1} />);

    expect(screen.getByText("1 / 1")).toBeInTheDocument();
  });

  it("handles missing optional metadata fields", () => {
    const imageWithPartialMetadata: GalleryImageWithMetadata = {
      ...mockImage,
      metadata: {
        iso: "400",
        shutter: "1/125",
        aperture: "",
        camera: "",
        lens: "",
        ev: "",
      },
    };

    render(<ImagePreview {...defaultProps} image={imageWithPartialMetadata} />);

    expect(screen.getByText("ISO")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("Shutter")).toBeInTheDocument();
    expect(screen.getByText("1/125")).toBeInTheDocument();

    expect(screen.queryByText("f/")).not.toBeInTheDocument();
    expect(screen.queryByText("Camera")).not.toBeInTheDocument();
    expect(screen.queryByText("Lens")).not.toBeInTheDocument();
    expect(screen.queryByText("ev")).not.toBeInTheDocument();
  });

  it("handles rapid navigation events", () => {
    const mockOnNext: MockedFunction<() => void> = vi.fn();
    const mockOnPrevious: MockedFunction<() => void> = vi.fn();

    render(
      <ImagePreview
        {...defaultProps}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />,
    );

    fireEvent.keyDown(document, { key: "ArrowRight" });
    fireEvent.keyDown(document, { key: "ArrowRight" });
    fireEvent.keyDown(document, { key: "ArrowLeft" });

    expect(mockOnNext).toHaveBeenCalledTimes(2);
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it("handles other keyboard keys without triggering actions", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();
    const mockOnNext: MockedFunction<() => void> = vi.fn();
    const mockOnPrevious: MockedFunction<() => void> = vi.fn();

    render(
      <ImagePreview
        {...defaultProps}
        onClose={mockOnClose}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />,
    );

    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "Space" });
    fireEvent.keyDown(document, { key: "Tab" });

    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnNext).not.toHaveBeenCalled();
    expect(mockOnPrevious).not.toHaveBeenCalled();
  });

  it("handles image without title and description", () => {
    const minimalImage: GalleryImageWithMetadata = {
      src: "test.jpg",
      alt: "Test alt",
    };

    render(<ImagePreview {...defaultProps} image={minimalImage} />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Test description for the image"),
    ).not.toBeInTheDocument();
  });

  it("re-registers event listeners when dependencies change", () => {
    const mockOnClose: MockedFunction<() => void> = vi.fn();
    const { rerender } = render(
      <ImagePreview {...defaultProps} onClose={mockOnClose} />,
    );

    const newMockOnClose: MockedFunction<() => void> = vi.fn();
    rerender(<ImagePreview {...defaultProps} onClose={newMockOnClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).not.toHaveBeenCalled();
    expect(newMockOnClose).toHaveBeenCalledTimes(1);
  });
});
