"use client";

import { CalendarOutlined, MailOutlined, TagOutlined } from "@ant-design/icons";
import { Empty, Modal, Tag } from "antd";
import { useState } from "react";
import SupportTicketCard from "../componants/SupportTicketCard";
import { useSupportTickets } from "../hooks/useSupportTickets";

export default function SupportTicketsTab() {
  const { data, isLoading } = useSupportTickets();
  const [selected, setSelected] = useState(null);

  const tickets = data?.data?.contacts || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "processing";
      case "In Progress":
        return "warning";
      case "Resolved":
        return "success";
      case "Closed":
        return "error";
      default:
        return "default";
    }
  };

  const openCount = tickets.filter((t) => t.status === "Open").length;

  const progressCount = tickets.filter(
    (t) => t.status === "In Progress",
  ).length;

  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        Loading support tickets...
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="rounded-xl bg-white p-10 shadow-sm">
        <Empty
          description="No support tickets found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* <div className="mb-2 flex flex-col gap-2 bg-white px-4 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="font-roboto my-2! text-[20px] leading-[100%] font-semibold tracking-[0] text-gray-900">
          Wishlist
        </h2>
      </div> */}

        {/* Header */}
        <div className="mb-2 flex flex-col gap-3 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-roboto mb-1! text-[20px] font-semibold text-gray-900">
              My Support Tickets
            </h2>

            <p className="mb-0! text-sm text-gray-500">
              View and track the status of your support requests.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap gap-2">
            <div className="min-w-15 rounded-lg border bg-slate-50 px-3 py-2 text-center">
              <p className="font-roboto mb-0! text-[11px] font-semibold text-gray-500">
                Total
              </p>

              <p className="mb-0! text-lg font-bold">{tickets.length}</p>
            </div>

            <div className="min-w-15 rounded-lg border bg-blue-50 px-3 py-2 text-center">
              <p className="font-roboto mb-0! text-[11px] font-semibold text-blue-600">
                Open
              </p>

              <p className="mb-0! text-lg font-bold text-blue-600">
                {openCount}
              </p>
            </div>

            <div className="min-w-15! rounded-lg border bg-orange-50 px-3 py-2 text-center">
              <p className="font-roboto mb-0! text-[11px] font-semibold text-orange-600">
                In Progress
              </p>

              <p className="mb-0! text-lg font-bold text-orange-600">
                {progressCount}
              </p>
            </div>

            <div className="min-w-15 rounded-lg border bg-green-50 px-3 py-2 text-center">
              <p className="font-roboto mb-0! text-[11px] font-semibold text-green-600">
                Resolved
              </p>

              <p className="mb-0! text-lg font-bold text-green-600">
                {resolvedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <SupportTicketCard
              key={ticket._id}
              ticket={ticket}
              onView={setSelected}
            />
          ))}
        </div>

        {/* Details Modal */}
        <Modal
          title={null}
          open={!!selected}
          footer={null}
          width={1000}
          centered
          onCancel={() => setSelected(null)}
        >
          {selected && (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b pb-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Tag color="geekblue" className="rounded-full! px-3! py-1!">
                    Ticket #{selected.ticketId}
                  </Tag>

                  <Tag
                    color={getStatusColor(selected.status)}
                    className="rounded-full! px-3! py-1!"
                  >
                    {selected.status}
                  </Tag>

                  <Tag color="cyan" className="rounded-full! px-3! py-1!">
                    {selected.supportCategory?.replaceAll("_", " ")}
                  </Tag>

                  <Tag
                    icon={<TagOutlined />}
                    className="rounded-full! px-3! py-1!"
                  >
                    {selected.Type?.toUpperCase()}
                  </Tag>
                </div>

                <p className="font-roboto mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Subject
                </p>

                <h2 className="mb-0! font-roboto mb-0 text-[24px] font-semibold text-[#1F2937]">
                  {selected.subject}
                </h2>
              </div>

              {/* Information */}
              <div>
                <h3 className="font-roboto mb-4 text-lg font-semibold text-gray-800">
                  Ticket Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className=" text-xs font-semibold text-gray-400 uppercase">
                      Booking Reference
                    </p>

                    <p className="mb-0! font-semibold text-gray-700">
                      {selected.BookingRefNo || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="mb-1 text-xs font-semibold text-gray-400 uppercase">
                      Email
                    </p>

                    <p className="mb-0! flex items-center gap-2 font-semibold text-gray-700">
                      <MailOutlined />
                      {selected.email || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className=" text-xs font-semibold text-gray-400 uppercase">
                      Raised On
                    </p>

                    <p className="mb-0! flex items-center gap-2 font-semibold text-gray-700">
                      <CalendarOutlined />
                      {new Date(selected.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-gray-50 p-4">
                    <p className=" text-xs font-semibold text-gray-400 uppercase">
                      Last Updated
                    </p>

                    <p className="mb-0! flex items-center gap-2 font-semibold text-gray-700">
                      <CalendarOutlined />
                      {new Date(selected.updatedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="font-roboto mb-3 text-lg font-semibold text-gray-800">
                  Message
                </h3>

                <div className="rounded-xl border bg-gray-50 p-5">
                  <p className="font-roboto text-[15px] leading-7 whitespace-pre-wrap text-gray-700">
                    {selected.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
