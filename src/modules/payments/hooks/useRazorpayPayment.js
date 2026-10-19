"use client";

import { App } from "antd";
import { useState } from "react";

import { loadRazorpay } from "../utils/loadRazorpay";
import { useCreateBookingOrder } from "./usePayment";
import { useVerifyBookingPayment } from "./useVerifyPayment";

import { useRouter } from "next/navigation";

export const useRazorpayPayment = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const createOrderMutation = useCreateBookingOrder();
  const verifyMutation = useVerifyBookingPayment();

  const openRazorpay = ({ order, customer, bookingId }) => {
    const { transactionId, gateway, paymentData } = order;
    const options = {
      key: paymentData.keyId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      order_id: paymentData.orderId,
      name: "Destonoway",
      description: "Hotel Booking",
      prefill: {
        name: customer?.name || "",
        contact: customer?.mobile || "",
        email: customer?.email || "",
      },

      theme: {
        color: "#76B7E5",
      },

      handler: async function (response) {
        try {
          setProcessing(true);

          message.loading({
            key: "payment",
            content: "Verifying payment...",
            duration: 0,
          });

          const verifyResponse = await verifyMutation.mutateAsync({
            transactionId,
            gateway,
            gatewayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (!verifyResponse?.success) {
            message.error({
              key: "payment",
              content:
                verifyResponse?.message || "Payment verification failed.",
            });

            setProcessing(false);
            return;
          }

          message.success({
            key: "payment",
            content: "Payment verified successfully.",
          });

          const bookingRefNo = verifyResponse?.data?.bookingRefNo || bookingId;

          router.replace(
            `/hotel-checkout?bookingRefNo=${encodeURIComponent(bookingRefNo)}`,
          );
        } catch (error) {
          console.error("Payment Verification Error:", error);
          console.error("Error Message:", error?.message);
          console.error("Response:", error?.response);

          message.error({
            key: "payment",
            content:
              error?.response?.data?.message ||
              error?.message ||
              "Payment verification failed.",
          });

          setProcessing(false);
        }
      },

      modal: {
        ondismiss() {
          message.info("Payment cancelled.");
          setProcessing(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Payment Failed :", response);
      message.error(response?.error?.description || "Payment failed.");
      setProcessing(false);
    });

    razorpay.open();
  };

  const payNow = async ({ bookingId, customer }) => {
    if (processing) return;
    setProcessing(true);
    try {
      message.loading({
        key: "payment",
        content: "Preparing secure payment...",
        duration: 0,
      });

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        message.error({
          key: "payment",
          content: "Unable to load Razorpay.",
        });
        setProcessing(false);
        return;
      }

      const order = await createOrderMutation.mutateAsync({ bookingId });

      openRazorpay({
        order,
        customer,
        bookingId,
      });
    } catch (error) {
      console.error(error);

      message.error({
        key: "payment",
        content:
          error?.response?.data?.message || "Unable to create payment order.",
      });

      setProcessing(false);
    }
  };

  return {
    payNow,

    loading:
      processing || createOrderMutation.isPending || verifyMutation.isPending,
  };
};
