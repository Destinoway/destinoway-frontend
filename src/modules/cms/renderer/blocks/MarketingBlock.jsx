import Image from "next/image";

export default function MarketingBlock({ data }) {
  if (!data) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded border border-[#e8eef3] bg-white p-6 md:p-8">
        {data?.bannerTitle && (
          <h2 className="mb-5 text-[30px] font-semibold text-[#303030]">
            {data.bannerTitle}
          </h2>
        )}

        {data?.bannerImage && (
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded">
            <Image
              src={data.bannerImage}
              alt={data.imageAlt || data.bannerTitle || ""}
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              quality={75}
              className="object-cover"
            />
          </div>
        )}

        {data?.content && (
          <div
            className="cms-content text-[#5f6b76]"
            dangerouslySetInnerHTML={{
              __html: data.content,
            }}
          />
        )}
      </div>
    </section>
  );
}
