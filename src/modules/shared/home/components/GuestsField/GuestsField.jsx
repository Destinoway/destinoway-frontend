"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { Drawer, Popover } from "antd";
import { memo, useMemo, useState } from "react";
import { CHILD_AGES, DEFAULT_GUEST_VALUE, MAX_ROOMS } from "./constants";
import GuestTrigger from "./GuestTrigger";

const normalizeRooms = (value = {}) => {
  if (Array.isArray(value.roomGuests) && value.roomGuests.length) {
    return value.roomGuests.slice(0, MAX_ROOMS).map((room) => ({
      adults: Math.min(8, Math.max(1, Number(room?.adults) || 1)),
      children: (Array.isArray(room?.children) ? room.children : [])
        .slice(0, 2)
        .map((child) => ({ age: child?.age ?? "" })),
    }));
  }
  const count = Math.min(MAX_ROOMS, Math.max(1, Number(value.rooms) || 1));
  let adults = Math.max(count, Number(value.adults) || 2);
  let children = Math.max(0, Number(value.children) || 0);
  const rooms = Array.from({ length: count }, () => ({
    adults: 1,
    children: [],
  }));
  for (let i = count; adults > count && i < count * 8; i += 1) {
    rooms[i % count].adults += 1;
    adults -= 1;
  }
  const ages = value.childAges || [];
  for (let i = 0; children > 0 && i < count * 2; i += 1) {
    rooms[i % count].children.push({
      age: ages[value.children - children] ?? "",
    });
    children -= 1;
  }
  return rooms;
};

