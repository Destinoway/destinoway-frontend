"use client";

import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const STEPS = ["Select room", "Guest details", "Payment"];

export default function BackgroundSection({
  activeStep = 1,
  showBack = true,
  title = "Review your booking",
  subtitle = "Check your stay details and add guest information to continue.",
}) {
  const router = useRouter();

  return (
    <div className="relative w-full overflow-hidden bg-linear-to-r from-(--theme-gradient-start) to-(--theme-gradient-end) pb-16 sm:pb-20">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-white/5"
      />

      <div className="relative mx-auto flex max-w-312.5 flex-col gap-4 px-4 pt-5 sm:pt-7 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {showBack && (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/10! px-3.5 py-1.5 text-[13px] font-semibold text-white! backdrop-blur-sm transition hover:bg-white/20!"
            >
              <ArrowLeftOutlined className="text-[12px]" />
              Back
            </button>
          )}

          <h1 className="m-0! mt-3! text-[22px] leading-tight font-bold text-white sm:text-[26px]">
            {title}
          </h1>
          <p className="m-0 mt-1 text-[13px] text-white/75 sm:text-[14px]">
            {subtitle}
          </p>
        </div>

        <ol className="m-0 flex list-none items-center gap-2 p-0">
          {STEPS.map((step, index) => {
            const isDone = index < activeStep;
            const isActive = index === activeStep;

            return (
              <li key={step} className="flex items-center gap-2">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className={`h-px w-5 sm:w-8 ${
                      isDone || isActive ? "bg-white/70" : "bg-white/25"
                    }`}
                  />
                )}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-white text-(--theme-gradient-start)"
                        : "border border-white/40 text-white/70"
                  }`}
                >
                  {isDone ? (
                    <CheckOutlined className="text-[10px]" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`text-[12px] font-semibold whitespace-nowrap ${
                    isActive ? "text-white" : "hidden text-white/70 sm:inline"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
