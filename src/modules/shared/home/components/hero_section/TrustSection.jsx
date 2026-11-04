"use client";

import {
  CustomerServiceOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  TagsOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

// Alternating tones: theme navy and gold accent.
const TONES = {
  navy: "bg-(--theme-secondary)/8 text-(--theme-secondary)",
  gold: "bg-amber-50 text-amber-500",
};

const trustItems = [
  {
    id: 1,
    icon: <SafetyCertificateOutlined />,
    tone: "navy",
    title: "Secure Payments",
    shortTitle: "Secure Payments",
    description: "Your payment information is safe with us.",
  },
  {
    id: 2,
    icon: <TrophyOutlined />,
    tone: "gold",
    title: "Best Price Guarantee",
    shortTitle: "Best Price",
    description: "Find a lower price? We'll match it for you.",
  },
  {
    id: 3,
    icon: <CustomerServiceOutlined />,
    tone: "navy",
    title: "24/7 Support",
    shortTitle: "24/7 Support",
    description: "We're here to help you anytime, anywhere.",
  },
  {
    id: 4,
    icon: <TagsOutlined />,
    tone: "gold",
    title: "Easy Booking",
    shortTitle: "Easy Booking",
    description: "Book in just a few clicks with a hassle-free experience.",
  },
  {
    id: 5,
    icon: <GlobalOutlined />,
    tone: "navy",
    title: "Worldwide Coverage",
    shortTitle: "Worldwide",
    description: "Thousands of destinations across the globe.",
  },
  {
    id: 6,
    icon: <SafetyOutlined />,
    tone: "gold",
    title: "Safe & Trusted",
    shortTitle: "Safe & Trusted",
    description: "Trusted by millions of travelers worldwide.",
  },
];

// One responsive layout: 3 compact tiles per row on phones, 3 detailed
// columns on tablets, a single 6-column strip on desktop.
export default function TrustSection() {
  return (
    <section className="background-color-bg w-full pt-5 min-[778px]:pt-[30px] md:mt-[90px] xl:mt-[80px] 2xl:mt-[99px]">
      <div className="mx-auto w-[94%] md:w-[92%] lg:w-[94%] xl:w-[82%]">
        {/* gap-px over a grey background draws hairline dividers at any column count */}
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-[0_4px_20px_rgba(15,23,42,0.06)] lg:grid-cols-6">
          {trustItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-center gap-2 bg-white px-2 py-4 text-center transition-colors duration-300 hover:bg-slate-50 sm:flex-row sm:items-start sm:gap-3 sm:px-4 sm:text-left lg:px-3.5 xl:px-4"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[20px] transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 sm:text-[18px] ${TONES[item.tone]}`}
              >
                {item.icon}
              </span>

              <div className="min-w-0">
                <h3 className="text-[12px] leading-[16px] font-bold text-(--theme-text-primary) sm:text-[13px] sm:leading-[18px]">
                  <span className="sm:hidden">{item.shortTitle}</span>
                  <span className="hidden sm:inline">{item.title}</span>
                </h3>

                <p className="mt-0.5 hidden text-[11px] leading-[15px] text-gray-500 sm:block">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
