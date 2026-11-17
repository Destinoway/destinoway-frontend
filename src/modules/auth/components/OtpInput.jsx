"use client";

import { useRef } from "react";

export default function OtpInput({ length = 6, value = "", onChange }) {
  const inputs = useRef([]);

  // Update complete OTP
  const updateOtp = () => {
    const otp = inputs.current
      .map((input) => input?.value || "")
      .join("");

    onChange?.(otp);
  };

  // Handle typing
  const handleChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;

    if (inputs.current[i]) {
      inputs.current[i].value = val;
    }

    if (val && i < length - 1) {
      inputs.current[i + 1]?.focus();
    }

    updateOtp();
  };

  // Handle backspace
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (!inputs.current[i]?.value && i > 0) {
        inputs.current[i - 1]?.focus();
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    inputs.current.forEach((input, i) => {
      if (input) {
        input.value = pasteData[i] || "";
      }
    });

    onChange?.(pasteData);

    const focusIndex = Math.min(pasteData.length, length - 1);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div
      className="flex w-full min-w-0 justify-center gap-1.5
                 sm:gap-2 md:gap-3"
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
          aria-label={`OTP digit ${i + 1}`}
          className="
            box-border min-w-0 w-9 h-10
            flex-1 max-w-12
            rounded-lg border border-gray-300
            text-center text-base font-medium
            outline-none transition-all
            focus:border-[#4A9BB5]
            focus:ring-2 focus:ring-[#4A9BB5]/20
            sm:h-11 sm:text-lg
            md:h-12
          "
        />
      ))}
    </div>
  );
}
