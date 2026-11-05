"use client";

import { BankOutlined, EnvironmentOutlined } from "@ant-design/icons";

const ViewHotelTabs = ({ supplierData = {} }) => {
  const city = supplierData?.City || "";

  const cards = [
    {
      icon: <BankOutlined />,
      title: "Property Highlights",
      sub: "Best features & stay benefits",
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Nearby Attractions",
      sub: `Explore ${city || "location"}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(15,23,42,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary)">
            {card.icon}
          </span>

          <div className="min-w-0">
            <p className="m-0 truncate text-[14px] font-bold text-(--theme-text-primary)">
              {card.title}
            </p>
            <p className="m-0 mt-0.5 truncate text-[12px] text-gray-500">
              {card.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewHotelTabs;
