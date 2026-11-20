export default function SectionHeading({ title, description, center = true }) {
  return (
    <div
      className={`z-10 mt-11! mb-4 w-full px-4 md:mb-4 lg:mb-6 xl:mb-6 2xl:mb-8 ${center ? "mx-auto text-center" : "text-left"} max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl`}
    >
      <h2 className="text-xl leading-tight font-bold tracking-tight text-gray-900 min-[375px]:text-2xl min-[425px]:text-[30px] min-[1440px]:text-5xl min-[2560px]:text-6xl md:text-3xl lg:text-4xl">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-2 max-w-xs px-4 text-xs text-gray-500 min-[375px]:text-sm min-[425px]:text-[15px] min-[1440px]:text-xl min-[2560px]:text-2xl sm:mt-3 sm:max-w-sm md:mt-4 md:max-w-md md:text-base lg:max-w-xl lg:text-lg xl:max-w-2xl 2xl:max-w-3xl ${center ? "mx-auto" : ""} `}
        >
          {description}
        </p>
      )}
    </div>
  );
}
