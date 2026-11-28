"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { createBusItinerary } from "@/modules/bus/services/busBooking";
import { inr } from "@/modules/bus/data/busResultsData";
import { busPaymentHref, busSearchHref } from "@/modules/bus/utils/busSearchHref";
import { App } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import BookingSkeleton from "./BookingSkeleton";
import {
  TripSummary,
  readBookingSession,
  useHydrated,
  writeBookingSession,
} from "./bookingShared";
import { PriceDetails } from "./FareSidebar";
import TravelerDetails from "./TravelerDetails";

const IMG = "/images/bus/booking";
const card = "rounded-xl bg-white p-4 sm:p-6";

const emptyPassenger = (seat) => {
  const gender = seat.state === "availableFemale" ? "Female" : seat.state === "availableMale" ? "Male" : "";
  return { title: gender === "Female" ? "Ms." : "Mr.", first: "", last: "", age: "", gender };
};

function validate(passengers, seats, contact) {
  const errs = passengers.map((p, i) => {
    const e = {};
    if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(p.first.trim())) e.first = "Enter a valid first name";
    if (!/^[A-Za-z][A-Za-z .'-]{0,}$/.test(p.last.trim())) e.last = "Enter a valid last name";
    const age = Number(p.age);
    if (!p.age || !Number.isInteger(age) || age < 1 || age > 120) e.age = "Enter age (1–120)";
    if (!p.gender) e.gender = "Select gender";
    const seat = seats[i];
    if (seat.state === "availableFemale" && p.gender && p.gender !== "Female") e.gender = "This seat is for female passengers";
    if (seat.state === "availableMale" && p.gender && p.gender !== "Male") e.gender = "This seat is for male passengers";
    return e;
  });
  const contactErr = {};
  if (!/^[6-9]\d{9}$/.test(contact.phone)) contactErr.phone = "Enter a valid 10-digit mobile number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) contactErr.email = "Enter a valid email address";
  const ok = errs.every((e) => !Object.keys(e).length) && !Object.keys(contactErr).length;
  return { errs, contactErr, ok };
}

export default function BusBooking({ params }) {
  const { message } = App.useApp();
  const router = useRouter();
  const hydrated = useHydrated();
  const { session, isAuthenticated, requireAuth } = useAuthGuard();
  const searchHref = busSearchHref(params);

  // Restores what the user typed if they come back from the payment page.
  // (Initialisers run in the browser; the page renders a skeleton until hydrated.)
  const [saved] = useState(() => (typeof window === "undefined" ? null : readBookingSession(params)));
  const [passengers, setPassengers] = useState(
    () => saved?.passengers || (saved?.selection?.seats || []).map(emptyPassenger),
  );
  // null = not edited yet, so fall back to the logged-in user's details.
  const [contactEdits, setContactEdits] = useState(() => saved?.contact || { phone: null, email: null });
  const [errors, setErrors] = useState({ errs: [], contactErr: {} });
  const [travelerOpen, setTravelerOpen] = useState(false);
  const [saveProfile, setSaveProfile] = useState(true);

  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);

  const user = session?.user;
  const contact = {
    phone: contactEdits.phone ?? String(user?.phone || user?.mobile || "").replace(/\D/g, "").slice(-10),
    email: contactEdits.email ?? (user?.email || ""),
  };
  const setContact = (next) => setContactEdits(next);

  if (!hydrated) return <BookingSkeleton />;

  const booking = saved?.selection;
  if (!booking) {
    return (
      <div className="min-h-[60vh] bg-[#d5e0e6] px-4 py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center shadow-[1px_1px_10px_rgba(0,0,0,0.1)]">
          <h1 className="text-xl font-bold text-[#05144b]">We couldn&apos;t load this booking</h1>
          <p className="text-sm text-[#45464f]">Please select seats and boarding and dropping points again.</p>
          <Link href={searchHref} className="rounded-lg bg-[#e08b00] px-6 py-2.5 text-sm font-bold text-white">
            Back to bus results
          </Link>
        </div>
      </div>
    );
  }

  const { bus, seats, pickup, drop } = booking;
  const bookingStarted = Object.values(saved?.itineraries ?? {}).some((seat) => seat.bookingId);
  const groupCheckoutUnavailable = seats.length > 1 && !bookingStarted;
  const estimatedFare = seats.reduce((total, seat) => total + seat.price, 0);

  const proceed = async () => {
    if (submitting.current || groupCheckoutUnavailable) return;
    const previous = readBookingSession(params);
    if (previous?.checkoutOwner && previous.checkoutOwner !== user?.id) {
      if (!isAuthenticated) requireAuth();
      else message.error("Sign in with the account that started this booking.");
      return;
    }
    if (Object.values(previous?.itineraries ?? {}).some((seat) => seat.bookingId)) {
      router.push(busPaymentHref(params));
      return;
    }
    if (Object.values(previous?.itineraries ?? {}).some((seat) => seat.state === "pending")) {
      message.error("Seat booking could not be confirmed. Contact support before booking these seats again.");
      return;
    }
    const result = validate(passengers, seats, contact);
    setErrors(result);
    if (!result.ok) {
      const travelerBad = result.errs.some((e) => Object.keys(e).length);
      if (travelerBad) setTravelerOpen(true);
      message.error({ content: "Please fix the highlighted details", key: "bus-booking" });
      setTimeout(() => {
        document.getElementById(travelerBad ? "traveler-details" : "contact-info")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }
    const details = { passengers, contact: { ...contact, email: contact.email.trim() }, saveProfile };
    if (!writeBookingSession(params, details)) {
      message.error("Could not save your booking details in this tab.");
      return;
    }
    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    const { tui, busServiceId } = bus.seatLayoutRequest;
    const itineraries = {};
    submitting.current = true;
    setBusy(true);
    try {
      for (const [index, seat] of seats.entries()) {
        const passenger = passengers[index];
        itineraries[seat.key] = { state: "pending" };
        if (!writeBookingSession(params, { itineraries, checkoutOwner: user.id })) {
          throw new Error("Could not save your booking progress in this tab.");
        }
        try {
          const itinerary = await createBusItinerary({
            tui,
            busServiceId,
            seatName: seat.id,
            buid: Number(pickup.id),
            duid: Number(drop.id),
            passenger: {
              title: passenger.title.replace(/\.$/, ""),
              firstName: passenger.first.trim(),
              lastName: passenger.last.trim(),
              age: Number(passenger.age),
            },
            contact: details.contact,
          });
          itineraries[seat.key] = { ...itinerary, state: "ready" };
        } catch (error) {
          const status = error.response?.status;
          if (status >= 400 && status < 500 && status !== 408) {
            itineraries[seat.key] = { state: "failed" };
          }
        }
        if (!writeBookingSession(params, { itineraries })) {
          throw new Error("Could not save your booking progress in this tab.");
        }
      }
      if (Object.values(itineraries).some((seat) => seat.bookingId)) {
        router.push(busPaymentHref(params));
      } else if (Object.values(itineraries).some((seat) => seat.state === "pending")) {
        message.error("Seat booking could not be confirmed. Contact support before booking these seats again.");
      } else {
        message.error("The selected seats could not be booked. Please try again.");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  const field = (err) =>
    `flex h-[46px] items-center rounded-lg bg-[#eff4ff] ring-1 focus-within:ring-[#05144b] ${err ? "ring-[#dc2626]" : "ring-transparent"}`;

  return (
    <div className="relative min-h-screen bg-[#d5e0e6] pb-16 lg:pb-28">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[146px] bg-[#05144b]" />

      <div className="relative mx-auto max-w-[1283px] px-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-8 pb-6">
          <Link href={searchHref} className="flex items-center gap-1 text-sm leading-4 font-semibold text-white hover:underline">
            <span aria-hidden>←</span> Back to Seat Selection
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,32%)]">
          <div className="flex min-w-0 flex-col gap-6">
            <TripSummary bus={bus} seats={seats} pickup={pickup} drop={drop} date={params} />

            {!isAuthenticated && (
              <div className="flex flex-col gap-3 rounded-xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#07164c]">
                    <Image src={`${IMG}/account.svg`} alt="" width={18.33} height={18.33} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-base leading-5 font-semibold tracking-[0.14px] text-[#0b1c30]">Have a Destinoway Account?</p>
                    <p className="text-xs leading-4 text-[#45464f]">
                      Log in to autofill co-travelers and earn <strong>₹150 DestinoCoins</strong> on this trip.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => requireAuth()}
                  className="h-[38px] shrink-0 cursor-pointer rounded-lg bg-[#05144b] px-6 text-xs leading-4 font-semibold tracking-[0.24px] text-white hover:bg-[#0c2fb1]"
                >
                  Quick Log In
                </button>
              </div>
            )}

            <TravelerDetails
              seats={seats}
              passengers={passengers}
              setPassengers={setPassengers}
              errors={errors.errs}
              open={travelerOpen}
              setOpen={setTravelerOpen}
              saveProfile={saveProfile}
              setSaveProfile={setSaveProfile}
            />

            <section id="contact-info" className={`${card} scroll-mt-6 sm:min-h-[196px] drop-shadow-[1px_1px_5px_rgba(0,0,0,0.2)]`}>
              <h2 className="text-xl leading-6 font-semibold text-[#0b1c30] sm:text-2xl">Contact Information</h2>
              <p className="pt-1.5 pb-4 text-xs leading-4 text-[#45464f]">
                Your confirmed M-ticket, driver live GPS tracking link, and tax invoice will be sent here.
              </p>
              <div className="grid grid-cols-1 gap-4 pb-2 md:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="bus-phone" className="text-sm leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">
                    Mobile Phone Number *
                  </label>
                  <div className={`${field(errors.contactErr.phone)} px-2`}>
                    <span className="flex items-center gap-1 px-1 text-xs font-semibold tracking-[0.24px] text-[#0b1c30]">
                      <span aria-hidden>🇮🇳</span> +91
                    </span>
                    <span className="mx-1 h-5 w-px bg-[#c6c5d1]" />
                    <input
                      id="bus-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder="98230 44912"
                      className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#0b1c30] outline-none placeholder:text-[#999]"
                    />
                    <Image src={`${IMG}/phone.svg`} alt="" width={15.25} height={16.5} className="mr-1" />
                  </div>
                  {errors.contactErr.phone && <span className="text-[11px] text-[#dc2626]">{errors.contactErr.phone}</span>}
                </div>
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="bus-email" className="text-sm leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">
                    Email Address *
                  </label>
                  <div className={`${field(errors.contactErr.email)} px-4`}>
                    <input
                      id="bus-email"
                      type="email"
                      autoComplete="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="rahul.sharma@example.com"
                      className="min-w-0 flex-1 bg-transparent text-sm text-[#0b1c30] outline-none placeholder:text-[#999]"
                    />
                    <Image src={`${IMG}/mail.svg`} alt="" width={15} height={12} />
                  </div>
                  {errors.contactErr.email && <span className="text-[11px] text-[#dc2626]">{errors.contactErr.email}</span>}
                </div>
              </div>
            </section>

            <section className={`${card} flex flex-col gap-4 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:justify-between`}>
              <div className="flex flex-col gap-1">
                <span className="text-sm leading-[14px] font-medium tracking-[0.55px] text-[#45464f] uppercase">Estimated Seat Fare</span>
                <p className="flex items-baseline gap-1">
                  <span className="text-[32px] leading-10 font-bold tracking-[-0.64px] text-[#0b1c30] sm:text-4xl">{inr(estimatedFare)}</span>
                  <span className="text-xs leading-4 text-[#45464f]">(Final fares shown before payment)</span>
                </p>
                <p className="text-xs leading-4 text-[#45464f]">
                  By proceeding, you agree to the{" "}
                  <Link href="/terms-conditions" className="text-[#0b1c30] underline">
                    Terms of Service
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/terms-conditions" className="text-[#0b1c30] underline">
                    Cancellation Policy
                  </Link>
                  .
                </p>
                {groupCheckoutUnavailable && (
                  <p role="status" className="mt-1 text-xs text-[#45464f]">
                    Single checkout for multiple seats is currently unavailable.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={proceed}
                disabled={busy || groupCheckoutUnavailable}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#e08b00] px-6 py-4 text-lg xl:px-12 leading-7 font-bold tracking-[-0.5px] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-[#c97c00] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Preparing seats..." : "Proceed to Payment"}
                <Image src={`${IMG}/proceed-arrow.svg`} alt="" width={13.33} height={13.33} />
              </button>
            </section>
          </div>

          <aside aria-label="Fare and offers" className="flex flex-col gap-6">
            <PriceDetails estimatedTotal={estimatedFare} seatCount={seats.length} />
            <section className={`${card} shadow-[1px_1px_5px_rgba(0,0,0,0.2)]`} aria-labelledby="booking-offers">
              <div className="flex items-center justify-between gap-2">
                <h2 id="booking-offers" className="text-xl font-semibold text-[#0b1c30]">Offers &amp; Promo Code</h2>
                <Image src={`${IMG}/ticket.svg`} alt="" width={15} height={12} />
              </div>
              <p className="mt-2 rounded-xl bg-[#eff4ff] p-4 text-sm text-[#45464f]">
                Promo codes are currently unavailable for bus bookings.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
