"use client";

import { SafetyCertificateFilled } from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import Image from "next/image";
import { useHotelBookingStore } from "../../store/booking.store";

const { Title, Text } = Typography;

const PAYMENT_OPTIONS = [
  {
    id: "razorpay",
    title: "Razorpay",
    description: "UPI, Cards, Net Banking & Wallets",
    image: "/images/razorpay.png",
    recommended: true,
    enabled: true, // future: admin API
  },
  {
    id: "stripe",
    title: "Stripe",
    description: "International Cards & Secure Payments",
    image: "/images/stripe.png",
    recommended: false,
    enabled: true, // future: admin API
  },
];

export default function PaymentMethodCard() {
  const { bookingData, setBookingData } = useHotelBookingStore();

  const selectedMethod = bookingData?.selectedPaymentMethod || "razorpay";

  const handleChange = (value) => {
    setBookingData({
      selectedPaymentMethod: value,
    });
  };

  return (
    <Card
      className="rounded-xl border-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
      styles={{ body: { padding: 18 } }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/payments/razorpay-icon.svg"
            alt="Razorpay"
            width={42}
            height={42}
          />

          <div>
            <Title level={5} className="mb-0! text-[16px]! font-semibold!">
              Razorpay
            </Title>

            <Text className="text-[13px] text-gray-500">
              UPI, Cards, Net Banking & Wallets
            </Text>
          </div>
        </div>

        <Tag
          color="green"
          icon={<SafetyCertificateFilled />}
          className="rounded-full"
        >
          Secure
        </Tag>
      </div>
    </Card>
  );
}
