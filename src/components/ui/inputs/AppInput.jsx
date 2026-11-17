"use client";

import { Input } from "antd";
import { forwardRef, useState } from "react";

const AppInput = forwardRef(
  ({ label, error, value, onChange, className = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const isActive = focused || !!value;

    return (
      <div className="w-full">
        <div className="relative">
          <Input
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`h-11! rounded px-4! pt-2.5! text-[16px]! ${
              error ? "border-red-500!" : ""
            } ${className}`}
            {...props}
          />

          <label
            className={`pointer-events-none absolute left-3 z-10 bg-white px-1 transition-all duration-200 ${
              isActive
                ? "-top-2 text-[13px] most-text-color"
                : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
            }`}
          >
            {label}
          </label>
        </div>

        {error && <p className="mt-1 mt-2! text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

AppInput.displayName = "AppInput";

export default AppInput;
