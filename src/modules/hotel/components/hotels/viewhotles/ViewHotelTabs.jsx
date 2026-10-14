"use client";

import { BankOutlined, EnvironmentOutlined } from "@ant-design/icons";

const ViewHotelTabs = ({ supplierData = {} }) => {
  const city = supplierData?.City || "";

  const cards = [
    {
      icon: <BankOutlined className="text-[20px] text-[#0ea5e9]" />,
      title: "Property Highlights",
      sub: "Best features & stay benefits",
    },
    {
      icon: <EnvironmentOutlined className="text-[20px] text-[#0ea5e9]" />,
      title: "Nearby Attractions",
      sub: `Explore ${city || "location"}`,
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex h-[52px] items-center gap-3 rounded border border-[#d8e7f0] bg-white px-4 py-3 shadow-sm transition duration-300 hover:shadow-md"
        >
          {/* Left Icon / Badge */}
          <div className="most-text-color flex h-7 w-11 shrink-0 items-center justify-center rounded text-[18px]">
            {card.icon}
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center gap-2">
            <span className="text-sm font-semibold leading-[16px] text-gray-800">
              {card.title}
            </span>

            <span className="text-xs leading-[14px] text-gray-500">
              {card.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewHotelTabs;
