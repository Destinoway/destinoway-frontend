"use client";

export default function SearchButton({ onSearch, floating = true }) {
  return (
    <div
      className={
        floating
          ? "absolute top-[87%] left-1/2 flex w-full -translate-x-1/2 justify-center md:top-95 lg:top-102.5 xl:top-82.5 2xl:top-81.25"
          : "flex w-full justify-center min-[1000px]:justify-end"
      }
    >
      <button
        type="button"
        onClick={onSearch}
        className="buttion-background-color flex h-13 w-full cursor-pointer items-center justify-center rounded-xl text-[18px]! font-bold text-white shadow-lg max-[777px]:mt-1 max-[777px]:text-[17px]! max-[777px]:tracking-wide max-[777px]:shadow-[0_8px_20px_rgba(15,23,42,0.22)] transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] min-[700px]:h-15 min-[700px]:w-full min-[1000px]:h-20 min-[1000px]:w-37.5 min-[1205px]:h-20 min-[1205px]:w-42.5 min-[1400px]:h-18.75 min-[1400px]:w-47.5 sm:h-16.25 sm:text-[18px]"
        style={{ color: "#FFFFFF" }}
      >
        Search →
      </button>
    </div>
  );
}
