import RelatedDestinations from "../sections/RelatedDestinations";

export default function DynamicSeoFallback({ cityName }) {
  if (!cityName) return null;

  return (
    <section className="space-y-10">
      {/* INTRO */}
      <div>
        <h2 className="mb-3 text-[18px] font-semibold text-[#303030]">
          Hotels in {cityName}
        </h2>

        <p className="leading-6 text-[#5f6b76]">
          Looking for hotels in {cityName}? Destonoway helps you compare hotel
          prices, explore verified stays and find accommodation that matches
          your travel plans. Whether you are planning a business trip, family
          vacation or weekend getaway, discover hotel options with an easy
          booking experience.
        </p>
      </div>

      {/* WHY BOOK */}
      <div>
        <h3 className="mb-5 text-[18px] font-semibold text-[#303030]">
          Why Book Hotels with Destonoway
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded border border-[#e7eef4] bg-[#f8fbfd] p-5">
            <h4 className="mb-2 font-medium text-[#303030]">
              Verified Hotel Listings
            </h4>

            <p className="text-sm leading-6 text-[#64707c]">
              Explore hotels with reliable information and transparent details.
            </p>
          </div>

          <div className="rounded border border-[#e7eef4] bg-[#f8fbfd] p-5">
            <h4 className="mb-2 font-medium text-[#303030]">
              Easy Price Comparison
            </h4>

            <p className="text-sm leading-6 text-[#64707c]">
              Compare hotel pricing and choose accommodation that suits your
              travel budget.
            </p>
          </div>

          <div className="rounded border border-[#e7eef4] bg-[#f8fbfd] p-5">
            <h4 className="mb-2 font-medium text-[#303030]">
              Fast Booking Experience
            </h4>

            <p className="text-sm leading-6 text-[#64707c]">
              Search and book hotels quickly with a smooth experience.
            </p>
          </div>
        </div>
      </div>

      {/* BOOKING TIPS */}
      <div>
        <h3 className="mb-4 text-[18px] font-semibold text-[#303030]">
          Hotel Booking Tips for {cityName}
        </h3>

        <ul className="space-y-2.5 text-[#5f6b76]">
          <li>
            • Compare hotels before booking to find the right balance between
            comfort and price.
          </li>

          <li>
            • Review hotel location and nearby attractions before finalizing
            your stay.
          </li>

          <li>
            • Book early during peak travel seasons for better availability.
          </li>
        </ul>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="mb-3 text-[18px] font-semibold text-[#303030]">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-[#edf3f8] rounded border border-[#edf3f8]">
          <div className="p-4">
            <h4 className="font-medium text-[#303030]">
              What are the best areas to stay in {cityName}?
            </h4>

            <p className="mt-2 text-[#64707c]">
              The best area depends on your travel purpose, budget and nearby
              attractions.
            </p>
          </div>

          <div className="p-4">
            <h4 className="font-medium text-[#303030]">
              When should I book hotels in {cityName}?
            </h4>

            <p className="mt-2 text-[#64707c]">
              Advance booking is usually recommended during busy seasons and
              holidays.
            </p>
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div>
        <h3 className="mb-4 text-[18px] font-semibold text-[#303030]">
          Popular Hotel Destinations
        </h3>

        <div className="flex flex-wrap gap-3">
          <RelatedDestinations currentCity={cityName} />
        </div>
      </div>
    </section>
  );
}
