"use client";

import { DatePicker } from "antd";

export default function AppDatePicker({ error, ...props }) {
  return (
    <div>
      <DatePicker
        size="large"
        className={`h-10.75! w-full! rounded! ${
          error ? "border-red-500!" : ""
        } `}
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
