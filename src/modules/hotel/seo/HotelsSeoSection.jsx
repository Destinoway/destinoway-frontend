export default function HotelsSeoSection({ children }) {

  if (!children) return null;

  return (
    <section className="!z-20 mt-10">
      <div className="overflow-hidden rounded border border-[#dbe8f1] bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-[#edf3f8] bg-[#f8fbfd] px-6 py-5 md:px-8">
          <h2 className="text-[16px] font-semibold text-[#303030]">
            Destination Guide & Travel Insights
          </h2>

          <p className="mt-1 text-sm text-[#6b7280]">
            Explore destination information, hotel tips and travel guidance.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </section>
  );
}
