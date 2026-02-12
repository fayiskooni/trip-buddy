"use client";

import React from "react";
import SphereImageGrid, { SphereImageGridProps } from "@/components/ui/img-sphere";
import { generateSphereImages, DEFAULT_SPHERE_CONFIG } from "@/lib/sphere-images";

/**
 * ImageSphere - A ready-to-use wrapper around SphereImageGrid.
 *
 * Drop this into any page:
 *
 * ```tsx
 * import ImageSphere from "@/components/ui/image-sphere";
 *
 * <ImageSphere />
 * ```
 *
 * Or customize it:
 *
 * ```tsx
 * <ImageSphere
 *   containerSize={500}
 *   autoRotate={false}
 *   imageCount={30}
 *   className="my-custom-class"
 * />
 * ```
 */

interface ImageSphereProps extends Partial<SphereImageGridProps> {
  /** Number of images to display on the sphere (default: 60) */
  imageCount?: number;
}

export default function ImageSphere({
  imageCount = 60,
  ...overrides
}: ImageSphereProps) {
  const images = React.useMemo(() => generateSphereImages(imageCount), [imageCount]);

  return (
    <SphereImageGrid
      images={images}
      {...DEFAULT_SPHERE_CONFIG}
      {...overrides}
    />
  );
}
