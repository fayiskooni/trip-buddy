"use client";

import { TripImages } from "@/module/home/ui/constants";
import { useState } from "react";

const ExpandOnHover = () => {
  const [expandedImage, setExpandedImage] = useState(3);

  const getImageWidth = (index: number) =>
    index === expandedImage ? "24rem" : "5rem";

  return (
    <div className="w-full bg-background mt-20">
      <div className="relative grid grid-cols-1 items-center justify-center p-2 transition-all duration-300 ease-in-out lg:flex w-full">
        <div className="w-full h-full overflow-hidden rounded-3xl">
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-6xl px-5">
              <div className="flex w-full items-center justify-center gap-1">
                {TripImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out"
                    style={{
                      width: getImageWidth(idx + 1),
                      height: "24rem",
                    }}
                    onMouseEnter={() => setExpandedImage(idx + 1)}
                  >
                    {/* Quote overlay (only when expanded) */}
                    {expandedImage === idx + 1 && (
                      <div className="absolute inset-0 z-10 flex items-end justify-center p-2">
                        <p className="text-black text-lg font-medium leading-snug glass p-2 rounded-2xl">
                          {image.quote}
                        </p>
                      </div>
                    )}

                    <img
                      className="w-full h-full object-cover"
                      src={image.src}
                      alt={`Image ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandOnHover;
