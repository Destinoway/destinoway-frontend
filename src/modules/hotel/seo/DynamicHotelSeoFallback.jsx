export default function DynamicHotelSeoFallback({ hotelName, cityName }) {
  if (!hotelName) return null;

  return (
    <section className="space-y-3">
      {/* ABOUT */}
      <div className="rounded !bg-[#f7fcff] bg-white p-2 shadow-sm">
        <h2 className="mb-1 text-[15px] font-semibold text-gray-900">
          About {hotelName}
        </h2>

        <p className="leading-7 text-gray-600">
          {hotelName}
          {cityName ? ` in ${cityName}` : ""}
          offers accommodation options for travelers looking for comfort,
          convenience and easy access to nearby attractions. Explore hotel
          amenities, room details and booking information on Destonoway.
        </p>
      </div>

      {/* WHY STAY */}
      <div className="rounded !bg-[#f7fcff] bg-white p-2 shadow-sm">
        <h3 className="mb-1 text-[15px] font-semibold text-gray-900">
          Why Stay at {hotelName}
        </h3>

        <ul className="leading-7 text-gray-600">
          <li>• Comfortable stay options and hotel facilities.</li>

          <li>• Convenient location for business and leisure travelers.</li>

          <li>• Easy booking experience with Destonoway.</li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="rounded !bg-[#f7fcff] bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-[15px] font-semibold text-gray-900">
          Hotel Booking FAQs
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-[15px] font-medium text-gray-900">
              What amenities does {hotelName} offer?
            </h4>

            <p className="mt-1 text-gray-600">
              Amenities vary depending on the property and room category
              selected.
            </p>
          </div>

          <div>
            <h4 className="text-[15px] font-medium text-gray-900">
              Is {hotelName} suitable for family stays?
            </h4>

            <p className="mt-1 text-gray-600">
              Families should review room details, facilities and hotel
              amenities before booking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
