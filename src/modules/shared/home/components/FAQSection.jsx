"use client";

import SectionHeading from "@/components/common/SectionHeading";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

export default function FAQSection({ data }) {
  const faqItems = data?.items || [];

  if (!faqItems.length) return null;
  return (
    <section className="bg-[#EDF7FF] px-4 py-7 mt-0 sm:mt-0 md:mt-0 lg:-mt-53[] !xl:-mt-44 2xl:-mt-4 md:py-12">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title={data?.title || "Questions & Answer"}
          description="We’re committed to offering more than just products we provide exceptional experiences.."
        />

        <Collapse
          accordion
          defaultActiveKey={["0"]}
          ghost
          expandIcon={({ isActive }) =>
            isActive ? (
              <MinusOutlined className="text-[22px] text-[#222]" />
            ) : (
              <PlusOutlined className="text-[22px] text-[#222]" />
            )
          }
          expandIconPlacement="end"
          items={faqItems.map((item, index) => ({
            key: String(index),

            label: (
              <span className="text-[18px] font-medium text-[#222]">
                {item.question}
              </span>
            ),

            children: (
              <p className="pr-8 pb-2 text-[15px] leading-8 text-gray-600">
                {item.answer}
              </p>
            ),

            style: {
              borderBottom: "1px solid #E5E7EB",
              borderRadius: 0,
              paddingTop: "10px",
              paddingBottom: "10px",
            },
          }))}
        />
      </div>
    </section>
  );
}
