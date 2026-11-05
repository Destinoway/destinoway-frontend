"use client";
import {
  AuditOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const timeline = [
  {
    icon: CheckCircleOutlined,
    time: "24 Hours",
    title: "Acknowledgement",
    desc: "Your grievance is received and acknowledged.",
  },
  {
    icon: FileSearchOutlined,
    time: "48 Hours",
    title: "Initial Review",
    desc: "Our team reviews the submitted information.",
  },
  {
    icon: AuditOutlined,
    time: "3-5 Days",
    title: "Investigation",
    desc: "The issue is investigated and verified.",
  },
  {
    icon: SolutionOutlined,
    time: "7 Days",
    title: "Resolution",
    desc: "Final resolution is shared with the customer.",
  },
];

export default function ResolutionTimelineSection() {
  return (
    <section className="bg-white py-10 lg:py-12">
      <div className="mx-auto max-w-350 px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold text-black md:text-[36px]">
            Resolution Timeline
          </h2>

          <p className="mx-auto mt-3 max-w-175 text-[15px] text-gray-600">
            We aim to resolve all grievances as quickly and fairly as possible.
            Below is our standard resolution process timeline.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {timeline.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-xl bg-[#eef5fa] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-5"
              >
                <div className="mb-3 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="text-[18px] text-[#0f6b78]" />
                  </div>
                </div>

                <p className="mb-1 text-[18px] font-bold text-[#0f6b78]">
                  {item.time}
                </p>

                <h3 className="mb-1 text-[15px] font-semibold">{item.title}</h3>

                <p className="text-[12px] leading-5 text-gray-600">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-10 rounded-xl border border-[#d8eaf0] bg-[#f8fcfd] p-5">
          <h4 className="mb-2 font-semibold text-[#0f6b78]">
            Important Notice
          </h4>

          <p className="text-sm leading-relaxed text-gray-600">
            Resolution timelines may vary depending on the complexity of the
            case, third-party investigations, or additional information required
            from the customer.
          </p>
        </div>
      </div>
    </section>
  );
}
