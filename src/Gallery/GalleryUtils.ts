import { getImageUrl } from "../Utils/ImageUtils";

export interface PhotoMetadata {
  iso: string;
  shutter: string;
  aperture: string;
  time: string;
  camera: string;
  lens: string;
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
        shutter: "1/250s",
        aperture: "5.6",
        time: "March 15, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 24-70mm f/2.8L",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.archWalkingMan),
      alt: "Walking man under arch",
      title: "Arch Walking Man",
      description: "Silhouette of person walking through architectural arch",
      metadata: {
        iso: "200",
        shutter: "1/125s",
        aperture: "8.0",
        time: "March 12, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 16-35mm f/2.8L",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.bishopShadow),
      alt: "Bishop shadow",
      title: "Bishop Shadow",
      description: "Dramatic shadow play with architectural elements",
      metadata: {
        iso: "100",
        shutter: "1/60s",
        aperture: "11.0",
        time: "March 10, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 85mm f/1.2L",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.churchBook),
      alt: "Church book",
      title: "Church Book",
      description: "Religious text in sacred architectural setting",
      metadata: {
        iso: "800",
        shutter: "1/30s",
        aperture: "4.0",
        time: "March 8, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 100mm f/2.8L Macro",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.dotsBird),
      alt: "Bird with dots pattern",
      title: "Dots Bird",
      description: "Abstract composition featuring bird and geometric patterns",
      metadata: {
        iso: "320",
        shutter: "1/500s",
        aperture: "2.8",
        time: "March 5, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 70-200mm f/2.8L",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.shadow),
      alt: "Shadow composition",
      title: "Shadow",
      description: "Study of light and shadow in urban environment",
      metadata: {
        iso: "160",
        shutter: "1/200s",
        aperture: "5.6",
        time: "March 3, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 24-70mm f/2.8L",
      },
    },
    {
      src: getImageUrl(GALLERY_IMAGES.stairs),
      alt: "Architectural stairs",
      title: "Stairs",
      description: "Geometric patterns formed by architectural staircase",
      metadata: {
        iso: "200",
        shutter: "1/125s",
        aperture: "8.0",
        time: "March 1, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 16-35mm f/2.8L",
      },
    },
  ];
};
