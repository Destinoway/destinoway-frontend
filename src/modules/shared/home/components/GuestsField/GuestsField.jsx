"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { Button, Drawer, Popover } from "antd";
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

  const content = (
    <div
      className="w-full rounded-xl bg-white p-4 sm:w-[390px]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-base font-bold text-[#172033]">
          Rooms & Guests
        </h3>
        <span className="text-xs text-gray-500">
          Max 8 adults, 2 children per room
        </span>
      </div>
      <div className="max-h-[55vh] space-y-2 overflow-y-auto">
        {rooms.map((room, index) => (
          <section key={index} className="rounded-lg border border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => setActiveRoom(index)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left ${activeRoom === index ? "bg-blue-50" : ""}`}
            >
              <span className="font-semibold text-[#172033]">
                Room {index + 1}
              </span>
              <span className="text-xs text-gray-600">
                {room.adults} Adults · {room.children.length} Children
              </span>
            </button>
            {activeRoom === index && (
              <div className="space-y-3 border-t p-3">
                {[
                  { label: "Adults", key: "adults", min: 1, max: 8 },
                  { label: "Children", key: "children", min: 0, max: 2 },
                ].map(({ label, key, min, max }) => {
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
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-[#172033]">
                        {label}
                        {key === "children" && (
                          <small className="ml-1 text-gray-500">
                            (0–17 years)
                          </small>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Decrease ${label} in room ${index + 1}`}
                          disabled={amount <= min}
                          onClick={() => change(-1)}
                          className="h-8 w-8 rounded-md border disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-semibold">
                          {amount}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${label} in room ${index + 1}`}
                          disabled={amount >= max}
                          onClick={() => change(1)}
                          className="h-8 w-8 rounded-md border disabled:opacity-40"
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
                    className="flex items-center justify-between text-sm"
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
                      className="rounded border border-gray-300 px-2 py-1"
                    >
                      <option value="">Select age</option>
                      {CHILD_AGES.map((age) => (
                        <option key={age} value={age}>
                          {age} years
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            disabled={rooms.length >= MAX_ROOMS}
            onClick={() => {
              setRooms((current) => [...current, { adults: 1, children: [] }]);
              setActiveRoom(rooms.length);
            }}
          >
            + Add room
          </Button>
          {rooms.length > 1 && (
            <Button
              onClick={() => {
                setRooms((current) =>
                  current.filter((_, i) => i !== activeRoom),
                );
                setActiveRoom(Math.max(activeRoom - 1, 0));
              }}
            >
              Remove room
            </Button>
          )}
        </div>
        <Button
          type="primary"
          disabled={!agesValid}
          onClick={apply}
          className="buttion-background-color"
        >
          Done
        </Button>
      </div>
      {!agesValid && (
        <p className="mt-2 mb-0 text-xs text-red-500">
          Select an age for each child.
        </p>
      )}
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
          size="90%"
          open={drawerOpen}
          destroyOnHidden
          onClose={() => setDrawerOpen(false)}
          styles={{ body: { padding: 0, overflowY: "auto" } }}
          title="Rooms & Guests"
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
