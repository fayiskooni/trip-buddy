import { ImageData } from "@/components/ui/img-sphere";

// ==========================================
// TRAVEL IMAGE DATA - Shared Experiences Theme
// ==========================================

const BASE_IMAGES: Omit<ImageData, "id">[] = [
  {
    src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=987",
    alt: "Friends traveling together",
    title: "Travel Together",
    description: "Exploring new destinations with friends makes every journey unforgettable.",
  },
  {
    src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=987",
    alt: "Group hiking adventure",
    title: "Shared Adventures",
    description: "Hit the trails together and discover breathtaking views as a group.",
  },
  {
    src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=987",
    alt: "Beach group trip",
    title: "Beach Getaway",
    description: "Sun, sand, and stories — beach trips are better with friends.",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=987",
    alt: "Scenic mountain landscape",
    title: "Iconic Destinations",
    description: "Explore the world's most iconic spots with fellow travelers.",
  },
  {
    src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=987",
    alt: "Cultural travel experience",
    title: "Cultural Connections",
    description: "Immerse in local cultures and create stories that last forever.",
  },
  {
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=987",
    alt: "Solo traveler with map",
    title: "Journey Begins",
    description: "Every great group adventure starts with a single step.",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=987",
    alt: "Lake and mountains",
    title: "Nature Escapes",
    description: "Connect with nature and fellow travelers in stunning landscapes.",
  },
  {
    src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=987",
    alt: "Venice canal travel",
    title: "European Dreams",
    description: "Wander through Europe's most romantic cities with your travel crew.",
  },
  {
    src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=987",
    alt: "Group photo at sunset",
    title: "Sunset Memories",
    description: "Traveling as a group turns every sunset into a shared memory.",
  },
  {
    src: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&q=80&w=987",
    alt: "Backpackers exploring",
    title: "Backpacking Together",
    description: "Safe, social, and unforgettable — the way travel should be.",
  },
  {
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=987",
    alt: "Road trip adventure",
    title: "Road Trip Stories",
    description: "Open roads and great company create the best travel stories.",
  },
  {
    src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=987",
    alt: "Tropical island paradise",
    title: "Island Hopping",
    description: "Discover paradise together — island adventures await your crew.",
  },
];

// Generate images by repeating the base set
export function generateSphereImages(count: number = 60): ImageData[] {
  const images: ImageData[] = [];
  for (let i = 0; i < count; i++) {
    const baseIndex = i % BASE_IMAGES.length;
    const baseImage = BASE_IMAGES[baseIndex];
    images.push({
      id: `img-${i + 1}`,
      ...baseImage,
      alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})`,
    });
  }
  return images;
}

// ==========================================
// DEFAULT CONFIG - Easily adjustable
// ==========================================

export const DEFAULT_SPHERE_CONFIG = {
  containerSize: 600,
  sphereRadius: 200,
  dragSensitivity: 0.8,
  momentumDecay: 0.96,
  maxRotationSpeed: 6,
  baseImageScale: 0.15,
  hoverScale: 1.3,
  perspective: 1000,
  autoRotate: true,
  autoRotateSpeed: 0.2,
};
