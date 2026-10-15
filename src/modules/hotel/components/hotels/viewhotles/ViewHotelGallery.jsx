"use client";

import Image from "next/image";

const ViewHotelGallery = ({ images = [], onOpen }) => {
  const galleryImages = Array.isArray(images) ? images : [];

  const getHDImage = (url) => {
    if (!url || typeof url !== "string") {
      return "/images/heroimage.jpg";
    }

    return url.replace("_t.", "_y.").replace("_b.", "_y.");
  };

  const imageUrls = galleryImages
    .map((item) => {
      if (typeof item === "string") {
        return getHDImage(item);
      }

      if (item && typeof item === "object") {
        return getHDImage(
          item?.url || item?.ImageURL || item?.image || item?.src || "",
        );
      }

      return "";
    })
    .filter(Boolean);

  const totalPhotos = imageUrls.length;

  const fallbackImage = "/images/heroimage.jpg";

  const getImage = (index) => {
    return imageUrls[index] || imageUrls[0] || fallbackImage;
  };

  /*
   * Empty gallery
   */
  if (!imageUrls.length) {
    return (
      <div
        onClick={onOpen}
        className="relative h-full min-h-[360px] w-full cursor-pointer overflow-hidden rounded-xl"
      >
        <Image
          src={fallbackImage}
          alt="Hotel"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-[360px] w-full grid-cols-[1.35fr_1.65fr] gap-2 overflow-hidden rounded-xl">
      {/* Main Image */}
      <div
        onClick={onOpen}
        className="relative h-full min-h-0 cursor-pointer overflow-hidden rounded-l-xl"
      >
        <Image
          src={getImage(0)}
          alt="Hotel main image"
          fill
          priority
          sizes="42vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      {/* Small Images */}
      <div className="grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-2">
        {Array.from({ length: 4 }).map((_, index) => {
          const imageIndex = index + 1;
          const isLast = index === 3;

          return (
            <div
              key={imageIndex}
              onClick={onOpen}
              className="relative h-full min-h-0 cursor-pointer overflow-hidden"
            >
              <Image
                src={getImage(imageIndex)}
                alt={`Hotel gallery ${imageIndex + 1}`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />

              {isLast && totalPhotos > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <div className="rounded-lg bg-black/55 px-5 py-3 text-center text-white backdrop-blur-sm">
                    <p className="text-2xl font-bold">{totalPhotos}</p>

                    <p className="text-xs font-medium">Photos</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewHotelGallery;
