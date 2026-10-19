"use client";
import {
  ArrowRightOutlined,
  MailFilled,
  MessageFilled,
  PhoneFilled,
  TeamOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const contactCards = [
  {
    icon: PhoneFilled,
    title: "Customer Support",
    value: "+91 9876543210",
    subText: "Available 24x7",
    href: "tel:+919876543210",
    badge: "Online",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    icon: MessageFilled,
    title: "WhatsApp Support",
    value: "+91 9876543210",
    subText: "Quick Assistance",
    href: "https://wa.me/919876543210",
    target: "_blank",
    badge: "Fast Reply",
    badgeColor: "bg-green-100 text-green-700",
    cardClass: "border border-green-100",
  },
  {
    icon: MailFilled,
    title: "Booking Support",
    value: "booking@destinoway.com",
    subText: "Response within 24 Hours",
    href: "mailto:booking@destinoway.com",
    badge: "Email",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: TeamOutlined,
    title: "Business Partnership",
    value: "business@destinoway.com",
    subText: "Hotels & Collaborations",
    href: "mailto:business@destinoway.com",
    badge: "Business",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

export default function ContactSection() {
  return (
    <section className="relative">
      {/* Hero Banner */}
      <div className="relative h-[321px] w-full overflow-hidden">
        <Image
          src="/images/concacthero.jpg"
          alt="Contact Banner"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/35" />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16">
            <div className="max-w-[600px]">
              <h1 className="text-[32px] leading-tight font-bold text-white md:text-[42px] lg:text-[52px]">
                Contact Us
              </h1>

              <p className="mt-3 text-[15px] leading-relaxed text-white/90 md:text-[17px] lg:text-[18px]">
                We're here to help with your bookings, travel plans, and any
                questions you may have. Reach out to our support team anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="absolute top-[280px] left-1/2 z-30 w-full max-w-[1400px] -translate-x-1/2 px-3">
        {/* Mobile Scroll */}
        <div className="scrollbar-hide overflow-x-auto min-[951px]:overflow-visible">
          <div className="flex gap-4 min-[951px]:grid min-[951px]:grid-cols-4 md:gap-6">
            {contactCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Link
                  key={index}
                  href={card.href}
                  target={card.target}
                  className="group block min-w-[300px] shrink-0 min-[951px]:min-w-0"
                >
                  <div
                    className={`rounded-md bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:px-5 ${
                      card.cardClass || ""
                    }`}
                  >
                    {/* Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="most-text-color text-[20px] transition-transform duration-300 group-hover:scale-110 md:text-[24px] lg:text-[26px]" />

                        <h3 className="most-text-color m-0 text-[16px] font-medium md:text-[18px]">
                          {card.title}
                        </h3>
                      </div>

                      <ArrowRightOutlined className="most-text-color opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>

                    {/* Badge */}
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="mb-0! text-[12px] text-[#666] md:text-[13px]">
                        {card.subText}
                      </p>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${card.badgeColor}`}
                      >
                        {card.badge}
                      </span>
                    </div>

                    {/* Value */}
                    <p className="text-[15px] font-medium break-all text-[#444] md:text-[16px]">
                      {card.value}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
