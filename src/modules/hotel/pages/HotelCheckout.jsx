"use client";

import { useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import HotelCheckoutContent from "../components/hotel-checkout/HotelCheckoutContent";
import { useAddBalance } from "../hooks/useAddBalance";
import {
  useApplyCoupon,
  useBookingDetails,
  useRemoveCoupon,
} from "../hooks/useBookingDetails";
import { useHotelTicketing } from "../hooks/useHotelTicketing";
import { useHotelBookingStore } from "../store/booking.store";

export default function HotelCheckout() {
  const router = useRouter();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const bookingRefNo = searchParams.get("bookingRefNo");

  const { bookingData, setTicketingData } = useHotelBookingStore();
  const searchKey = bookingData?.selectedHotel?.searchKey;

  const { data, isLoading, isError, error, refetch } =
    useBookingDetails(bookingRefNo);

  const bookingDetails = data?.data ?? {};
  const pricing = bookingDetails?.pricing ?? {};
  const guestInfo = bookingDetails?.guestDetails ?? {};
  const supplierOccupants = (
    bookingDetails?.supplierResponse?.HotelRoomDetail ?? []
  ).flatMap((room) => [
    ...(room?.adults ?? []).map((guest) => ({
      ...guest,
      occupantType: "adult",
    })),
    ...(room?.children ?? []).map((guest) => ({
      ...guest,
      occupantType: "child",
    })),
  ]);
  const responseOccupants = Array.isArray(guestInfo)
    ? guestInfo
    : guestInfo?.occupants;
  const occupants =
    responseOccupants?.length > 0
      ? responseOccupants
      : supplierOccupants.length > 0
        ? supplierOccupants
        : (responseOccupants ?? []);
  const currency = pricing?.currency || "INR";
  const currencySymbol =
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || currency;

  const booking = {
    ...bookingDetails,
    bookingReference:
      bookingDetails?.bookingRefNo || bookingDetails?.bookingReference,
    tempBookingId:
      bookingDetails?.tempBookingId ||
      bookingDetails?.bookingId ||
      bookingDetails?._id,
    customer: bookingDetails?.customer || {
      name: guestInfo?.customerName,
      mobile: guestInfo?.customerMobile,
      address: guestInfo?.customerAddress,
      postalCode: guestInfo?.customerPostalCode,
    },
    guestDetails: occupants,
    bookingStatus: bookingDetails?.bookingStatus || {
      reservationStatus:
        bookingDetails?.supplierBookingStatus ||
        bookingDetails?.itineraryStatus,
      paymentStatus: bookingDetails?.paymentStatus,
    },
    priceSummary: bookingDetails?.priceSummary || {
      baseAmount: pricing?.baseAmount ?? 0,
      platformChargeandTax:
        (pricing?.serviceCharge ?? 0) + (pricing?.platformFeeAndTax ?? 0),
      totalAmount:
        pricing?.finalPrice ?? bookingDetails?.payableAmount ?? 0,
      totalPayableAmountAfterDiscount:
        bookingDetails?.payableAmount ?? pricing?.finalPrice ?? 0,
      currencySymbol,
    },
  };

  const { mutate: applyCoupon, isPending: isApplyCouponLoading } =
    useApplyCoupon({
      onSuccess: () => {
        message.success("Coupon applied successfully");

        queryClient.invalidateQueries({
          queryKey: ["hotel-booking-details", bookingRefNo],
        });
      },

      onError: (error) => {
        message.error(
          error?.response?.data?.message || "Failed to apply coupon",
        );
      },
    });

  const { mutate: removeCoupon, isPending: isRemoveCouponLoading } =
    useRemoveCoupon({
      onSuccess: () => {
        message.success("Coupon removed successfully");

        queryClient.invalidateQueries({
          queryKey: ["hotel-booking-details", bookingRefNo],
        });
      },

      onError: (error) => {
        message.error(
          error?.response?.data?.message || "Failed to remove coupon",
        );
      },
    });

  const handleApplyCoupon = (coupon) => {
    applyCoupon({
      tempBookingId: booking.tempBookingId,
      couponCode: coupon.code,
    });
  };

  const handleRemoveCoupon = () => {
    removeCoupon({
      tempBookingId: booking.tempBookingId,
    });
  };

  const { mutate: addBalanceMutation, isPending: isPaymentLoading } =
    useAddBalance();

  const { mutate: hotelTicketingMutation, isPending: isTicketingLoading } =
    useHotelTicketing();

  const handlePayment = () => {
    if (!bookingRefNo || !searchKey) {
      message.error("Booking information is missing.");
      return;
    }

    addBalanceMutation(
      {
        BookingRefNo: bookingRefNo,
      },
      {
        onSuccess: (response) => {
          const statusId = response?.data?.Response_Header?.Status_Id;

          if (statusId !== "11") {
            message.error(
              response?.data?.Response_Header?.Error_InnerException ||
                "Payment failed",
            );
            return;
          }

          hotelTicketingMutation(
            {
              BookingRefNo: bookingRefNo,
              SearchKey: searchKey,
            },
            {
              onSuccess: (ticketResponse) => {
                const ticketStatus =
                  ticketResponse?.data?.ResponseHeader?.StatusId;

                if (ticketStatus !== "11") {
                  message.error(
                    ticketResponse?.data?.ResponseHeader?.ErrorDesc ||
                      "Ticketing failed",
                  );
                  return;
                }

                setTicketingData(ticketResponse?.data);

                router.push("/hotel-booking-success");
              },

              onError: (error) => {
                message.error(error?.message || "Ticketing failed");
              },
            },
          );
        },

        onError: (error) => {
          message.error(error?.message || "Payment failed");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading booking details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Booking not found</h2>

          <p className="text-gray-500">{error?.message}</p>

          <button
            onClick={() => refetch()}
            className="mt-5 rounded bg-[#0f766e] px-5 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <HotelCheckoutContent
      booking={booking}
      bookingData={bookingData}
      loading={isPaymentLoading || isTicketingLoading}
      couponLoading={isApplyCouponLoading || isRemoveCouponLoading}
      onPay={handlePayment}
      onApplyCoupon={handleApplyCoupon}
      onRemoveCoupon={handleRemoveCoupon}
    />
  );
}
