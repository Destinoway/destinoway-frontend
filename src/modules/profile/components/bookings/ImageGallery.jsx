"use client";

import { Modal } from "antd";
import { useState } from "react";

export default function ImageGallery({ images = [], fallbackImage = "" }) {
  const [open, setOpen] = useState(false);

  const mainImage = images?.[0];
  const smallImages = images?.slice(1, 4) || [];
  const handleImageError = (event) => {
    if (fallbackImage && event.currentTarget.src !== fallbackImage) {
      event.currentTarget.src = fallbackImage;
    }
  };

  return (
    <>
      <div className="w-full shrink-0">
        {/* MAIN IMAGE */}
        <div
          className="h-[180px] w-full cursor-pointer overflow-hidden rounded-t-xl"
          onClick={() => setOpen(true)}
        >
          <img
            src={mainImage}
            alt="hotel"
            onError={handleImageError}
            className="h-full w-full object-cover"
          />
        </div>

        {/* SMALL IMAGES */}
        <div className="mt-2 grid grid-cols-4 gap-2 px-1 pb-2">
          {smallImages.map((img, i) => {
            const isLast = i === 2 && images.length > 4;

            return (
              <div
                key={i}
                className="relative h-[60px] w-full cursor-pointer overflow-hidden rounded-md"
                onClick={() => setOpen(true)}
              >
                <img
                  src={img}
                  alt="thumb"
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />

                {/* VIEW ALL */}
                {isLast && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[11px] font-medium text-white">
                    +{images.length - 3} View All
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="85%"
        centered
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.map((img, i) => (
            <div key={i} className="h-[200px] w-full">
              <img
                src={img}
                alt="gallery"
                onError={handleImageError}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
