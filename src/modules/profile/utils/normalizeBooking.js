// Normalizes the different get-booking-details response shapes
// (paid/confirmed vs. awaiting payment) into a single shape.
export const normalizeBooking = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;

  const contactInfo = raw.contactInfo || {};
  const price = raw.price || {};
  const fullName = [contactInfo.title, contactInfo.firstName, contactInfo.lastName]
    .filter(Boolean)
    .join(" ");

  const rooms = raw.rooms || raw.supplierResponse?.HotelRoomDetail || [];
  const occupants = rooms.flatMap((room) => [
    ...(room.adults || []).map((g) => ({ ...g, occupantType: "adult" })),
    ...(room.children || []).map((g) => ({ ...g, occupantType: "child" })),
  ]);

  const existingGuest = raw.guestDetails;
  const guestDetails =
    existingGuest && !Array.isArray(existingGuest)
      ? existingGuest
      : {
          customerName: fullName,
          customerMobile: contactInfo.mobile,
          customerEmail: contactInfo.email,
          customerAddress: [
            contactInfo.address,
            contactInfo.city,
            contactInfo.state,
          ]
            .filter(Boolean)
            .join(", "),
          customerPostalCode: contactInfo.pin,
          occupants,
        };

  const total = price.total ?? 0;

  return {
    ...raw,
    bookingRefNo: raw.bookingRefNo || raw.transactionId,
    checkInDate: raw.checkInDate || raw.stay?.checkIn,
    checkOutDate: raw.checkOutDate || raw.stay?.checkOut,
    pricing: raw.pricing || {
      baseAmount: total,
      serviceCharge: null,
      platformFeeAndTax: null,
      finalPrice: total,
      currency: price.currency || "INR",
    },
    payableAmount: raw.payableAmount ?? total,
    guestDetails,
    supplierResponse: raw.supplierResponse || {
      CancellationPolicy: null,
      HotelDetails: raw.hotel,
      HotelRoomDetail: rooms,
    },
  };
};
