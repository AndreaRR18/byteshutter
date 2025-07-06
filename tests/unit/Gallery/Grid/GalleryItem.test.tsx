import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GalleryItem } from "../../../../src/Gallery/Grid/GalleryItem";
import type { GalleryImageWithMetadata } from "../../../../src/Gallery/GalleryUtils";

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

const mockImageWithoutOptional: GalleryImageWithMetadata = {
  src: "test-image-minimal.jpg",
  alt: "Minimal test image",
};

describe("GalleryItem", () => {
  it("renders image with all provided properties", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test image alt text");
    expect(image).toHaveAttribute("loading", "lazy");

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(
      screen.getByText("Test description for the image"),
    ).toBeInTheDocument();
  });

  it("renders image without optional content when not provided", () => {
    const mockOnClick = vi.fn();

    render(
      <GalleryItem image={mockImageWithoutOptional} onClick={mockOnClick} />,
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image-minimal.jpg");
    expect(image).toHaveAttribute("alt", "Minimal test image");

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Test description for the image"),
    ).not.toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");
    fireEvent.click(galleryItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockImage);
  });

  it("calls onClick handler when Enter key is pressed", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");
    fireEvent.keyDown(galleryItem, { key: "Enter" });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockImage);
  });

  it("calls onClick handler when Space key is pressed", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");
    fireEvent.keyDown(galleryItem, { key: " " });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockImage);
  });

  it("does not call onClick handler for other keys", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");
    fireEvent.keyDown(galleryItem, { key: "Tab" });
    fireEvent.keyDown(galleryItem, { key: "Escape" });
    fireEvent.keyDown(galleryItem, { key: "ArrowDown" });

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("prevents default behavior for Enter and Space keys", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
    });

    const enterSpy = vi.spyOn(enterEvent, "preventDefault");
    const spaceSpy = vi.spyOn(spaceEvent, "preventDefault");

    galleryItem.dispatchEvent(enterEvent);
    galleryItem.dispatchEvent(spaceEvent);

    expect(enterSpy).toHaveBeenCalled();
    expect(spaceSpy).toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");
    expect(galleryItem).toHaveAttribute("tabIndex", "0");
    expect(galleryItem).toHaveAttribute(
      "aria-label",
      "View Test Title details",
    );
  });

  it("uses fallback aria-label when title is not provided", () => {
    const mockOnClick = vi.fn();

    render(
      <GalleryItem image={mockImageWithoutOptional} onClick={mockOnClick} />,
    );

    const galleryItem = screen.getByRole("button");
    expect(galleryItem).toHaveAttribute("aria-label", "View image details");
  });

  it("renders only title when description is missing", () => {
    const mockOnClick = vi.fn();
    const imageWithTitleOnly: GalleryImageWithMetadata & { description: undefined } = { ...mockImage, description: undefined };

    render(<GalleryItem image={imageWithTitleOnly} onClick={mockOnClick} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(
      screen.queryByText("Test description for the image"),
    ).not.toBeInTheDocument();
  });

  it("renders only description when title is missing", () => {
    const mockOnClick = vi.fn();
    const imageWithDescriptionOnly: GalleryImageWithMetadata & { title: undefined } = { ...mockImage, title: undefined };

    render(
      <GalleryItem image={imageWithDescriptionOnly} onClick={mockOnClick} />,
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(
      screen.getByText("Test description for the image"),
    ).toBeInTheDocument();
  });

  it("does not render content section when both title and description are missing", () => {
    const mockOnClick = vi.fn();
    const imageWithoutContent: GalleryImageWithMetadata & { title: undefined; description: undefined } = {
      ...mockImage,
      title: undefined,
      description: undefined,
    };

    render(<GalleryItem image={imageWithoutContent} onClick={mockOnClick} />);

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Test description for the image"),
    ).not.toBeInTheDocument();
  });

  it("maintains focus and keyboard navigation", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");
    galleryItem.focus();

    expect(document.activeElement).toBe(galleryItem);
  });

  it("handles multiple rapid clicks correctly", () => {
    const mockOnClick = vi.fn();

    render(<GalleryItem image={mockImage} onClick={mockOnClick} />);

    const galleryItem = screen.getByRole("button");

    fireEvent.click(galleryItem);
    fireEvent.click(galleryItem);
    fireEvent.click(galleryItem);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
    expect(mockOnClick).toHaveBeenCalledWith(mockImage);
  });

  it("handles edge case with empty strings", () => {
    const mockOnClick = vi.fn();
    const imageWithEmptyStrings: GalleryImageWithMetadata = {
      ...mockImage,
      title: "",
      description: "",
    };

    render(<GalleryItem image={imageWithEmptyStrings} onClick={mockOnClick} />);

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Test description for the image"),
    ).not.toBeInTheDocument();
  });
});
