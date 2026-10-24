"use client";

import { Checkbox, ConfigProvider } from "antd";
import PriceBreakupCard from "./PriceBreakupCard";

export default function BookingAgreement({ checked, onChange, bookingData }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
        },
      }}
    >
      <div className="w-full">
        {/* ==================================================
            PRICE BREAKUP
            ================================================== */}

       

        {/* ==================================================
            AGREEMENT
            ================================================== */}

        <div className="rounded py-3">
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="agreement-checkbox"
          >
            <span className="font-roboto! text-[14px]! leading-6! font-medium! text-[#555]">
              I agree to Destonoway terms, cancellation policy and booking
              conditions.
            </span>
          </Checkbox>
        </div>
      </div>
    </ConfigProvider>
  );
}
