"use client";

import {
  CalendarOutlined,
  EyeOutlined,
  MessageOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Card, Tag, Typography } from "antd";

export default function SupportTicketCard({ ticket, onView }) {
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

  return (
    <Card
      hoverable
      className="overflow-hidden rounded-xl! border! border-[#E2E8F0]! shadow-sm transition-all duration-300 hover:shadow-md"
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* LEFT */}
        <div className="flex-1 p-5">
          {/* HEADER */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Tag
              color="blue"
              className="rounded-full! px-3! py-1! text-xs! font-semibold!"
            >
              Ticket #{ticket?.ticketId}
            </Tag>

            <Tag
              color={getStatusColor(ticket?.status)}
              className="rounded-full! px-3! py-1! text-xs! font-semibold!"
            >
              {ticket?.status}
            </Tag>

            <Tag
              color="cyan"
              className="rounded-full! px-3! py-1! text-xs! font-semibold!"
            >
              {ticket?.supportCategory?.replaceAll("_", " ")}
            </Tag>
          </div>

          {/* SUBJECT */}
          <Typography.Title
            level={4}
            className="font-roboto mb-2! text-[20px]! leading-7! font-semibold! text-[#1F2937]!"
          >
            {ticket?.subject}
          </Typography.Title>

          {/* FOOTER */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {ticket?.Type && (
              <Tag
                icon={<TagOutlined />}
                className="m-0! rounded-full! border-[#E2E8F0]! bg-gray-50! px-3! py-1! text-xs! font-medium! text-gray-700!"
              >
                {ticket.Type.toUpperCase()}
              </Tag>
            )}

            {ticket?.BookingRefNo && (
              <Tag className="m-0! rounded-full! border-blue-100! bg-blue-50! px-3! py-1! text-xs! font-medium! text-blue-700!">
                Booking Ref: {ticket.BookingRefNo}
              </Tag>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex min-w-65 flex-col justify-between border-t bg-[#FAFCFF] p-5 lg:border-t-0 lg:border-l">
          <div>
            <p className="font-roboto mb-4 text-[12px] font-semibold tracking-wider text-gray-400 uppercase">
              Ticket Information
            </p>

            {/* Created Date */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 most-text-color">
                <CalendarOutlined />
              </div>

              <div>
                <p className="font-roboto mb-0 text-[14px] font-semibold text-gray-700">
                  {new Date(ticket?.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Support Type */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-50 text-purple-600">
                <MessageOutlined />
              </div>

              <div>
                <p className="font-roboto mb-0 text-[14px] font-semibold text-gray-700">
                  Support Request
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="large"
            className="font-roboto mt-6 h-11! rounded-lg! border-none! buttion-background-color font-semibold! "
            onClick={() => onView(ticket)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
