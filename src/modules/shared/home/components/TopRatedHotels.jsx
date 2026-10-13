"use client";

import Image from "next/image";

import { Card, Rate } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

import { useHotelSearchStore } from "@/modules/hotel/store/serchData.store";
import { buildSearchData } from "@/modules/hotel/utils/buildSearchData";
import { navigateToHotels } from "@/modules/hotel/utils/hotelNavigation";
import { useRouter } from "next/navigation";

export default function TopRatedHotels({ hotels }) {
  const data = hotels?.items || [];

  const { draftSearchData } = useHotelSearchStore();
  const router = useRouter();
  const [perRow, setPerRow] = useState(4);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);

  const topStartX = useRef(0);
  const bottomStartX = useRef(0);

  useEffect(() => {
    const updatePerRow = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setPerRow(2);
      } else if (width < 1024) {
        setPerRow(3);
      } else if (width < 1440) {
        setPerRow(4);
      } else {
        setPerRow(5);
      }
    };

    updatePerRow();
    window.addEventListener("resize", updatePerRow);

    return () => window.removeEventListener("resize", updatePerRow);
  }, []);

  // DATA
  const middle = Math.ceil(data.length / 2);

  const topData = useMemo(() => data.slice(0, middle), [data, middle]);

  const bottomData = useMemo(() => data.slice(middle), [data, middle]);

  useEffect(() => {
    if (topData.length <= perRow || isDraggingTop) return;

    const interval = setInterval(() => {
      setTopIndex((prev) => {
        if (prev >= topData.length - perRow) {
          return 0;
        }

        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [topData, perRow, isDraggingTop]);

  // AUTO SLIDE BOTTOM
  useEffect(() => {
    if (bottomData.length <= perRow || isDraggingBottom) return;

    const interval = setInterval(() => {
      setBottomIndex((prev) => {
        if (prev <= 0) {
          return bottomData.length - perRow;
        }

        return prev - 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [bottomData, perRow, isDraggingBottom]);

  // DRAG
  const handleDrag = (startX, endX, type) => {
    const diff = startX - endX;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      if (type === "top") {
        setTopIndex((prev) => Math.min(prev + 1, topData.length - perRow));
      } else {
        setBottomIndex((prev) =>
          Math.min(prev + 1, bottomData.length - perRow),
        );
      }
    } else {
      if (type === "top") {
        setTopIndex((prev) => Math.max(prev - 1, 0));
      } else {
        setBottomIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const handleSearch = (hotel) => {
    const searchData = buildSearchData({
      baseSearchData: draftSearchData,
      city: hotel.city,
      cityId: hotel.cityId,
      destinationData: hotel,
    });

    navigateToHotels(router, searchData);
  };

  // CARD
  const renderCard = (hotel, idx) => (
    <div
      onClick={() => handleSearch(hotel)}
      key={hotel._id}
      className="flex w-1/2 flex-shrink-0 px-1 md:w-1/3 lg:w-1/4 xl:w-1/5"
    >
      <Card
        hoverable
        styles={{
          body: {
            padding: "10px",
          },
        }}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        cover={
          <div className="relative h-[180px] overflow-hidden sm:h-[180px] md:h-[210px] lg:h-[240px]">
            <Image
              src={hotel.image}
              alt={hotel.alt || hotel.name}
              fill
              priority={idx < 2}
              loading={idx < 2 ? "eager" : "lazy"}
              quality={75}
              sizes="(max-width:768px) 50vw,(max-width:1200px) 33vw,20vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        }
      >
        <div className="flex h-full flex-col text-center">
          <h3 className="line-clamp-1 text-xs font-semibold text-gray-800 sm:text-base lg:text-lg">
            {hotel.name}
          </h3>

          <p className="mt-1 line-clamp-2 flex-1 text-[10px] leading-4 text-gray-500 sm:text-sm sm:leading-6">
            {hotel.description}
          </p>
          <div className="scale-75 sm:scale-90 lg:scale-100">
            <Rate disabled allowHalf value={hotel.rating} />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="background-color-bg !mt-[-10px] px-0 py-8 md:py-12">
      <div className="teb-gradient mx-auto w-full rounded-lg px-0 py-10 sm:rounded-xl sm:px-0 md:rounded-2xl md:px-8 md:py-14 lg:w-[85.87%] lg:rounded-3xl lg:px-8 xl:px-10">
        {/* HEADING */}
        <div className="mb-8 text-center text-white md:mb-10">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            {hotels?.title || "Top Rated Hotels"}
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 opacity-90 sm:text-base lg:text-lg">
            We’re committed to offering more than just products we provide
            exceptional experiences.
          </p>
        </div>

        {/* TOP ROW */}
        <div
          className="relative cursor-grab overflow-hidden active:cursor-grabbing"
          onMouseDown={(e) => {
            setIsDraggingTop(true);
            topStartX.current = e.clientX;
          }}
          onMouseUp={(e) => {
            handleDrag(topStartX.current, e.clientX, "top");
            setIsDraggingTop(false);
          }}
          onMouseLeave={() => setIsDraggingTop(false)}
          onTouchStart={(e) => {
            setIsDraggingTop(true);
            topStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            handleDrag(topStartX.current, e.changedTouches[0].clientX, "top");

            setIsDraggingTop(false);
          }}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${topIndex * (100 / perRow)}%)`,
            }}
          >
            {topData.map((hotel, idx) => renderCard(hotel, idx))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          className="relative mt-6 cursor-grab overflow-hidden active:cursor-grabbing md:mt-10"
          onMouseDown={(e) => {
            setIsDraggingBottom(true);
            bottomStartX.current = e.clientX;
          }}
          onMouseUp={(e) => {
            handleDrag(bottomStartX.current, e.clientX, "bottom");
            setIsDraggingBottom(false);
          }}
          onMouseLeave={() => setIsDraggingBottom(false)}
          onTouchStart={(e) => {
            setIsDraggingBottom(true);
            bottomStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            handleDrag(
              bottomStartX.current,
              e.changedTouches[0].clientX,
              "bottom",
            );

            setIsDraggingBottom(false);
          }}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${bottomIndex * (100 / perRow)}%)`,
            }}
          >
            {bottomData.map((hotel, idx) => renderCard(hotel, idx))}
          </div>
        </div>
      </div>
    </div>
  );
}
