"use client";

import { Card, Divider, Typography } from "antd";
const { Title, Text } = Typography;

export default function PriceBreakupCard({ bookingData }) {
  const pricing =
    bookingData?.rooms?.[0]?.pricing || bookingData?.pricing || {};
  const basePrice = Number(pricing?.basicAmount || 0);
  const tax = Number(pricing?.tax || 0);
  const serviceFee = Number(pricing?.serviceFee || 0);
  const markup = Number(pricing?.markup || 0);
  const gst = Number(pricing?.gst || 0);
  const totalAmount = Number(pricing?.totalAmount || 0);
  const currency = pricing?.currency || "₹";
  const rows = [
    {
      label: "Base Price",
      value: basePrice,
    },
    {
      label: "Tax",
      value: tax,
    },
  ];

  if (serviceFee > 0) {
    rows.push({
      label: "Service Fee",
      value: serviceFee,
    });
  }

  if (markup > 0) {
    rows.push({
      label: "Markup",
      value: markup,
    });
  }

  if (gst > 0) {
    rows.push({
      label: "GST",
      value: gst,
    });
  }

  return (
    <Card
      className="!mb-3 rounded border-0 shadow-[0_4px_6px_rgba(0,0,0,0.12)]"
      styles={{
        body: {
          padding: 16,
        },
      }}
    >
      <Title level={5} className="!mb-3 !font-['Roboto'] !font-semibold">
        Price Breakup
      </Title>

      <div className="space-y-1">
        {rows.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-center justify-between">
              <Text className="!text-[14px] leading-[100%] font-medium tracking-[0%]">
                {item.label}
              </Text>

              <Text className="!font-['Roboto'] text-[12px] font-medium text-gray-800">
                {currency} {item.value.toLocaleString("en-IN")}
              </Text>
            </div>

            {index !== rows.length - 1 && <Divider className="!my-2" />}
          </div>
        ))}
      </div>

      <Divider className="!my-3" />

      <div className="flex items-center justify-between">
        <Text className="!font-['Roboto'] text-[12px] font-semibold">
          Total Amount
        </Text>

        <Text className="!font-['Roboto'] text-[22px] font-bold text-[#1677ff]">
          {currency} {totalAmount.toLocaleString("en-IN")}
        </Text>
      </div>
    </Card>
  );
}
