import { getImageUrl } from "../Utils/ImageUtils";

export interface PhotoMetadata {
  iso: string;
  shutter: string;
  aperture: string;
  camera: string;
  lens: string;
  ev: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface GalleryImageWithMetadata extends GalleryImage {
  metadata?: PhotoMetadata;
}

export const GALLERY_IMAGES = {
  angryOct: "gallery/angry_oct.jpeg",
  archWalkingMan: "gallery/arch_walking_man.jpeg",
  bishopShadow: "gallery/bishop_shadow.jpeg",
  churchBook: "gallery/church_book.jpeg",
  dotsBird: "gallery/dots_bird.jpeg",
  shadow: "gallery/shadow.jpeg",
  stairs: "gallery/stairs.jpeg",
} as const;

export const useGalleryImages = (): GalleryImageWithMetadata[] => {
  return [
    {
      src: getImageUrl(GALLERY_IMAGES.angryOct),
      alt: "Angry Octopus",
      title: "Angry Oct",
      description: "Dynamic street art captured in urban setting",
      metadata: {
        iso: "400",
        shutter: "1/320",
        aperture: "7.1",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.archWalkingMan),
      alt: "Walking man under arch",
      title: "Arch Walking Man",
      description: "Silhouette of person walking through architectural arch",
      metadata: {
        iso: "100",
        shutter: "1/800s",
        aperture: "7.1",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.bishopShadow),
      alt: "Bishop shadow",
      title: "Bishop Shadow",
      description: "Dramatic shadow play with architectural elements",
      metadata: {
        iso: "800",
        shutter: "1/100s",
        aperture: "2.5",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.churchBook),
      alt: "Church book",
      title: "Church Book",
      description: "Religious text in sacred architectural setting",
      metadata: {
        iso: "1600",
        shutter: "1/200s",
        aperture: "2.2",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.dotsBird),
      alt: "Bird with dots pattern",
      title: "Dots Bird",
      description: "Abstract composition featuring bird and geometric patterns",
      metadata: {
        iso: "100",
        shutter: "1/800s",
        aperture: "6.3",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.shadow),
      alt: "Shadow composition",
      title: "Shadow",
      description: "Study of light and shadow in urban environment",
      metadata: {
        iso: "100",
        shutter: "1/640s",
        aperture: "6.3",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.stairs),
      alt: "Architectural stairs",
      title: "Stairs",
      description: "Geometric patterns formed by architectural staircase",
      metadata: {
        iso: "800",
        shutter: "1/400s",
        aperture: "3.5",
        camera: "Nikon D3100",
        lens: "35mm",
        ev: "-0,3",
      },
    },
  ];
};
