"use client";
import {
  AuditOutlined,
  CheckCircleOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const steps = [
  {
    icon: CustomerServiceOutlined,
    title: "Contact Support",
    desc: "Reach out to our support team and create a support request.",
  },
  {
    icon: FileSearchOutlined,
    title: "Support Review",
    desc: "Our team reviews your issue and attempts resolution.",
  },
  {
    icon: ExclamationCircleOutlined,
    title: "Raise Grievance",
    desc: "If unresolved, submit a grievance with supporting details.",
  },
  {
    icon: AuditOutlined,
    title: "Officer Review",
    desc: "The grievance officer investigates and reviews the case.",
  },
  {
    icon: CheckCircleOutlined,
    title: "Resolution",
    desc: "Final resolution is shared via email and support updates.",
  },
];

export default function GrievanceProcessSection() {
  return (
    <section className="bg-[#eef5fa] py-10 lg:py-12">
      <div className="mx-auto max-w-350 px-4">
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold text-black md:text-[36px]">
            Grievance Resolution Process
          </h2>

          <p className="mx-auto mt-3 max-w-125 text-[15px] text-gray-600">
            Follow the escalation process below to ensure your concern is
            reviewed and resolved efficiently.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="relative min-h-55 rounded-xl bg-white p-4 text-center shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-5"
              >
                <div className="mb-3 flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef5fa]">
                    <Icon className="text-[20px] text-[#0f6b78]" />
                  </div>
                </div>

                <h3 className="mb-2 text-[16px] font-semibold text-black">
                  {step.title}
                </h3>

                <p className="text-[13px] leading-6 text-gray-600">
                  {step.desc}
                </p>

                <div className="most-text-color mt-3 text-xs font-semibold tracking-wide uppercase">
                  Step {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
