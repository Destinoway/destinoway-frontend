"use client";

export default function SearchButton({ onSearch, floating = true }) {
  return (
    <div
      className={
        floating
          ? "absolute top-[87%] left-1/2 flex w-full -translate-x-1/2 justify-center md:top-[380px] lg:top-[410px] xl:top-[330px] 2xl:top-[325px]"
          : "flex w-full justify-center min-[1205px]:justify-end"
      }
    >
      <button
        type="button"
        onClick={onSearch}
        className="flex cursor-pointer h-[52px] w-[260px] items-center justify-center rounded-xl !text-[20px] font-bold  text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] min-[740px]:h-[60px] min-[740px]:w-[340px] sm:h-[56px] sm:w-[280px] sm:text-[18px] md:h-[65px] md:w-[360px] lg:h-[65px] lg:w-[150px] lg:text-[19px] xl:h-[60px] xl:w-[190px] 2xl:h-[65px] 2xl:w-[200px]  buttion-background-color"
        style={{
          color: "#FFFFFF",
        }}
      >
        Search →
      </button>
    </div>
  );
}
