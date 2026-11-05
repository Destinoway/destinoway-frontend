import { BankOutlined } from "@ant-design/icons";

// Wrapper for the content below the hotel details (CMS or static fallback).
export default function HotelCmsSection({ children }) {
  if (!children) return null;

  return (
    <section className="relative z-0 mt-8 mb-10 md:mt-10">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-r from-(--theme-gradient-start) to-(--theme-gradient-end) px-4 py-5 sm:px-6 md:px-8 md:py-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-24 -bottom-14 h-28 w-28 rounded-full bg-white/5"
          />

          <div className="relative flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[18px] text-white ring-1 ring-white/25">
              <BankOutlined />
            </span>

            <div className="min-w-0">
              <p className="m-0 text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                Stay Guide
              </p>
              <h2 className="m-0 mt-0.5 text-[17px] leading-snug font-bold text-white sm:text-[19px]">
                About This Hotel
              </h2>
              <p className="m-0 mt-1 text-[13px] leading-relaxed text-white/80 sm:text-sm">
                Hotel information, travel insights and booking guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</div>
      </div>
    </section>
  );
}
