"use client";

import Image from "next/image";

const ViewHotelGalleryMobile = ({
  images = [],
  onOpen,
  onBack,
  onWishlist,
  isWishlisted,
}) => {
  const getHDImage = (url) => {
    if (!url) return "/images/heroimage.jpg";
    return url.replace("_t.", "_y.").replace("_b.", "_y.");
  };

  const imageUrls = (Array.isArray(images) ? images : [])
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.url || item?.ImageURL || item?.image || item?.src || "",
    )
    .filter(Boolean);
  const fallbackImage = imageUrls[0] || "/images/heroimage.jpg";
  const gallery = Array.from({ length: 5 }, (_, index) =>
    getHDImage(imageUrls[index] || fallbackImage),
  );

  const totalPhotos = imageUrls.length;

  return (
    <div className="relative overflow-hidden rounded-b-[28px] bg-white">
      <div
        className="grid gap-[3px] p-[6px]"
        style={{
          gridTemplateColumns: "2.2fr 1fr 1fr",
          gridTemplateRows: "127px 127px",
        }}
      >
        {/* Main Image */}
        <div
          className="relative overflow-hidden rounded-tl-xl rounded-bl-xl"
          style={{ gridColumn: "1 / 2", gridRow: "1 / 3" }}
        >
          <Image
            src={gallery[0]}
            alt="Hotel"
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>

        {/* Top Center */}
        <div className="relative overflow-hidden">
          <Image
            src={gallery[1]}
            alt="Hotel"
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Top Right */}
        <div className="relative overflow-hidden rounded-tr-xl">
          <Image
            src={gallery[2]}
            alt="Hotel"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        {/* Bottom Center */}
        <div className="relative overflow-hidden">
          <Image
            src={gallery[3]}
            alt="Hotel"
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Bottom Right */}
        <div
          onClick={onOpen}
          className="relative cursor-pointer overflow-hidden rounded-br-xl"
        >
          <Image
            src={gallery[4]}
            alt="Hotel"
            fill
            unoptimized
            className="object-cover"
          />

          {totalPhotos > 0 && (
            <>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
                <span className="text-[30px] leading-none font-bold">
                  +{Math.max(totalPhotos - 4, 0)}
                </span>
                <span className="mt-2 text-center text-[11px] leading-4 font-medium">
                  Property &
                  <br />
                  Guest Photos
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewHotelGalleryMobile;
