import Link from "next/link";

export default function CTABlock({ data }) {
  if (!data) return null;

  const backgroundImage = data?.background || "";

  return (
    <section
      className="relative overflow-hidden py-10 sm:py-6 md:py-6"
      style={{
        backgroundImage: backgroundImage
          ? `url("${backgroundImage}")`
          : "linear-gradient(135deg, #0f172a, #1e293b)",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* BACKGROUND OVERLAY */}
      {backgroundImage && <div className="absolute inset-0 bg-black/40" />}

      <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-37.5 items-center justify-between gap-8 md:min-h-37.5 lg:gap-12">
          {/* LEFT CONTENT */}
          <div className="max-w-200">
            {data?.title && (
              <h2 className="mb-3 text-[26px] leading-[1.2] font-bold text-white sm:text-[30px] md:text-[36px]">
                {data.title}
              </h2>
            )}

            {data?.description && (
              <p className="max-w-180 text-[14px] leading-6 text-white/90 sm:text-[15px] sm:leading-7 md:text-[16px]">
                {data.description}
              </p>
            )}
          </div>

          {/* RIGHT BUTTON */}
          {data?.buttonText && (
            <div className="shrink-0">
              <Link
                href={data?.buttonLink || "#"}
                className="buttion-background-color inline-flex min-w-37.5 items-center justify-center rounded-lg px-7 py-3.5 text-sm font-semibold text-white! shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
              >
                {data.buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
