import { getImageUrl } from "../Utils/ImageUtils";

export interface PhotoMetadata {
  iso?: string;
  shutter?: string;
  aperture?: string;
  time?: string;
  camera?: string;
  lens?: string;
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
  photo1: 'gallery/photo1.jpg',
  photo2: 'gallery/photo2.jpg',
  photo3: 'gallery/photo3.jpg',
  photo4: 'gallery/photo4.jpg',
  photo5: 'gallery/photo5.jpg',
  photo6: 'gallery/photo6.jpg'
} as const;

export const useGalleryImages = (): GalleryImageWithMetadata[] => {
  return [
    {
      src: getImageUrl(GALLERY_IMAGES.photo1),
      alt: "Gallery Photo 1",
      title: "Mountain Sunrise",
      description: "A breathtaking sunrise captured in the mountains",
      metadata: {
        iso: "100",
        shutter: "1/125s",
        aperture: "8.0",
        time: "March 15, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 24-70mm f/2.8L"
      }
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo2),
      alt: "Gallery Photo 2",
      title: "Urban Architecture",
      description: "Modern building facades in downtown",
      metadata: {
        iso: "200",
        shutter: "1/250s",
        aperture: "5.6",
        time: "March 10, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 16-35mm f/2.8L"
      }
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo3),
      alt: "Gallery Photo 3",
      title: "Street Photography",
      description: "Candid moment captured on busy street",
      metadata: {
        iso: "800",
        shutter: "1/500s",
        aperture: "2.8",
        time: "March 8, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 85mm f/1.2L"
      }
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo4),
      alt: "Gallery Photo 4",
      title: "Nature Close-up",
      description: "Macro photography of morning dew on leaves",
      metadata: {
        iso: "400",
        shutter: "1/60s",
        aperture: "11.0",
        time: "March 5, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 100mm f/2.8L Macro"
      }
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo5),
      alt: "Gallery Photo 5",
      title: "Golden Hour Portrait",
      description: "Portrait session during golden hour",
      metadata: {
        iso: "160",
        shutter: "1/200s",
        aperture: "1.8",
        time: "March 3, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 85mm f/1.2L"
      }
    },
    {
      src: getImageUrl(GALLERY_IMAGES.photo6),
      alt: "Gallery Photo 6",
      title: "Night Cityscape",
      description: "City lights reflected in the water",
      metadata: {
        iso: "3200",
        shutter: "2s",
        aperture: "8.0",
        time: "February 28, 2024",
        camera: "Canon EOS R5",
        lens: "Canon RF 24-70mm f/2.8L"
      }
    }
  ];
};