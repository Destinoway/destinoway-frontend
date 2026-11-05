"use client";

import SectionHeading from "@/components/common/SectionHeading";
import {
  CustomerServiceOutlined,
  DollarOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const features = [
  {
    icon: <DollarOutlined />,
    title: "Best Price Guarantee",
    description:
      "Get the most competitive prices with complete transparency and zero hidden charges.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Easy & Secure Booking",
    description:
      "Enjoy a smooth booking experience with trusted and secure payment methods.",
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "24/7 Customer Support",
    description:
      "Our support team is always available to help whenever you need assistance.",
  },
  {
    icon: <GiftOutlined />,
    title: "Instant Cashback Rewards",
    description:
      "Earn exciting rewards and cashback benefits on every successful booking.",
  },
];

export default function WhySection() {
  return (
    <section className="background-color-bg -mt-2.5 overflow-hidden px-0! py-10 sm:px-0! sm:py-12 md:px-2! md:py-16 lg:px-3! lg:py-20 xl:px-4! 2xl:px-0!">
      <div className="mx-auto mt-0 w-full px-2 sm:mt-2 sm:px-4 md:mt-4 lg:-mt-20 lg:w-[86%] lg:px-0 xl:mt-4">
        <SectionHeading
          title="Why Choose Our Platform"
          description="We’re committed to offering more than just products we provide exceptional experiences."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr] xl:gap-10">
          <div className="relative min-h-60 overflow-hidden rounded-2xl shadow-xl sm:min-h-80 md:min-h-105 lg:min-h-130 lg:rounded-4xl xl:min-h-150">
            <Image
              src="/images/whySection.png"
              alt="Luxury Resort"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

            <div className="absolute right-3 bottom-3 left-3 w-auto rounded-xl border border-white/40 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:right-auto sm:bottom-5 sm:left-5 sm:w-fit sm:px-5 sm:py-4 lg:rounded-2xl">
              <p className="text-sm font-medium text-gray-500">
                Trusted by thousands of travelers
              </p>

              <div className="mt-1 flex items-center gap-3">
                <p aria-label="Rated 4.9 out of 5" className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  4.9★
                </p>

                <div className="h-10 w-px bg-gray-200" />

                <p className="text-xs leading-5 text-gray-600 sm:text-sm lg:text-base">
                  Rated highly for service,
                  <br />
                  pricing & customer support
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col rounded-2xl border border-white/60 bg-white p-5 shadow-[0_10px_35px_rgba(59,130,182,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(59,130,182,0.15)] sm:p-6 lg:rounded-[28px] lg:p-7"
              >
                <div className="most-text-color mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D9ECF8] bg-[#EDF7FF] text-[20px] transition-transform group-hover:scale-110 sm:h-14 sm:w-14 sm:text-[24px] lg:h-16 lg:w-16 lg:rounded-2xl lg:text-[28px]">
                  {item.icon}
                </div>

                <h3 className="mb-2 text-lg leading-snug font-bold text-gray-900 sm:text-xl lg:text-2xl">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-gray-600 sm:text-[15px] lg:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
