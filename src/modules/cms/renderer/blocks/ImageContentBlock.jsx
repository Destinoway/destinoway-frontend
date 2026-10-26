import Image from "next/image";
import Link from "next/link";

export default function ImageContentBlock({ data }) {
  if (!data) return null;

  const isRight = data?.layout === "right";

  return (
    <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 ${
            isRight ? "lg:[&>div:first-child]:order-2" : ""
          }`}
        >
          {/* IMAGE */}
          <div className={`w-full ${isRight ? "lg:order-2" : "lg:order-1"}`}>
            {data?.image && (
              <div className="w-full overflow-hidden rounded-[18px] sm:rounded-[22px] lg:rounded-[24px]">
                <Image
                  src={encodeURI(data.image)}
                  alt={data?.imageAlt || data?.title || ""}
                  width={1200}
                  height={700}
                  className="block h-auto max-h-[420px] w-full object-cover shadow-[0_15px_40px_rgba(15,23,42,0.12)] sm:max-h-[460px] lg:max-h-[520px]"
                />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className={`w-full ${isRight ? "lg:order-1" : "lg:order-2"}`}>
            {/* TITLE */}
            {data?.title && (
              <h2 className="mb-4 text-[26px] leading-[1.2] font-bold text-[#0f172a] sm:mb-5 sm:text-[32px] lg:text-[38px]">
                {data.title}
              </h2>
            )}

            {/* CONTENT */}
            {data?.content && (
              <div
                className="text-[14px] leading-7 text-[#475569] sm:text-[15px] sm:leading-7 lg:text-[16px] lg:leading-8"
                dangerouslySetInnerHTML={{
                  __html: data.content,
                }}
              />
            )}

            {/* BUTTON */}
            {data?.buttonText && (
              <Link
                href={data?.buttonLink || "#"}
                className="buttion-background-color mt-6 inline-flex h-[46px] min-w-[150px] items-center justify-center rounded-[10px] px-5 text-[14px] font-semibold !text-white no-underline shadow-[0_10px_25px_rgba(37,99,235,0.18)] transition-all duration-200 hover:-translate-y-0.5 sm:mt-7 sm:h-[50px] sm:min-w-[170px] sm:rounded-[12px] sm:px-6 sm:text-[15px]"
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
