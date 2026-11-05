"use client";

import SectionCard from "@/modules/hotel/components/hotels/viewhotles/HotelSections/SectionCard";
import { CheckOutlined, MessageOutlined } from "@ant-design/icons";
import { Input } from "antd";

const requests = [
  "Smoking room",
  "Late check-in",
  "Early check-in",
  "Room on a high floor",
  "Large bed",
  "Twin beds",
  "Airport transfer",
];

export default function SpecialRequestCard({ value = {}, onChange }) {
  const selected = Array.isArray(value?.common) ? value.common : [];

  const toggleRequest = (item) => {
    const common = selected.includes(item)
      ? selected.filter((request) => request !== item)
      : [...selected, item];

    onChange?.({ ...value, common });
  };

  return (
    <SectionCard
      icon={<MessageOutlined />}
      title="Special Requests"
      subtitle="Subject to hotel availability, not guaranteed"
    >
      <div className="flex flex-wrap gap-2">
        {requests.map((item) => {
          const isSelected = selected.includes(item);

          return (
            <button
              key={item}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleRequest(item)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
                isSelected
                  ? "border-(--theme-secondary) bg-(--theme-secondary)/8! text-(--theme-secondary)"
                  : "border-gray-200 bg-white! text-gray-700 hover:border-gray-300 hover:bg-slate-50!"
              }`}
            >
              {isSelected && <CheckOutlined className="text-[11px]" />}
              {item}
            </button>
          );
        })}
      </div>

      <Input.TextArea
        rows={3}
        value={value?.other}
        placeholder="Any other request? (e.g. anniversary decoration, extra pillows)"
        onChange={(event) =>
          onChange?.({
            ...value,
            other: event.target.value,
          })
        }
        className="mt-4! rounded-xl!"
      />
    </SectionCard>
  );
}
