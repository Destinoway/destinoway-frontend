"use client";

import MobileTrustSection from "@/modules/hotel/mobile-componant/MobileTrustSection";

import {
  CustomerServiceOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  TagsOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const trustItems = [
  {
    id: 1,
    icon: (
      <SafetyCertificateOutlined
        className="text-[20px]"
        style={{ color: "#23437A" }}
      />
    ),
    title: "Secure Payments",
    description: "Your payment information is safe with us.",
  },
  {
    id: 2,
    icon: (
      <TrophyOutlined className="text-[20px]" style={{ color: "#F4A825" }} />
    ),
    title: "Best Price Guarantee",
    description: "Find a lower price? We'll match it for you.",
  },
  {
    id: 3,
    icon: (
      <CustomerServiceOutlined
        className="text-[20px]"
        style={{ color: "#23437A" }}
      />
    ),
    title: "24/7 Support",
    description: "We're here to help you anytime, anywhere.",
  },
  {
    id: 4,
    icon: <TagsOutlined className="text-[20px]" style={{ color: "#F4A825" }} />,
    title: "Easy Booking",
    description: "Book in just a few clicks with a hassle-free experience.",
  },
  {
    id: 5,
    icon: (
      <GlobalOutlined className="text-[20px]" style={{ color: "#23437A" }} />
    ),
    title: "Worldwide Coverage",
    description: "Thousands of destinations across the globe.",
  },
  {
    id: 6,
    icon: (
      <SafetyOutlined className="text-[20px]" style={{ color: "#F4A825" }} />
    ),
    title: "Safe & Trusted",
    description: "Trusted by millions of travelers worldwide.",
  },
];

export default function TrustSection() {
  return (
    <>
      <div className="background-color-bg block w-full min-[778px]:hidden">
        <MobileTrustSection />
      </div>

      <section className="background-color-bg hidden w-full pt-[30px] min-[778px]:block md:mt-[90px] xl:mt-[80px] 2xl:mt-[99px]">
        <div className="mx-auto w-[94%] overflow-hidden rounded-lg border border-[#e5e7eb] bg-white sm:w-[94%] md:w-[92%] lg:w-[94%] xl:w-[82%] 2xl:w-[82%]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {trustItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex min-h-[78px] items-start gap-2 px-4 py-3 transition-all duration-300 hover:bg-white ${
                  index !== trustItems.length - 1
                    ? "border-r border-[#e5e7eb]"
                    : ""
                } `}
              >
                <div className="shrink-0 pt-[2px]">{item.icon}</div>

                <div className="min-w-0">
                  <h3 className="text-[13px] leading-[18px] font-semibold text-[#1F2937]">
                    {item.title}
                  </h3>

                  <p className="mt-0.5 text-[11px] leading-[15px] text-[#6B7280]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
