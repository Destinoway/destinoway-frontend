export const buildBookingPayload = ({
  bookingData = {},
  guestData = {},
  requestData = {},
  hotelDetailId = "",
  roomId = "",
}) => {
  const paxDetails = Array.isArray(guestData?.paxDetails)
    ? guestData.paxDetails
    : [];

  const primaryGuest = paxDetails[0] || {};

  const specialRequestRemarks = [
    ...(requestData?.common || []),
    requestData?.other || "",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    hotelDetailId: hotelDetailId || bookingData?.hotelDetailId || "",
    roomId: roomId || bookingData?.roomId || "",
    searchId: bookingData?.searchId || "",
    supplierHotelId: bookingData?.supplierHotelId || "",
    recommendationId: bookingData?.recommendationId || roomId || "",

    customerAddress: guestData?.customerAddress || "",
    customerMobile: guestData?.customerMobile || primaryGuest?.mobile || "",
    customerPostalCode: guestData?.customerPostalCode || "",

    paxDetails: paxDetails.map((guest) => ({
      employeeID: "1",
      firstName: guest?.firstName || "",
      lastName: guest?.lastName || "",
      passengerTyp: guest?.passengerTyp || "",
      roomNo: String(guest?.roomNo || ""),
      title: String(guest?.title || "Mr").toLowerCase(),
    })),

    passengerEmail: guestData?.passengerEmail || primaryGuest?.email || "",
    passengerMobile: guestData?.passengerMobile || primaryGuest?.mobile || "",
    remarks: "Book",
    specialRequestRemarks,
    panNumber: guestData?.panNumber || "",
  };
};
