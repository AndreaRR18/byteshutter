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
}

export interface GalleryImageWithMetadata extends GalleryImage {
  metadata?: PhotoMetadata;
}

export const GALLERY_IMAGES = {
  angryOct: "gallery/angry_oct.jpeg",
  archWalkingMan: "gallery/arch_walking_man.jpeg",
  beetle: "gallery/beetle.jpeg",
  bikeTree: "gallery/bike_tree.jpeg",
  bishopShadow: "gallery/bishop_shadow.jpeg",
  buildingPaint: "gallery/building_paint.jpeg",
  cdRom: "gallery/cd_rom.jpeg",
  churchBook: "gallery/church_book.jpeg",
  dotsBird: "gallery/dots_bird.jpeg",
  harleyDavidson: "gallery/harley_davidson.jpeg",
  lakeSunset: "gallery/lake_sunset.jpeg",
  lightFogMirror: "gallery/light_fog_mirror.jpeg",
  redLipstick: "gallery/red_lipstick.jpeg",
  shadow: "gallery/shadow.jpeg",
  skyStarts: "gallery/sky_starts.jpeg",
  sportsHall: "gallery/sports_hall.jpeg",
  stairs: "gallery/stairs.jpeg",
  trainAndFog: "gallery/train_and_fog.jpeg",
  verticalBuilding: "gallery/vertical_building.jpeg",
  wheatField: "gallery/wheat_field.jpeg",
} as const;

export const useGalleryImages = (): GalleryImageWithMetadata[] => {
  return [
    {
      src: getImageUrl(GALLERY_IMAGES.angryOct),
      alt: "Angry Octopus",
      title: "Angry Oct",
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
      src: getImageUrl(GALLERY_IMAGES.beetle),
      alt: "Beetle",
      title: "Beetle",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.bikeTree),
      alt: "Bike on a road tree",
      title: "Bike on a road tree",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.buildingPaint),
      alt: "Building with paint",
      title: "Building Paint",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.cdRom),
      alt: "CD-ROM",
      title: "CD-ROM",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.harleyDavidson),
      alt: "Harley-Davidson motorcycle",
      title: "Harley-Davidson",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.lakeSunset),
      alt: "Lake at sunset",
      title: "Lake Sunset",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.lightFogMirror),
      alt: "Light fog mirror",
      title: "Light Fog Mirror",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.redLipstick),
      alt: "Red lipstick",
      title: "Red Lipstick",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.skyStarts),
      alt: "Sky with stars",
      title: "Sky Stars",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.sportsHall),
      alt: "Sports hall",
      title: "Sports Hall",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.trainAndFog),
      alt: "Train and fog",
      title: "Train and Fog",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.verticalBuilding),
      alt: "Vertical building",
      title: "Vertical Building",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.wheatField),
      alt: "Wheat field",
      title: "Wheat Field",
    },
    {
      src: getImageUrl(GALLERY_IMAGES.stairs),
      alt: "Architectural stairs",
      title: "Stairs",
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
