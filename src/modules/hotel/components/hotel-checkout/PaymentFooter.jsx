"use client";

import { useRazorpayPayment } from "@/modules/payments/hooks/useRazorpayPayment";
import { LockOutlined, SafetyCertificateFilled } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";

const { Text } = Typography;

export default function PaymentFooter({
  priceSummary = {},
  loading = false,
  booking = {},
  onPay,
  isPaid = false,
}) {
  const payableAmount = Number(
    priceSummary?.totalPayableAmountAfterDiscount ??
    priceSummary?.totalAmount ??
    0,
  );

  const currencySymbol = priceSummary?.currencySymbol || "₹";

  const { payNow, loading: paymentLoading } = useRazorpayPayment();
  const formatPrice = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (isPaid) {
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
        <div className="flex items-center justify-center gap-2 text-[#15803d]">
          <SafetyCertificateFilled />
          <Text className="!font-medium !text-[#15803d]">
            Payment completed successfully
          </Text>
        </div>
      </Card>
    );
  }

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
      {/* Security */}

      <div className="mb-4 flex items-center justify-center gap-2 text-[#15803d]">
        <SafetyCertificateFilled />

        <Text className="!font-medium !text-[#15803d]">
          100% Secure Payment via Razorpay
        </Text>
      </div>

      {/* Pay Button */}

      <Button
        type="primary"
        size="large"
        loading={loading || paymentLoading}
        onClick={() => {
          payNow({
            bookingId:
              booking.tempBookingId || booking.bookingId || booking._id,
            customer: booking.customer,
          });
        }}
        icon={<LockOutlined />}
        className="buttion-background-color !h-[52px] w-full !rounded-lg !text-[16px] !font-semibold"
      >
        Pay {currencySymbol} {formatPrice(payableAmount)}
      </Button>

      {/* Terms */}

      <Text className="mt-3 block text-center text-[12px] leading-5 text-gray-500">
        By clicking <strong>Pay</strong>, you agree to our booking terms,
        cancellation policy and secure payment process.
      </Text>
    </Card>
  );
}
