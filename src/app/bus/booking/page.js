import BusBooking from "@/modules/bus/components/booking/BusBooking";
import dayjs from "dayjs";

const one = (v) => (Array.isArray(v) ? v[0] : v) || "";

export const metadata = {
  title: "Bus Booking Details | Destinoway",
  robots: { index: false, follow: false },
};

export default async function BusBookingPage({ searchParams }) {
  const sp = await searchParams;
  const date = dayjs(one(sp.date), "YYYY-MM-DD");
  const params = {
    from: one(sp.from) || "Jaipur",
    to: one(sp.to) || "Delhi",
    date: date.isValid() ? date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    bus: one(sp.bus),
    seats: one(sp.seats),
    pickup: one(sp.pickup),
    drop: one(sp.drop),
  };
  return <BusBooking params={params} />;
}
