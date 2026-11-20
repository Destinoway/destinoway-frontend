"use client";

import { Select } from "antd";
import { useState } from "react";

export default function AppSelect({
  label,
  error,
  value,
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const isActive = focused || value !== undefined || value !== null;

  return (
    <div className="w-full">
      <div className="relative">
        <Select
          size="large"
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // className={`custom-select h-[44px]! w-full rounded ${
          //   error ? "select-error" : ""
          // } ${className}`}
          className={`custom-select h-11! w-full rounded pt-2.5! text-[16px]! ${
            error ? "border-red-500!" : ""
          } ${className}`}
          {...props}
        />

        {label && (
          <label
            className={`pointer-events-none absolute left-3 z-10 bg-white px-1 transition-all duration-200 ${
              isActive
                ? "-top-2 text-[13px] most-text-color"
                : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
            }`}
          >
            {label}
          </label>
        )}
      </div>

      {error && <p className="mt-2! text-xs text-red-500">{error}</p>}
    </div>
  );
}
