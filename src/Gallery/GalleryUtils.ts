import { getImageUrl } from "../Utils/ImageUtils";

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export const GALLERY_IMAGES = {
  photo1: 'gallery/photo1.jpg',
  photo2: 'gallery/photo2.jpg',
  photo3: 'gallery/photo3.jpg',
  photo4: 'gallery/photo4.jpg',
  photo5: 'gallery/photo5.jpg',
  photo6: 'gallery/photo6.jpg'
} as const;

export const useGalleryImages = (): GalleryImage[] => {
  return [
    {
      src: getImageUrl(GALLERY_IMAGES.photo1),
      alt: "Gallery Photo 1",
      title: "Photo 1",
      description: "Description for photo 1"
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo2),
      alt: "Gallery Photo 2",
      title: "Photo 2",
      description: "Description for photo 2"
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo3),
      alt: "Gallery Photo 3",
      title: "Photo 3",
      description: "Description for photo 3"
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo4),
      alt: "Gallery Photo 4",
      title: "Photo 4",
      description: "Description for photo 4"
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo5),
      alt: "Gallery Photo 5",
      title: "Photo 5",
      description: "Description for photo 5"
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo6),
      alt: "Gallery Photo 6",
      title: "Photo 6",
      description: "Description for photo 6"
    }
  ];
};