function GuestsField({
  value = DEFAULT_GUEST_VALUE,
  onChange,
  open,
  setOpen,
  variant = "default",
  icon,
}) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rooms, setRooms] = useState(() => normalizeRooms(value));
  const [activeRoom, setActiveRoom] = useState(0);

  const safeRooms = useMemo(() => normalizeRooms(value), [value]);
  const updateRoom = (index, update) =>
    setRooms((current) =>
      current.map((room, i) => (i === index ? update(room) : room)),
    );
  const totals = rooms.reduce(
    (sum, room) => ({
      adults: sum.adults + room.adults,
      children: sum.children + room.children.length,
    }),
    { adults: 0, children: 0 },
  );
  const childAges = rooms.flatMap((room) =>
    room.children.map((child) => child.age),
  );
  const agesValid = childAges.every((age) => age !== "" && age != null);

  const apply = () => {
    if (!agesValid) return;
    onChange?.({
      rooms: rooms.length,
      adults: totals.adults,
      children: totals.children,
      childAges: childAges.map(Number),
      pets: Boolean(value?.pets),
      roomGuests: rooms,
    });
    setDrawerOpen(false);
    setOpen?.(false);
  };

  const counterButtonClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-[18px] leading-none text-gray-700 transition-colors hover:border-(--theme-secondary) hover:text-(--theme-secondary) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-gray-300 disabled:hover:text-gray-700";

  const content = (
    <div
      className={`bg-white ${isMobile ? "w-full px-4 pt-1" : "w-97.5 rounded-xl p-4"}`}
      onClick={(event) => event.stopPropagation()}
    >
      {/* The mobile drawer already shows the title in its header. */}
      {!isMobile && (
        <h3 className="m-0 text-base font-bold text-(--theme-text-primary)">
          Rooms & Guests
        </h3>
      )}
      <p className="mt-0.5 mb-3 text-xs text-gray-500">
        Max 8 adults, 2 children per room
      </p>

      <div
        className={`space-y-2.5 overflow-y-auto ${isMobile ? "" : "max-h-[55vh]"}`}
      >
        {rooms.map((room, index) => {
          const isActive = activeRoom === index;

          return (
            <section
              key={index}
              className={`overflow-hidden rounded-xl border transition-colors ${
                isActive
                  ? "border-(--theme-secondary)/30 shadow-[0_2px_10px_rgba(15,23,42,0.06)]"
                  : "border-gray-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveRoom(index)}
                className={`flex w-full cursor-pointer items-center justify-between border-none px-3.5 py-3 text-left ${
                  isActive ? "bg-(--theme-secondary)/5" : "bg-white"
                }`}
              >
                <span className="flex items-center gap-2 text-[14px] font-bold text-(--theme-text-primary)">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                      isActive
                        ? "bg-(--theme-secondary) text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </span>
                  Room {index + 1}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {room.adults} {room.adults > 1 ? "Adults" : "Adult"} ·{" "}
                  {room.children.length}{" "}
                  {room.children.length === 1 ? "Child" : "Children"}
                </span>
              </button>

              {isActive && (
                <div className="space-y-3.5 border-t border-gray-100 px-3.5 py-3.5">
                  {[
                    {
                      label: "Adults",
                      hint: "Age 18+",
                      key: "adults",
                      min: 1,
                      max: 8,
                    },
                    {
                      label: "Children",
                      hint: "Age 0–17 years",
                      key: "children",
                      min: 0,
                      max: 2,
                    },
                  ].map(({ label, hint, key, min, max }) => {
                    const amount =
                      key === "adults" ? room.adults : room.children.length;
                    const change = (delta) =>
                      updateRoom(index, (current) =>
                        key === "adults"
                          ? {
                              ...current,
                              adults: Math.min(
                                max,
                                Math.max(min, current.adults + delta),
                              ),
                            }
                          : {
                              ...current,
                              children:
                                delta > 0
                                  ? [...current.children, { age: "" }]
                                  : current.children.slice(0, -1),
                            },
                      );

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="flex flex-col">
                          <span className="text-[14px] font-semibold text-gray-900">
                            {label}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {hint}
                          </span>
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={`Decrease ${label} in room ${index + 1}`}
                            disabled={amount <= min}
                            onClick={() => change(-1)}
                            className={counterButtonClass}
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-[16px] font-bold text-gray-900">
                            {amount}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${label} in room ${index + 1}`}
                            disabled={amount >= max}
                            onClick={() => change(1)}
                            className={counterButtonClass}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {room.children.map((child, childIndex) => (
                    <label
                      key={childIndex}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-[13px] font-medium text-gray-700"
                    >
                      Child {childIndex + 1} age
                      <select
                        value={child.age}
                        onChange={(event) =>
                          updateRoom(index, (current) => ({
                            ...current,
                            children: current.children.map((item, i) =>
                              i === childIndex
                                ? { age: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className={`h-9 cursor-pointer rounded-lg border bg-white px-2.5 text-[13px] font-semibold text-gray-800 outline-none focus:border-(--theme-secondary) ${
                          child.age === ""
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select age</option>
                        {CHILD_AGES.map((age) => (
                          <option key={age} value={age}>
                            {age} {Number(age) === 1 ? "year" : "years"}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={rooms.length >= MAX_ROOMS}
          onClick={() => {
            setRooms((current) => [...current, { adults: 1, children: [] }]);
            setActiveRoom(rooms.length);
          }}
          className="h-9 cursor-pointer rounded-full border border-dashed border-(--theme-secondary)/50 bg-white px-3.5 text-[13px] font-semibold text-(--theme-secondary) transition-colors hover:bg-(--theme-secondary)/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add room
        </button>
        {rooms.length > 1 && (
          <button
            type="button"
            onClick={() => {
              setRooms((current) => current.filter((_, i) => i !== activeRoom));
              setActiveRoom(Math.max(activeRoom - 1, 0));
            }}
            className="h-9 cursor-pointer rounded-full border border-red-200 bg-white px-3.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Remove room
          </button>
        )}
      </div>

      {!agesValid && (
        <p className="mt-2 mb-0 text-xs text-red-500">
          Select an age for each child.
        </p>
      )}

      {/* On phones the action bar sticks to the bottom of the sheet. */}
      <div
        className={
          isMobile
            ? "sticky bottom-0 -mx-4 mt-4 border-t border-gray-100 bg-white px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom,0px))]"
            : "mt-4"
        }
      >
        <button
          type="button"
          disabled={!agesValid}
          onClick={apply}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border-none bg-(--theme-secondary) text-[15px] font-semibold text-white! shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:bg-(--theme-hover) disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Done · {rooms.length} {rooms.length > 1 ? "Rooms" : "Room"},{" "}
          {totals.adults + totals.children}{" "}
          {totals.adults + totals.children > 1 ? "Guests" : "Guest"}
        </button>
      </div>
    </div>
  );

  const trigger = (
    <GuestTrigger
      variant={variant}
      value={{
        ...value,
        rooms: safeRooms.length,
        adults: safeRooms.reduce((sum, room) => sum + room.adults, 0),
        children: safeRooms.reduce(
          (sum, room) => sum + room.children.length,
          0,
        ),
      }}
      icon={icon}
    />
  );
  if (isMobile)
    return (
      <>
        <div
          className="cursor-pointer"
          onClick={() => {
            setRooms(safeRooms);
            setDrawerOpen(true);
          }}
        >
          {trigger}
        </div>
        <Drawer
          placement="bottom"
          size="auto"
          open={drawerOpen}
          destroyOnHidden
          onClose={() => setDrawerOpen(false)}
          closable={false}
          extra={
            <button
              type="button"
              aria-label="Close"
              onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-[18px] leading-none text-gray-600"
            >
              ×
            </button>
          }
          // Sheet sized to its content (max 90vh) instead of a fixed 90%.
          styles={{
            wrapper: { maxHeight: "90vh" },
            section: {
              maxHeight: "90vh",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            header: { padding: "16px 16px 8px", borderBottom: "none" },
            body: { padding: 0, overflowY: "auto" },
          }}
          title={
            <span className="text-[17px] font-bold text-(--theme-text-primary)">
              Rooms & Guests
            </span>
          }
        >
          {content}
        </Drawer>
      </>
    );
  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      arrow={false}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setRooms(safeRooms);
        setOpen?.(nextOpen);
      }}
      overlayClassName="guest-popover"
      content={content}
    >
      <div className="cursor-pointer">{trigger}</div>
    </Popover>
  );
}

export default memo(GuestsField);
