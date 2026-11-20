"use client";

import { ArrowRightOutlined, FileProtectOutlined } from "@ant-design/icons";

import SectionCard from "./SectionCard";

const Policies = ({ ratePlans = [] }) => {
  const hasRooms = Array.isArray(ratePlans) && ratePlans.length > 0;

  return (
    <SectionCard
      icon={<FileProtectOutlined />}
      title="Room policies and booking conditions"
      subtitle="Cancellation, payment and stay conditions"
    >
      <p className="m-0 text-sm leading-6 text-gray-600">
        {hasRooms
          ? "Policies and booking conditions are shown with each room option. Select Room details on a room card to view them."
          : "Room policies will appear here when room options are available."}
      </p>

      {hasRooms && (
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("rooms-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-(--theme-secondary)/30 bg-white px-4 text-[13px] font-semibold text-(--theme-secondary) transition-colors hover:bg-(--theme-secondary)/5"
        >
          View room options
          <ArrowRightOutlined className="text-[11px]" />
        </button>
      )}
    </SectionCard>
  );
};

export default Policies;
