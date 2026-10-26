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
          <img
            src={data.bannerImage}
            alt={data.imageAlt || data.bannerTitle || ""}
            className="mb-6 w-full rounded object-cover"
          />
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
