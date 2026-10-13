"use client";

export default function SearchButton({ onSearch, floating = true }) {
  return (
    <div
      className={
        floating
          ? "absolute top-[87%] left-1/2 flex w-full -translate-x-1/2 justify-center md:top-[380px] lg:top-[410px] xl:top-[330px] 2xl:top-[325px]"
          : "flex w-full justify-center min-[1000px]:justify-end"
      }
    >
      <button
        type="button"
        onClick={onSearch}
        className="buttion-background-color flex h-[52px] w-full cursor-pointer items-center justify-center rounded-xl !text-[18px] font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] min-[700px]:h-[60px] min-[700px]:w-full min-[1000px]:h-[80px] min-[1000px]:w-[150px] min-[1205px]:h-[80px] min-[1205px]:w-[170px] min-[1400px]:h-[75px] min-[1400px]:w-[190px] sm:h-[65px] sm:text-[18px]"
        style={{ color: "#FFFFFF" }}
      >
        Search →
      </button>
    </div>
  );
}
