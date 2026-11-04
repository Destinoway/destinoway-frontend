import {
  CheckCircleFilled,
  DownOutlined,
  PercentageOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import RelatedDestinations from "../sections/RelatedDestinations";

const WHY_BOOK = [
  {
    icon: <SafetyCertificateOutlined />,
    title: "Verified Hotel Listings",
    text: "Explore hotels with reliable information and transparent details.",
  },
  {
    icon: <PercentageOutlined />,
    title: "Easy Price Comparison",
    text: "Compare hotel pricing and choose accommodation that suits your travel budget.",
  },
  {
    icon: <ThunderboltOutlined />,
    title: "Fast Booking Experience",
    text: "Search and book hotels quickly with a smooth experience.",
  },
];

const BOOKING_TIPS = [
  "Compare hotels before booking to find the right balance between comfort and price.",
  "Review hotel location and nearby attractions before finalizing your stay.",
  "Book early during peak travel seasons for better availability.",
];

const getFaqs = (city) => [
  {
    question: `What are the best areas to stay in ${city}?`,
    answer:
      "The best area depends on your travel purpose, budget and nearby attractions.",
  },
  {
    question: `When should I book hotels in ${city}?`,
    answer:
      "Advance booking is usually recommended during busy seasons and holidays.",
  },
];

function SectionTitle({ children, as: Tag = "h3" }) {
  return (
    <Tag className="flex items-center gap-2.5 text-[17px] leading-snug font-bold text-(--theme-text-primary) sm:text-[19px]">
      <span
        aria-hidden="true"
        className="h-5 w-1 shrink-0 rounded-full bg-(--theme-primary)"
      />
      {children}
    </Tag>
  );
}

// Static content shown below the hotel list when the city has no CMS page.
export default function DynamicSeoFallback({ cityName }) {
  // Search data holds a display name like "Jaipur,Rajasthan,India".
  const city = String(cityName || "")
    .split(",")[0]
    .trim();

  if (!city) return null;

  const faqs = getFaqs(city);

  return (
    <div className="space-y-9 md:space-y-11">
      {/* INTRO */}
      <div>
        <SectionTitle as="h2">Hotels in {city}</SectionTitle>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-[15px]">
          Looking for hotels in {city}? Destonoway helps you compare hotel
          prices, explore verified stays and find accommodation that matches
          your travel plans. Whether you are planning a business trip, family
          vacation or weekend getaway, discover hotel options with an easy
          booking experience.
        </p>
      </div>

      {/* WHY BOOK */}
      <div>
        <SectionTitle>Why Book Hotels with Destonoway</SectionTitle>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {WHY_BOOK.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-gray-200 bg-linear-to-b from-white to-slate-50/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--theme-secondary)/30 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary) transition-colors group-hover:bg-(--theme-secondary) group-hover:text-white">
                {item.icon}
              </span>
              <h4 className="mt-3 text-[15px] font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="mt-1.5 text-[13px] leading-6 text-gray-600 sm:text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TIPS + FAQ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
        <div>
          <SectionTitle>Hotel Booking Tips for {city}</SectionTitle>

          <ul className="mt-4 space-y-2.5">
            {BOOKING_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-slate-50/70 px-3.5 py-3 text-[13px] leading-6 text-gray-700 sm:text-sm"
              >
                <CheckCircleFilled className="mt-[5px] shrink-0 text-[14px] text-emerald-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionTitle>Frequently Asked Questions</SectionTitle>

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
                <p className="px-4 pb-4 text-[13px] leading-6 text-gray-600 sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div>
        <SectionTitle>Popular Hotel Destinations</SectionTitle>
        <div className="mt-4">
          <RelatedDestinations currentCity={city} />
        </div>
      </div>
    </div>
  );
}
