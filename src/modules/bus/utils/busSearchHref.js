// URL for the bus results page: /bus/search?from=…&to=…&date=YYYY-MM-DD
export const busSearchHref = ({ from, to, date }) =>
  `/bus/search?${new URLSearchParams({ from: from.trim(), to: to.trim(), date }).toString()}`;

// URL for the passenger/booking page. Everything needed to rebuild the
// selection lives in the query string so a refresh keeps the booking.
export const busBookingHref = ({ query, busId, seats, pickupId, dropId }) =>
  `/bus/booking?${new URLSearchParams({
    from: query.from,
    to: query.to,
    date: query.date,
    bus: busId,
    seats: seats.join(","),
    pickup: pickupId,
    drop: dropId,
  }).toString()}`;

// Payment page uses the same identifiers as the booking page.
export const busPaymentHref = (p) =>
  `/bus/payment?${new URLSearchParams({
    from: p.from,
    to: p.to,
    date: p.date,
    bus: p.bus,
    seats: p.seats,
    pickup: p.pickup,
    drop: p.drop,
  }).toString()}`;

export const busBookingHrefFromParams = (p) => busPaymentHref(p).replace("/bus/payment?", "/bus/booking?");
