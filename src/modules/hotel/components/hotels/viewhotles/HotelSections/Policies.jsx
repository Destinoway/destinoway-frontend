"use client";

import { Button } from "antd";

const Policies = ({ ratePlans = [] }) => {
  const hasRooms = Array.isArray(ratePlans) && ratePlans.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="m-0 text-lg font-semibold text-slate-900">
        Room policies and booking conditions
      </h2>
      <p className="mb-0 mt-2 text-sm leading-6 text-slate-600">
        {hasRooms
          ? "Policies and booking conditions are shown with each room option. Select Room details on a room card to view them."
          : "Room policies will appear here when room options are available."}
      </p>
      {hasRooms && (
        <Button
          type="link"
          className="!px-0 !font-semibold"
          onClick={() =>
            document
              .getElementById("rooms-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          View room options
        </Button>
      )}
    </div>
  );
};

export default Policies;
