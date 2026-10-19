"use client";

import { RightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

const helpSupportData = [
  {
    key: "1",
    title: "Booking confirmation",
    description:
      "Check your emails for a confirmation from the booking site – it might take up to 72 hours.",
  },

  {
    key: "2",
    title: "Modify booking",
    description:
      "Changes to your booking depend on the property and booking partner policies.",
  },

  {
    key: "3",
    title: "Cancellation support",
    description:
      "Need to cancel your booking? Review cancellation charges before proceeding.",
  },

  {
    key: "4",
    title: "Payment issues",
    description:
      "Facing payment failures or duplicate charges? Our support team can help.",
  },

  {
    key: "5",
    title: "Need more help?",
    description:
      "Contact customer support for any additional booking or travel assistance.",
  },
];

export default function HelpSupportPage() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-4 text-gray-900">
        <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
          Help & Support
        </h2>
      </div>
      <div className="mx-auto py-4">
        {/* FAQ SECTION */}
        <div className="overflow-hidden rounded bg-white shadow-[1px_4px_4px_4px_#00000014]">
          {/* COLLAPSE */}
          <Collapse
            accordion
            bordered={false}
            expandIconPlacement="end"
            expandIcon={({ isActive }) => (
              <RightOutlined
                rotate={isActive ? 90 : 0}
                className="text-[14px] text-[#72C0F0] transition-all duration-200"
              />
            )}
            items={helpSupportData.map((item) => ({
              key: item.key,

              label: (
                <p className="font-roboto! mb-0! text-[16px] font-semibold text-gray-900 md:text-[17px]">
                  {item.title}
                </p>
              ),

              children: (
                <p className="font-roboto! mb-0! text-[14px] leading-7 text-gray-600 md:text-[15px]">
                  {item.description}
                </p>
              ),

              className: "!border-b !border-gray-200 last:!border-b-0",
            }))}
            className="help-support-collapse bg-transparent [&_.ant-collapse-content-box]:!px-5 [&_.ant-collapse-content-box]:!pt-0 [&_.ant-collapse-content-box]:!pb-5 md:[&_.ant-collapse-content-box]:!px-6 [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:!px-5 [&_.ant-collapse-header]:!py-5 md:[&_.ant-collapse-header]:!px-6"
          />
        </div>

        {/* CONTACT SECTION */}
        <div className="mt-6 overflow-hidden rounded border border-gray-200 bg-white shadow-[1px_4px_4px_4px_#00000014]">
          {/* HEADER */}
          <div className="border-b border-gray-200 px-5 py-4 md:px-6">
            <h2 className="font-roboto mb-0! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
              Contact Support
            </h2>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:p-6">
            {/* Customer Care */}
            <div className="rounded border border-[#d9ecf8] bg-[#fafcff] p-4 transition hover:border-[#72C0F0]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ff]">
                📞
              </div>

              <p className="font-roboto! mb-1! text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                Customer Care
              </p>

              <h4 className="font-roboto! mb-0! text-[16px] font-semibold text-gray-900">
                +91 98765 43210
              </h4>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-[#d9ecf8] bg-[#fafcff] p-4 transition hover:border-[#72C0F0]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ff]">
                ✉️
              </div>

              <p className="font-roboto! mb-1! text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                Email Support
              </p>

              <h4 className="font-roboto! mb-0! text-[16px] font-semibold break-all text-gray-900">
                support@destinoway.com
              </h4>
            </div>

            {/* Working Hours */}
            <div className="rounded-xl border border-[#d9ecf8] bg-[#fafcff] p-4 transition hover:border-[#72C0F0]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ff]">
                🕒
              </div>

              <p className="font-roboto! mb-1! text-[12px] font-medium tracking-wide text-gray-500 uppercase">
                Working Hours
              </p>

              <h4 className="font-roboto! mb-0! text-[16px] font-semibold text-gray-900">
                24×7 Support
              </h4>

              <p className="mt-1 text-[13px] text-gray-500">Monday - Sunday</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-200 bg-[#fafcff] px-5 py-4 md:px-6">
            <p className="font-roboto! mb-0! text-[13px] text-gray-600">
              Need immediate assistance? Our support team is available 24×7 to
              help with bookings, cancellations, invoices, and travel-related
              queries.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
