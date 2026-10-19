"use client";

import {
  EnvironmentOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Divider, Tag, Typography } from "antd";

const { Title, Text } = Typography;

export default function CustomerSummaryCard({
  customer = {},
  guestDetails = [],
}) {
  return (
    <Card
      className="rounded-xl border border-[#E5EEF7] bg-white shadow-[0_10px_35px_rgba(5,20,75,0.08)]"
      styles={{
        body: {
          padding: 20,
        },
      }}
      variant="borderless"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4de]">
          <UserOutlined className="text-[16px] text-[#05144b]" />
        </div>

        <div>
          <Title
            level={5}
            className="font-roboto! !mb-0 !text-[16px] !font-bold !text-[#05144b]"
          >
            Customer Details
          </Title>

          <Text className="text-gray-500">
            Primary contact for this booking
          </Text>
        </div>
      </div>

      {/* Customer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Text className="flex items-center gap-2">
            <UserOutlined />
            Customer Name
          </Text>

          <Text strong>{customer?.name || "--"}</Text>
        </div>

        <div className="flex items-center justify-between">
          <Text className="flex items-center gap-2">
            <PhoneOutlined />
            Mobile
          </Text>

          <Text strong>{customer?.mobile || "--"}</Text>
        </div>

        {(customer?.address || customer?.postalCode) && (
          <div className="flex items-start justify-between gap-3">
            <Text className="flex shrink-0 items-center gap-2">
              <EnvironmentOutlined />
              Address
            </Text>

            <Text className="text-right" strong>
              {[customer?.address, customer?.postalCode]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </div>
        )}
      </div>

      <Divider />

      {/* Guests */}

      <div className="mb-0! flex items-center gap-2">
        <TeamOutlined className="text-[#0f766e]" />

        <Title level={5} className="font-roboto! !mb-0 !text-[17px]">
          Guest Details
        </Title>
      </div>

      <div className="space-y-3">
        {guestDetails.map((guest, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-100 bg-[#fafafa] p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <Text strong>
                  {guest?.title} {guest?.firstName} {guest?.lastName}
                </Text>

                <div className="mt-1">
                  <Tag color="blue">{guest?.occupantType}</Tag>

                  {guest?.roomNumber && (
                    <Tag color="purple">Room {guest.roomNumber}</Tag>
                  )}
                </div>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4de]">
                <UserOutlined className="text-[#05144b]" />
              </div>
            </div>
          </div>
        ))}

        {!guestDetails.length && (
          <div className="rounded-lg border border-dashed p-5 text-center text-gray-500">
            No Guest Details
          </div>
        )}
      </div>
    </Card>
  );
}
