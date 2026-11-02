export default function HotelCmsSection({ children }) {
  if (!children) return null;

  return (
    <section className="mt-10  mb-10 overflow-hidden rounded border border-[#dfeaf2] bg-white shadow-sm">
      {/* Header */}
      <div className="border border-[#edf3f8] px-6 py-5 md:px-8 bg-[#f7fcff]">
        <h2 className="text-[24px] font-semibold text-[#1f2937]">
          About This Hotel
        </h2>

        <p className="mt-1 text-sm text-[#6b7280]">
          Hotel information, travel insights and booking guidance.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 md:px-8 md:py-8">{children}</div>
    </section>
  );
}
