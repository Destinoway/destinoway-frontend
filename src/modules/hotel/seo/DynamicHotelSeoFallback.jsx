import {
  CheckCircleFilled,
  CustomerServiceOutlined,
  DownOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const WHY_STAY = [
  {
    icon: <HomeOutlined />,
    title: "Comfortable Stay",
    text: "Comfortable stay options and hotel facilities.",
  },
  {
    icon: <EnvironmentOutlined />,
    title: "Convenient Location",
    text: "Convenient location for business and leisure travelers.",
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "Easy Booking",
    text: "Easy booking experience with Destinoway.",
  },
];

const getAmenityName = (item) =>
  typeof item === "string"
    ? item.trim()
    : String(item?.name || item?.title || "").trim();

function SectionTitle({ children, as: Tag = "h3" }) {
  return (
    <Tag className="m-0 flex items-center gap-2.5 text-[17px] leading-snug font-bold text-(--theme-text-primary) sm:text-[19px]">
      <span
        aria-hidden="true"
        className="h-5 w-1 shrink-0 rounded-full bg-(--theme-primary)"
      />
      {children}
    </Tag>
  );
}

// Static content shown below the hotel details when the hotel has no CMS page.
export default function DynamicHotelSeoFallback({
  hotelName,
  cityName,
  amenities = [],
}) {
  if (!hotelName) return null;

  // Search data can hold a display name like "Jaipur,Rajasthan,India".
  const city = String(cityName || "")
    .split(",")[0]
    .trim();

  // Real facilities from the hotel, not placeholder text.
  const highlights = (Array.isArray(amenities) ? amenities : [])
    .map(getAmenityName)
    .filter(Boolean)
    .slice(0, 8);

  const faqs = [
    {
      question: `What amenities does ${hotelName} offer?`,
      answer:
        "Amenities vary depending on the property and room category selected.",
    },
    {
      question: `Is ${hotelName} suitable for family stays?`,
      answer:
        "Families should review room details, facilities and hotel amenities before booking.",
    },
  ];

  return (
    <div className="space-y-9 md:space-y-11">
      {/* ABOUT */}
      <div>
        <SectionTitle as="h2">About {hotelName}</SectionTitle>
        <p className="mt-3 mb-0 max-w-3xl text-sm leading-7 text-gray-600 sm:text-[15px]">
          {`${hotelName}${city ? ` in ${city}` : ""} offers accommodation options for travelers looking for comfort, convenience and easy access to nearby attractions. Explore hotel amenities, room details and booking information on Destinoway.`}
        </p>

        {highlights.length > 0 && (
          <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
            {highlights.map((name) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-gray-700"
              >
                <CheckCircleFilled className="text-[11px] text-emerald-500" />
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* WHY STAY */}
      <div>
        <SectionTitle>Why Stay at {hotelName}</SectionTitle>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {WHY_STAY.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-gray-200 bg-linear-to-b from-white to-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--theme-secondary)/30 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary) transition-colors group-hover:bg-(--theme-secondary) group-hover:text-white">
                {item.icon}
              </span>
              <h4 className="m-0 mt-3 text-[15px] font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="m-0 mt-1.5 text-[13px] leading-6 text-gray-600 sm:text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <SectionTitle>Hotel Booking FAQs</SectionTitle>

        {/* Native <details> keeps answers in the DOM for SEO */}
        <div className="mt-4 space-y-2.5">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group rounded-xl border border-gray-200 bg-white transition-colors open:border-(--theme-secondary)/30 open:bg-slate-50/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <DownOutlined className="shrink-0 text-[11px] text-gray-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="m-0 px-4 pb-4 text-[13px] leading-6 text-gray-600 sm:text-sm">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
