export const buildBookingPayload = ({ bookingData = {}, guestData = {}, requestData = {} }) => {
  const guests = Array.isArray(guestData?.paxDetails) ? guestData.paxDetails : [];
  const roomCount = Math.max(1, ...(guests.map((guest) => Number(guest?.roomNo) || 1)));
  const rooms = Array.from({ length: roomCount }, (_, index) => {
    const roomGuests = guests.filter((guest) => Number(guest?.roomNo) === index + 1);
    const toGuest = (guest) => ({
      title: guest?.title || (guest?.isChild ? "Master" : "Mr"),
      firstName: guest?.firstName || "",
      lastName: guest?.lastName || "",
    });
    return {
      adults: roomGuests.filter((guest) => !guest?.isChild).map(toGuest),
      children: roomGuests.filter((guest) => guest?.isChild).map(toGuest),
    };
  });
  const primaryGuest = guests.find((guest) => !guest?.isChild) || guests[0] || {};
  const specialServiceRequest = [
    ...(Array.isArray(requestData?.common) ? requestData.common : []),
    requestData?.other || "",
  ].filter(Boolean).join(", ");

  const itineraryId =
    bookingData?.itineraryId ||
    bookingData?.selectedRoom?.itineraryId ||
    bookingData?.rooms?.[0]?.itineraryId;

  return {
    searchId: bookingData?.searchId || "",
    supplierHotelId: bookingData?.supplierHotelId || "",
    recommendationId: bookingData?.recommendationId || "",
    ...(itineraryId ? { itineraryId } : {}),
    contactInfo: {
      title: primaryGuest?.title || "Mr",
      firstName: primaryGuest?.firstName || "",
      lastName: primaryGuest?.lastName || "",
      mobile: guestData?.customerMobile || "",
      email: guestData?.customerEmail || "",
      address: guestData?.customerAddress || "",
      state: guestData?.customerState || "",
      city: guestData?.customerCity || "",
      pin: guestData?.customerPostalCode || "",
    },
    rooms,
    specialServiceRequest,
  };
};
