import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockedFunction } from "vitest";
import GalleryGrid from "../../../../src/Gallery/Grid/GalleryGrid";
import { useGalleryImages } from "../../../../src/Gallery/GalleryUtils";

// Type definitions for test components
interface MockGalleryImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface MockImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
  image: MockGalleryImage;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface MockGalleryItemProps {
  image: MockGalleryImage;
  onClick: (image: MockGalleryImage) => void;
}

vi.mock("../../../../src/Gallery/GalleryUtils", () => ({
  useGalleryImages: vi.fn() as MockedFunction<() => MockGalleryImage[]>,
}));

vi.mock("../../../../src/Gallery/ImagePreview/ImagePreview", () => ({
  ImagePreview: ({
    isOpen,
    onClose,
    onPrevious,
    onNext,
    currentIndex,
    totalImages,
    image,
    hasPrevious,
    hasNext,
  }: MockImagePreviewProps) => (
    <div data-testid="image-preview">
      <div>Preview Open: {isOpen.toString()}</div>
      <div>Current Index: {currentIndex}</div>
      <div>Total Images: {totalImages}</div>
      <div>Image: {image.title}</div>
      <div>Has Previous: {hasPrevious.toString()}</div>
      <div>Has Next: {hasNext.toString()}</div>
      <button onClick={onClose}>Close</button>
      <button onClick={onPrevious} disabled={!hasPrevious}>
        Previous
      </button>
      <button onClick={onNext} disabled={!hasNext}>
        Next
      </button>
    </div>
  ),
}));

vi.mock("../../../../src/Gallery/Grid/GalleryItem", () => ({
  GalleryItem: ({ image, onClick }: MockGalleryItemProps) => (
    <div data-testid="gallery-item" onClick={() => onClick(image)}>
      {image.title}
    </div>
  ),
}));

const mockImages: MockGalleryImage[] = [
  {
    src: "test1.jpg",
    alt: "Test Image 1",
    title: "Test Title 1",
    description: "Test Description 1",
  },
  {
    src: "test2.jpg",
    alt: "Test Image 2",
    title: "Test Title 2",
    description: "Test Description 2",
  },
  {
    src: "test3.jpg",
    alt: "Test Image 3",
    title: "Test Title 3",
    description: "Test Description 3",
  },
];

describe("GalleryGrid", () => {
  beforeEach(() => {
    vi.mocked(useGalleryImages).mockReturnValue(mockImages);
  });

  it("renders all gallery items", () => {
    render(<GalleryGrid />);

    const galleryItems = screen.getAllByTestId("gallery-item");
    expect(galleryItems).toHaveLength(3);

    expect(screen.getByText("Test Title 1")).toBeInTheDocument();
    expect(screen.getByText("Test Title 2")).toBeInTheDocument();
    expect(screen.getByText("Test Title 3")).toBeInTheDocument();
  });

  it("does not show image preview initially", () => {
    render(<GalleryGrid />);

    expect(screen.queryByTestId("image-preview")).not.toBeInTheDocument();
  });

  it("opens image preview when gallery item is clicked", () => {
    render(<GalleryGrid />);

    const firstItem = screen.getAllByTestId("gallery-item")[0];
    fireEvent.click(firstItem);

    expect(screen.getByTestId("image-preview")).toBeInTheDocument();
    expect(screen.getByText("Preview Open: true")).toBeInTheDocument();
    expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 1")).toBeInTheDocument();
  });

  it("closes image preview when close button is clicked", () => {
    render(<GalleryGrid />);

    const firstItem = screen.getAllByTestId("gallery-item")[0];
    fireEvent.click(firstItem);

    expect(screen.getByTestId("image-preview")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("image-preview")).not.toBeInTheDocument();
  });

  it("navigates to next image correctly", () => {
    render(<GalleryGrid />);

    const firstItem = screen.getAllByTestId("gallery-item")[0];
    fireEvent.click(firstItem);

    expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 1")).toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Current Index: 1")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 2")).toBeInTheDocument();
  });

  it("navigates to previous image correctly", () => {
    render(<GalleryGrid />);

    const secondItem = screen.getAllByTestId("gallery-item")[1];
    fireEvent.click(secondItem);

    expect(screen.getByText("Current Index: 1")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 2")).toBeInTheDocument();

    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 1")).toBeInTheDocument();
  });

  it("handles navigation boundaries correctly", () => {
    render(<GalleryGrid />);

    // Test first image (should not have previous)
    const firstItem = screen.getAllByTestId("gallery-item")[0];
    fireEvent.click(firstItem);

    expect(screen.getByText("Has Previous: false")).toBeInTheDocument();
    expect(screen.getByText("Has Next: true")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Test last image (should not have next)
    const lastItem = screen.getAllByTestId("gallery-item")[2];
    fireEvent.click(lastItem);

    expect(screen.getByText("Has Previous: true")).toBeInTheDocument();
    expect(screen.getByText("Has Next: false")).toBeInTheDocument();
  });

  it("handles edge case with single image", () => {
    vi.mocked(useGalleryImages).mockReturnValue([mockImages[0]]);

    render(<GalleryGrid />);

    const singleItem = screen.getByTestId("gallery-item");
    fireEvent.click(singleItem);

    expect(screen.getByText("Has Previous: false")).toBeInTheDocument();
    expect(screen.getByText("Has Next: false")).toBeInTheDocument();
    expect(screen.getByText("Total Images: 1")).toBeInTheDocument();
  });

  it("handles empty gallery gracefully", () => {
    vi.mocked(useGalleryImages).mockReturnValue([]);

    render(<GalleryGrid />);

    expect(screen.queryByTestId("gallery-item")).not.toBeInTheDocument();
    expect(screen.queryByTestId("image-preview")).not.toBeInTheDocument();
  });

  it("finds correct image index when clicked", () => {
    render(<GalleryGrid />);

    const middleItem = screen.getAllByTestId("gallery-item")[1];
    fireEvent.click(middleItem);

    expect(screen.getByText("Current Index: 1")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 2")).toBeInTheDocument();
  });

  it("maintains state consistency during navigation", () => {
    render(<GalleryGrid />);

    const firstItem = screen.getAllByTestId("gallery-item")[0];
    fireEvent.click(firstItem);

    // Navigate forward twice
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText("Current Index: 2")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 3")).toBeInTheDocument();

    // Navigate back once
    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    expect(screen.getByText("Current Index: 1")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 2")).toBeInTheDocument();
  });

  it("passes correct props to ImagePreview", () => {
    render(<GalleryGrid />);

    const firstItem = screen.getAllByTestId("gallery-item")[0];
    fireEvent.click(firstItem);

    const preview = screen.getByTestId("image-preview");
    expect(preview).toBeInTheDocument();

    expect(screen.getByText("Preview Open: true")).toBeInTheDocument();
    expect(screen.getByText("Current Index: 0")).toBeInTheDocument();
    expect(screen.getByText("Total Images: 3")).toBeInTheDocument();
    expect(screen.getByText("Image: Test Title 1")).toBeInTheDocument();
  });
});
