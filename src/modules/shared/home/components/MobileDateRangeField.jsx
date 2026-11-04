"use client";

import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
} from "react-aria-components";

import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function MobileDateRangeField({
  value,
  onChange,
  open,
  setOpen,
  variant = "default",
  icon,
}) {
  const start = value?.[0] || dayjs();
  const end = value?.[1] || dayjs().add(1, "day");

  const nights = start && end ? Math.max(0, end.diff(start, "day")) : 0;

  const [activeField, setActiveField] = useState(null);

  // Temporary selection inside popup
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const [isSelectingNewCheckIn, setIsSelectingNewCheckIn] = useState(false);

  const todayDate = today(getLocalTimeZone());

  // ==========================================
  // DAYJS -> CALENDAR DATE
  // ==========================================

  const toCalendarDate = (date) => {
    if (!date) return null;

    const d = dayjs(date);

    return new CalendarDate(d.year(), d.month() + 1, d.date());
  };

  // ==========================================
  // CALENDAR DATE -> DAYJS
  // ==========================================

  const toDayjs = (date) => {
    if (!date) return null;

    return dayjs(
      `${date.year}-${String(date.month).padStart(
        2,
        "0",
      )}-${String(date.day).padStart(2, "0")}`,
    );
  };

  // ==========================================
  // OPEN
  // ==========================================

  const handleOpen = () => {
    setActiveField("checkIn");

    setSelectedCheckIn(toCalendarDate(value?.[0]));

    setSelectedCheckOut(toCalendarDate(value?.[1]));

    setIsSelectingNewCheckIn(false);

    setOpen?.(true);
  };

  // The parent can open the sheet (e.g. after picking a destination). Reset
  // the draft selection when it opens, during render instead of in an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);

    if (open) {
      setActiveField("checkIn");
      setSelectedCheckIn(toCalendarDate(value?.[0]));
      setSelectedCheckOut(toCalendarDate(value?.[1]));
      setIsSelectingNewCheckIn(false);
    }
  }

  // ==========================================
  // CLOSE
  // ==========================================

  const handleClose = () => {
    setActiveField(null);
    setSelectedCheckIn(null);
    setSelectedCheckOut(null);

    setOpen?.(false);
  };

  // ==========================================
  // DATE SELECT
  // ==========================================

  const handleDateChange = (date) => {
    if (!date) return;

    // ========================================
    // CHECK IN
    // ========================================

    if (activeField === "checkIn") {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);

      setActiveField("checkOut");

      return;
    }

    // ========================================
    // CHECK OUT
    // ========================================

    if (activeField === "checkOut") {
      // ----------------------------------------
      // CHECKOUT ALREADY SELECTED
      // ----------------------------------------
      // User ab next date click kar raha hai.
      // Ye click NEW CHECK-IN hona chahiye.
      // ----------------------------------------

      if (selectedCheckOut) {
        setSelectedCheckIn(date);
        setSelectedCheckOut(null);

        // New check-in select ho gaya,
        // ab checkout select karna hai.
        setActiveField("checkOut");

        return;
      }

      // ----------------------------------------
      // NORMAL CHECKOUT
      // ----------------------------------------

      if (!selectedCheckIn) return;

      // Checkout check-in se pehle nahi ho sakta
      if (date.compare(selectedCheckIn) < 0) {
        return;
      }

      setSelectedCheckOut(date);

      setActiveField("checkOut");
    }
  };

  // ==========================================
  // NEXT / DONE
  // ==========================================

  const handleNext = () => {
    // First step
    if (activeField === "checkIn") {
      if (!selectedCheckIn) return;

      setActiveField("checkOut");

      return;
    }

    // Second step
    if (activeField === "checkOut" && selectedCheckIn && selectedCheckOut) {
      const checkIn = toDayjs(selectedCheckIn);
      const checkOut = toDayjs(selectedCheckOut);

      onChange?.([checkIn, checkOut]);

      setActiveField(null);

      setSelectedCheckIn(null);
      setSelectedCheckOut(null);

      setOpen?.(false);
    }
  };

  // ==========================================
  // MIN DATE
  // ==========================================

  const sheetNights =
    selectedCheckIn && selectedCheckOut
      ? toDayjs(selectedCheckOut).diff(toDayjs(selectedCheckIn), "day")
      : 0;

  const calendarMinDate =
    activeField === "checkOut" && selectedCheckIn && !selectedCheckOut
      ? selectedCheckIn
      : todayDate;

  // ==========================================
  // DATE STATE
  // ==========================================

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;

    return (
      date1.year === date2.year &&
      date1.month === date2.month &&
      date1.day === date2.day
    );
  };

  const isBetweenRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) {
      return false;
    }

    return (
      date.compare(selectedCheckIn) > 0 && date.compare(selectedCheckOut) < 0
    );
  };

  // ==========================================
  // CALENDAR
  // ==========================================

  const calendar = (
    <Calendar
      aria-label="Hotel date"
      value={
        activeField === "checkIn"
          ? selectedCheckIn || undefined
          : selectedCheckOut || undefined
      }
      minValue={calendarMinDate}
      onChange={handleDateChange}
      className="w-full"
    >
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-4 flex items-center">
        <Button
          slot="previous"
          aria-label="Previous month"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-(--theme-secondary) shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          <ChevronLeft size={19} />
        </Button>

        <Heading className="flex-1 text-center text-[16px] font-bold text-(--theme-text-primary)" />

        <Button
          slot="next"
          aria-label="Next month"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-(--theme-secondary) shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          <ChevronRight size={19} />
        </Button>
      </div>

      {/* ======================================
          SINGLE CALENDAR
      ====================================== */}

      <CalendarGrid className="w-full [&_td]:p-0.5 [&_th]:pb-2 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:text-gray-400">
        {(date) => (
          <CalendarCell
            date={date}
            className={({ isDisabled }) => {
              const isCheckIn = isSameDate(date, selectedCheckIn);

              const isCheckOut = isSameDate(date, selectedCheckOut);

              const isRange = isBetweenRange(date);

              // CHECK IN / CHECK OUT
              if (isCheckIn || isCheckOut) {
                return `flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-(--theme-secondary) text-[13px] font-semibold text-white shadow-[0_4px_10px_rgba(15,23,42,0.25)]`;
              }

              // BETWEEN RANGE
              if (isRange) {
                return `flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-(--theme-secondary)/10 text-[13px] font-semibold text-(--theme-secondary)`;
              }

              // DISABLED
              if (isDisabled) {
                return `flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-medium text-gray-300`;
              }

              // NORMAL
              return `flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[13px] font-medium text-gray-800 transition hover:bg-slate-100`;
            }}
          />
        )}
      </CalendarGrid>
    </Calendar>
  );

  // ==========================================
  // DEFAULT FIELD
  // ==========================================

  return (
    <>
      {/* LABEL */}

      <div className="mb-1.5 flex items-center justify-between">
        <span
          className={`text-[11px] tracking-[0.08em] uppercase transition-all ${
            activeField === "checkIn"
              ? "font-bold text-[#05144B] underline decoration-2 underline-offset-4"
              : "font-bold text-gray-500"
          } `}
        >
          Check In
        </span>

        <span
          className={`text-[11px] tracking-[0.08em] uppercase transition-all ${
            activeField === "checkOut"
              ? "font-bold text-[#05144B] underline decoration-2 underline-offset-4"
              : "font-bold text-gray-500"
          } `}
        >
          Check Out
        </span>
      </div>

      {/* FIELD */}

      <div className="relative w-full">
        <div
          className="flex h-[64px] w-full cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-colors active:bg-slate-50"
          onClick={handleOpen}
        >
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--theme-secondary)/8 [&_.anticon]:!text-[16px] [&_.anticon]:!text-(--theme-secondary)">
              {icon}
            </span>
          )}

          {/* CHECK IN */}

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-start gap-1">
              <span className="font-jost text-[22px] leading-none font-semibold text-gray-900">
                {start.format("DD")}
              </span>

              <div className="!mt-1 leading-none">
                <span className="text-[12px] font-semibold text-[#444]">
                  {start.format("MMM")} {start.format("YY")}
                </span>
              </div>
            </div>

            <span className="mt-1 truncate text-[11px] font-medium text-gray-500">
              {start.format("dddd")}
            </span>
          </div>

          {/* ARROW */}

          <div className="relative flex shrink-0 items-center px-1">
            <span className="rounded-full border border-gray-200 bg-slate-50 px-2 py-[3px] text-[10px] font-bold whitespace-nowrap text-gray-600">
              {nights > 0
                ? `${nights} ${nights > 1 ? "Nights" : "Night"}`
                : "→"}
            </span>
          </div>

          {/* CHECK OUT */}

          <div className="flex min-w-0 flex-1 flex-col items-end justify-center">
            <div className="flex items-start gap-1">
              <span className="font-jost text-[22px] leading-none font-semibold text-gray-900">
                {end.format("DD")}
              </span>

              <div className="mt-1 leading-none">
                <span className="text-[12px] font-semibold text-[#444]">
                  {end.format("MMM")} {end.format("YY")}
                </span>
              </div>
            </div>

            <span className="mt-1 truncate text-[11px] font-medium text-gray-500">
              {end.format("dddd")}
            </span>
          </div>

          {/* NIGHTS */}
        </div>

        {/* ======================================
            MOBILE BOTTOM SHEET
        ====================================== */}

        {/* Portal: a fixed sheet inside a transformed parent (e.g. a Modal)
            would otherwise be positioned relative to that parent. */}
        {open &&
          typeof document !== "undefined" &&
          createPortal(
            <>
              {/* OVERLAY */}

              <div
                className="fixed inset-0 z-[999998] bg-black/40"
                onClick={handleClose}
              />

              {/* BOTTOM SHEET */}

              <div className="fixed bottom-0 left-0 z-[999999] max-h-[92vh] w-full animate-[slideUp_0.25s_ease-out] overflow-y-auto overscroll-contain rounded-t-2xl bg-white px-4 pt-3 pb-[calc(20px+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.18)]">
                {/* DRAG HANDLE */}

                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />

                {/* TOP */}

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="m-0 text-[17px] font-bold text-(--theme-text-primary)">
                    Select Dates
                  </h3>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  {[
                    {
                      key: "checkIn",
                      label: "Check In",
                      date: selectedCheckIn,
                    },
                    {
                      key: "checkOut",
                      label: "Check Out",
                      date: selectedCheckOut,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      disabled={tab.key === "checkOut" && !selectedCheckIn}
                      onClick={() => setActiveField(tab.key)}
                      className={`rounded-lg px-3 py-2 text-left transition-all disabled:cursor-not-allowed ${
                        activeField === tab.key
                          ? "bg-white shadow-sm ring-1 ring-(--theme-secondary)/25"
                          : "bg-transparent"
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold tracking-[0.08em] uppercase ${
                          activeField === tab.key
                            ? "text-(--theme-secondary)"
                            : "text-gray-500"
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span
                        className={`mt-0.5 block text-[14px] font-semibold ${
                          tab.date ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {tab.date
                          ? toDayjs(tab.date).format("ddd, D MMM")
                          : "Select date"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* CALENDAR */}

                {calendar}

                {/* ==================================
                  NEXT / DONE
              ================================== */}

                <button
                  type="button"
                  disabled={
                    activeField === "checkIn"
                      ? !selectedCheckIn
                      : !selectedCheckOut
                  }
                  onClick={handleNext}
                  className="mt-4 w-full rounded-xl bg-(--theme-secondary) py-3.5 text-[15px] font-semibold text-white! shadow-[0_8px_20px_rgba(15,23,42,0.22)] transition hover:bg-(--theme-hover) disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {activeField === "checkIn"
                    ? "Next"
                    : sheetNights > 0
                      ? `Done · ${sheetNights} ${sheetNights > 1 ? "Nights" : "Night"}`
                      : "Select check-out"}
                </button>
              </div>
            </>,
            document.body,
          )}
      </div>
    </>
  );
}
