"use client";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MailFilled,
} from "@ant-design/icons";
import Image from "next/image";
const grievanceCards = [
  {
    icon: FileTextOutlined,
    title: "Raise A Grievance",
    value: "Submit Complaint Form",
    subText: "Escalate unresolved issues",
    badge: "Step 1",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: ClockCircleOutlined,
    title: "Review Timeline",
    value: "Within 48 Hours",
    subText: "Initial review period",
    badge: "48 Hrs",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: CheckCircleOutlined,
    title: "Resolution Timeline",
    value: "Within 7 Working Days",
    subText: "Expected resolution period",
    badge: "7 Days",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    icon: MailFilled,
    title: "Grievance Officer",
    value: "grievance@destinoway.com",
    subText: "Official escalation support",
    badge: "Official",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];
export default function GrievanceHero() {
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
                Grievance Redressal
              </h1>

              <p className="mt-3 text-[15px] leading-relaxed text-white/90 md:text-[17px] lg:text-[18px]">
                We are committed to resolving customer concerns fairly and
                promptly. If your issue remains unresolved through our regular
                support channels, you may submit a grievance for further review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="absolute top-[280px] left-1/2 z-30 w-full max-w-[1400px] -translate-x-1/2 px-3">
        <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {grievanceCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="rounded-lg border border-[#e7eef2] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef5fa]">
                      <Icon className="text-[18px] text-[#0f6b78]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="most-text-color truncate text-[14px] font-semibold">
                        {card.title}
                      </h3>

                      <p className="mt-0.5 text-[12px] text-gray-500">
                        {card.subText}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <p className="mt-3 border-t border-[#edf3f5] pt-2 text-[13px] font-medium text-gray-700">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
