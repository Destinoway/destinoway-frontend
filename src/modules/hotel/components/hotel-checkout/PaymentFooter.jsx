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
}) {
  const payableAmount = Number(
    priceSummary?.totalPayableAmountAfterDiscount ??
    priceSummary?.totalAmount ??
    0,
  );

  const currencySymbol = priceSummary?.currencySymbol || "₹";

  console.log("priceSummary in payment page", currencySymbol);

  const { payNow, loading: paymentLoading } = useRazorpayPayment();
  const formatPrice = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Card
      className="rounded border-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
      styles={{
        body: {
          padding: 18,
        },
      }}
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
          console.log("Sending To payNow", {
            tempBookingId: booking.tempBookingId,
            customer: booking.customer,
          });

          payNow({
            bookingId: booking.tempBookingId,
            customer: booking.customer,
          });
        }}
        icon={<LockOutlined />}
        className="!h-[54px] w-full !rounded buttion-background-color !text-[16px] !font-semibold "
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
