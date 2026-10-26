import Link from "next/link";

export default function HeroBlock({ data, titleAs: TitleTag = "h2" }) {
  if (!data) return null;

  const imageUrl = data?.image ? encodeURI(data.image) : null;

  const buttonLink = data?.buttonLink?.startsWith("/")
    ? data.buttonLink
    : data?.buttonLink || "#";

  const hasButton = !!data?.buttonText;

  return (
    <section className="w-full py-0">
      <div
        className="relative mx-auto h-[220px] w-full overflow-hidden rounded bg-cover bg-center bg-no-repeat sm:h-[300px] md:h-[400px] lg:h-[420px]"
        style={{
          backgroundImage: imageUrl
            ? `
              linear-gradient(
                rgba(15,23,42,.45),
                rgba(15,23,42,.55)
              ),
              url(${imageUrl})
            `
            : "linear-gradient(135deg,#0f172a,#1e293b)",
        }}
      >
        {imageUrl && data?.imageAlt && (
          <span
            role="img"
            aria-label={data.imageAlt}
            className="absolute inset-0"
          />
        )}

        <div className="absolute inset-0 bg-black/10" />

        <div
          className={`relative z-10 flex h-full px-6 md:px-10 ${
            hasButton
              ? "items-center justify-center text-center"
              : "items-center justify-start text-left"
          } `}
        >
          <div className={`${hasButton ? "max-w-[820px]" : "max-w-[650px]"}`}>
            {/* TITLE */}
            {data?.title && (
              <TitleTag
                className="text-[25px] leading-tight font-bold text-white sm:text-[30px] md:text-[40px]"
                style={{
                  textShadow: "0 3px 12px rgba(0,0,0,.25)",
                }}
              >
                {data.title}
              </TitleTag>
            )}

            {/* SUBTITLE */}
            {data?.subtitle && (
              <p
                className="mb-6 text-sm leading-7 text-white/95 sm:text-base"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,.18)",
                }}
              >
                {data.subtitle}
              </p>
            )}

            {/* BUTTON */}
            {hasButton && (
              <Link
                href={buttonLink}
                className="inline-flex h-12 min-w-[165px] items-center justify-center rounded-lg bg-[#5bb7ec] px-6 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-90"
              >
                {data.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
