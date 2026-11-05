"use client";

import {
  Button,
  CalendarCell,
  CalendarGrid,
  Heading,
  RangeCalendar,
} from "react-aria-components";

import {
  CalendarDate,
  getLocalTimeZone,
  today,
} from "@internationalized/date";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribeToMount = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

export default function DesktopDateRangeField({
  value,
  onChange,
  open,
  setOpen,
  variant = "default",
  icon,
}) {
  const start = value?.[0] || dayjs();
  const end = value?.[1] || dayjs().add(1, "day");

  const nights =
    start && end ? Math.max(0, end.diff(start, "day")) : 0;

  const [activeField, setActiveField] = useState(null);
  const [calendarKey, setCalendarKey] = useState(0);
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMounted,
    getServerMounted,
  );

  const fieldRef = useRef(null);
  const popupRef = useRef(null);

  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
  });

  const updatePopupPosition = () => {
    if (!fieldRef.current) return;

    const rect = fieldRef.current.getBoundingClientRect();

    setPopupPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  };

  const scrollPageToShowCalendar = () => {
    if (!popupRef.current) return;

    const popupRect = popupRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const topMargin = 20;
    const bottomMargin = 20;
    const popupTop = popupRect.top;
    const popupBottom = popupRect.bottom;
    const popupHeight = popupRect.height;

    if (popupBottom > viewportHeight - bottomMargin) {
      const requiredScroll =
        popupBottom - (viewportHeight - bottomMargin);

      window.scrollBy({
        top: requiredScroll,
        behavior: "smooth",
      });

      return;
    }

    if (popupTop < topMargin) {
      const requiredScroll = popupTop - topMargin;

      window.scrollBy({
        top: requiredScroll,
        behavior: "smooth",
      });

      return;
    }

    if (
      popupTop >= topMargin &&
      popupBottom <= viewportHeight - bottomMargin
    ) {
      return;
    }

    if (popupHeight <= 0) return;
  };

  useEffect(() => {
    if (!open) return;

    updatePopupPosition();

    const timer = setTimeout(() => {
      updatePopupPosition();

      requestAnimationFrame(() => {
        scrollPageToShowCalendar();
      });
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePositionUpdate = () => {
      updatePopupPosition();
    };

    window.addEventListener("resize", handlePositionUpdate);
    window.addEventListener("scroll", handlePositionUpdate, true);

    return () => {
      window.removeEventListener("resize", handlePositionUpdate);
      window.removeEventListener(
        "scroll",
        handlePositionUpdate,
        true,
      );
    };
  }, [open]);

  const todayDate = today(getLocalTimeZone());

  const toCalendarDate = (date) => {
    if (!date) return null;

    const d = dayjs(date);

    return new CalendarDate(
      d.year(),
      d.month() + 1,
      d.date(),
    );
  };

  const toDayjs = (date) => {
    if (!date) return null;

    return dayjs(
      `${date.year}-${String(date.month).padStart(
        2,
        "0",
      )}-${String(date.day).padStart(2, "0")}`,
    );
  };

  const checkInValue = toCalendarDate(value?.[0]);
  const checkOutValue = toCalendarDate(value?.[1]);

  const handleOpen = () => {
    setActiveField("checkIn");
    setCalendarKey((prev) => prev + 1);

    requestAnimationFrame(() => {
      updatePopupPosition();
    });

    setOpen?.(true);
  };

  const handleClose = () => {
    setActiveField(null);
    setOpen?.(false);
  };

  const handleDatePress = () => {
    setActiveField("checkOut");
  };

  const handleRangeChange = (range) => {
    if (!range?.start || !range?.end) {
      return;
    }

    const checkIn = toDayjs(range.start);
    const checkOut = toDayjs(range.end);

    onChange?.([checkIn, checkOut]);

    setActiveField(null);

    requestAnimationFrame(() => {
      setOpen?.(false);
    });
  };

  const getCellClass = ({
    isSelected,
    isSelectionStart,
    isSelectionEnd,
    isDisabled,
    isOutsideMonth,
  }) => {
    if (isDisabled || isOutsideMonth) {
      return `
        flex
        h-8 w-8
        sm:h-9 sm:w-9
        lg:h-10 lg:w-10
        items-center
        justify-center
        rounded-full
        text-[11px]
        sm:text-[12px]
        lg:text-[13px]
        text-gray-300
      `;
    }

    if (isSelectionStart || isSelectionEnd) {
      return `
        flex
        h-8 w-8
        sm:h-9 sm:w-9
        lg:h-10 lg:w-10
        cursor-pointer
        items-center
        justify-center
        rounded-full
        buttion-background-color
        text-[11px]
        sm:text-[12px]
        lg:text-[13px]
        font-semibold
        text-white
        transition-all
      `;
    }

    if (isSelected) {
      return `
        flex
        h-8 w-8
        sm:h-9 sm:w-9
        lg:h-10 lg:w-10
        cursor-pointer
        items-center
        justify-center
        rounded-full
        bg-[#E8F0FF]
        text-[11px]
        sm:text-[12px]
        lg:text-[13px]
        font-medium
        most-text-color
        transition-all
      `;
    }

    return `
      flex
      h-8 w-8
      sm:h-9 sm:w-9
      lg:h-10 lg:w-10
      cursor-pointer
      items-center
      justify-center
      rounded-full
      text-[11px]
      sm:text-[12px]
      lg:text-[13px]
      font-medium
      text-[#222]
      hover:bg-[#EEF3FF]
      transition-all
    `;
  };

  const calendar = (
    <RangeCalendar
      key={calendarKey}
      aria-label="Hotel dates"
      defaultValue={
        checkInValue && checkOutValue
          ? {
              start: checkInValue,
              end: checkOutValue,
            }
          : undefined
      }
      minValue={todayDate}
      visibleDuration={{ months: 2 }}
      pageBehavior="visible"
      firstDayOfWeek="mon"
      onChange={handleRangeChange}
      className="w-full"
    >
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <Button
          slot="previous"
          aria-label="Previous months"
          className="most-text-color flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F5F7FF] transition hover:bg-[#E8F0FF] disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
        >
          <ChevronLeft
            size={17}
            className="sm:h-4.75 sm:w-4.75"
            strokeWidth={2.5}
          />
        </Button>

        <Heading className="most-text-color flex-1 text-center text-[13px] font-bold whitespace-nowrap sm:text-[14px] lg:text-[16px]" />

        <Button
          slot="next"
          aria-label="Next months"
          className="most-text-color flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F5F7FF] transition hover:bg-[#E8F0FF] disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
        >
          <ChevronRight
            size={17}
            className="sm:h-4.75 sm:w-4.75"
            strokeWidth={2.5}
          />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:gap-8">
        <CalendarGrid className="w-full min-w-0">
          {(date) => (
            <CalendarCell
              date={date}
              onClick={handleDatePress}
              className={getCellClass}
            />
          )}
        </CalendarGrid>

        <CalendarGrid
          offset={{ months: 1 }}
          className="w-full min-w-0"
        >
          {(date) => (
            <CalendarCell
              date={date}
              onClick={handleDatePress}
              className={getCellClass}
            />
          )}
        </CalendarGrid>
      </div>
    </RangeCalendar>
  );

  const portalPopup =
    mounted &&
    open &&
    createPortal(
      <>
        <div
          className="fixed inset-0 z-9999999998"
          onClick={handleClose}
        />

        <div
          ref={popupRef}
          className="fixed z-9999999999 w-180 max-w-[calc(100vw-16px)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl sm:p-4"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between border-b border-gray-200 px-1 pb-3 sm:mb-4">
            <span
              className={`text-[12px] sm:text-[14px] ${
                activeField === "checkIn"
                  ? "most-text-color font-bold underline decoration-2 underline-offset-4"
                  : "font-medium text-gray-500"
              }`}
            >
              Check In
            </span>

            <span className="text-gray-300">→</span>

            <span
              className={`text-[12px] sm:text-[14px] ${
                activeField === "checkOut"
                  ? "most-text-color font-bold underline decoration-2 underline-offset-4"
                  : "font-medium text-gray-500"
              }`}
            >
              Check Out
            </span>
          </div>

          {calendar}
        </div>
      </>,
      document.body,
    );

  if (variant === "compact") {
    return (
      <>
        <div ref={fieldRef} className="relative w-full">
          <div
            className="relative h-12.75 w-full cursor-pointer rounded-md border-0 bg-white px-2 sm:px-3"
            onClick={handleOpen}
          >
            <div className="flex h-full w-full items-center gap-1 sm:gap-2">
              {icon && (
                <div className="shrink-0">
                  {icon}
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <span
                  className={`truncate text-[10px] leading-none sm:text-[11px] ${
                    activeField === "checkIn"
                      ? "font-bold text-[#05144B]"
                      : "font-semibold text-gray-600"
                  }`}
                >
                  Check In
                </span>

                <div className="mt-0.5 flex items-center gap-1">
                  <span className="text-[16px] leading-none font-bold text-[#222] sm:text-[17px]">
                    {start.format("DD")}
                  </span>

                  <span className="text-[10px] leading-none font-semibold text-gray-600 sm:text-[11px]">
                    {start.format("MMM")}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-center">
                <span className="text-[13px] font-medium text-gray-400 sm:text-[14px]">
                  →
                </span>

                {nights > 0 && (
                  <span className="text-[8px] font-bold leading-none text-[#0077B6]">
                    {nights}N
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-end justify-center">
                <span
                  className={`truncate text-[10px] leading-none sm:text-[11px] ${
                    activeField === "checkOut"
                      ? "font-bold text-[#05144B]"
                      : "font-semibold text-gray-600"
                  }`}
                >
                  Check Out
                </span>

                <div className="mt-0.5 flex items-center gap-1">
                  <span className="text-[16px] leading-none font-bold text-[#222] sm:text-[17px]">
                    {end.format("DD")}
                  </span>

                  <span className="text-[10px] leading-none font-semibold text-gray-600 sm:text-[11px]">
                    {end.format("MMM")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {portalPopup}
      </>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-evenly">
        <span
          className={`text-[12px] transition-all sm:text-[13px] lg:text-[14px] ${
            activeField === "checkIn"
              ? "most-text-color font-bold underline decoration-2 underline-offset-4"
              : "font-semibold text-[#222]"
          }`}
        >
          Check In
        </span>

        <span
          className={`ml-5! text-[12px] transition-all sm:text-[13px] lg:text-[14px] ${
            activeField === "checkOut"
              ? "most-text-color font-bold underline decoration-2 underline-offset-4"
              : "font-semibold text-[#222]"
          }`}
        >
          Check Out
        </span>
      </div>

      <div ref={fieldRef} className="relative w-full">
        <div
          className="flex h-15 w-full cursor-pointer items-center rounded-md border border-[#d9d9d9] bg-white px-2 py-2 transition-all hover:border-[#0077b6] sm:h-15.5 sm:px-2 sm:py-3 lg:h-16.25"
          onClick={handleOpen}
        >
          {icon && (
            <div className="mr-1 shrink-0 sm:mr-2">
              {icon}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-start gap-1">
              <span className="text-[21px] leading-none font-semibold text-[#222] sm:text-[23px] lg:text-[26px]">
                {start.format("DD")}
              </span>

              <div className="mt-1 leading-none sm:mt-1.5 lg:mt-2">
                <span className="text-[10px] font-semibold text-[#444] sm:text-[11px] lg:text-[12px]">
                  {start.format("MMM")} {start.format("YY")}
                </span>
              </div>
            </div>

            <span className="mt-1 truncate text-[9px] font-medium text-[#777] uppercase sm:mt-1.5 sm:text-[10px] lg:mt-2 lg:text-[12px]">
              {start.format("dddd")}
            </span>
          </div>

          <div className="mx-2 shrink-0 sm:mx-3 lg:mx-4">
            <span className="most-text-color text-[20px] sm:text-[24px] lg:text-[28px]">
              →
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-end justify-center">
            <div className="flex items-start gap-1">
              <span className="text-[21px] leading-none font-semibold text-[#222] sm:text-[23px] lg:text-[26px]">
                {end.format("DD")}
              </span>

              <div className="mt-1 leading-none sm:mt-1.5 lg:mt-2">
                <span className="text-[10px] font-semibold text-[#444] sm:text-[11px] lg:text-[12px]">
                  {end.format("MMM")} {end.format("YY")}
                </span>
              </div>
            </div>

            <span className="mt-1 truncate text-[9px] font-medium text-[#777] uppercase sm:mt-1.5 sm:text-[10px] lg:mt-2 lg:text-[12px]">
              {end.format("dddd")}
            </span>
          </div>

          {nights > 0 && (
            <div className="buttion-background-color ml-2 hidden shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold text-white sm:block lg:ml-5 lg:text-[10px]">
              {nights}N
            </div>
          )}
        </div>
      </div>

      {portalPopup}
    </>
  );
}
