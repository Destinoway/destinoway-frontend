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

  const openRazorpay = ({ order, customer, tempBookingId }) => {
    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "PAN Journey",
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
            tempBookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          console.log("Verify Response:", verifyResponse);

          // Verify response
          if (!verifyResponse?.success || !verifyResponse?.paymentVerified) {
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

          const bookingRefNo = verifyResponse.bookingRefNo;

          console.log("Booking Ref:", bookingRefNo);

          // Redirect to success page
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

    // ============================
    // Payment Failed Event
    // ============================

    razorpay.on("payment.failed", function (response) {
      console.error("Payment Failed :", response);
      message.error(response?.error?.description || "Payment failed.");
      setProcessing(false);
    });

    razorpay.open();
  };

  const payNow = async ({ tempBookingId, customer }) => {
    if (processing) return;
    setProcessing(true);
    try {
      message.loading({
        key: "payment",
        content: "Preparing secure payment...",
        duration: 0,
      });

      // ============================
      // Load Razorpay SDK
      // ============================

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        message.error({
          key: "payment",
          content: "Unable to load Razorpay.",
        });
        setProcessing(false);
        return;
      }

      // ============================
      // Create Razorpay Order
      // ============================

      const order = await createOrderMutation.mutateAsync({
        tempBookingId,
      });
      console.log("Order Created :", order);

      // ============================
      // Open Razorpay Checkout
      // ============================

      openRazorpay({
        order,
        customer,
        tempBookingId,
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

    // ❌ finally intentionally removed
    // Processing verify/cancel/fail ke baad hi false hoga.
  };

  return {
    payNow,

    loading:
      processing || createOrderMutation.isPending || verifyMutation.isPending,
  };
};
