"use client";

import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { createBusPaymentOrder, fetchBusPaymentStatus, verifyBusPayment } from "@/modules/bus/services/busBooking";
import { loadRazorpay } from "@/modules/payments/utils/loadRazorpay";
import { busBookingHrefFromParams, busSearchHref } from "@/modules/bus/utils/busSearchHref";
import { App } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import BookingSkeleton from "../booking/BookingSkeleton";
import {
  TripSummary,
  readBookingSession,
  useHydrated,
  writeBookingSession,
} from "../booking/bookingShared";
const IMG = "/images/bus/payment";

function formatAmount(amount, currency) {
  if (!Number.isFinite(amount) || !/^[A-Z]{3}$/.test(currency)) return "Fare shown in checkout";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);
}

function openCheckout(checkout) {
  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: checkout.keyId,
      order_id: checkout.orderId,
      amount: checkout.amount,
      currency: checkout.currency,
      name: "Destinoway",
      handler: (response) => resolve({
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      }),
      modal: { ondismiss: () => resolve(null) },
    });
    try {
      razorpay.open();
    } catch (error) {
      reject(error);
    }
  });
}

export default function BusPayment({ params }) {
  const { message } = App.useApp();
  const { session, isAuthenticated, requireAuth } = useAuthGuard();
  const hydrated = useHydrated();
  const [saved, setSaved] = useState(() =>
    typeof window === "undefined" ? null : readBookingSession(params),
  );
  const active = useRef(false);
  const [busy, setBusy] = useState(false);
  const bookingHref = busBookingHrefFromParams(params);

  if (!hydrated) return <BookingSkeleton />;

  const selection = saved?.selection;
  if (!selection || !Object.values(saved.itineraries ?? {}).some((seat) => seat.bookingId)) {
    return (
      <div className="mx-auto max-w-lg p-8 text-[#05144b]">
        <h1 className="text-xl font-bold">Booking details needed</h1>
        <Link className="underline" href={selection ? bookingHref : busSearchHref(params)}>
          {selection ? "Back to Traveler Details" : "Back to Bus Results"}
        </Link>
      </div>
    );
  }

  const { bus, seats, pickup, drop } = selection;
  const isGroup = seats.length > 1;
  const seatPayments = seats.map((seat) => ({ seat, itinerary: saved.itineraries[seat.key] }));
  const currencies = new Set(seatPayments.map(({ itinerary }) => itinerary?.currency));
  const hasTotal = currencies.size === 1 && seatPayments.every(({ itinerary }) => Number.isFinite(itinerary?.amount));
  const total = hasTotal
    ? formatAmount(seatPayments.reduce((sum, { itinerary }) => sum + itinerary.amount, 0), seatPayments[0].itinerary.currency)
    : "Unavailable";
  const singlePayment = isGroup ? null : seatPayments[0];
  const canPay = singlePayment?.itinerary?.state === "ready";
  const isOwner = isAuthenticated && saved.checkoutOwner === session.user.id;
  const lead = saved.passengers?.[0];
  const contact = saved.contact;

  const runPayment = async (seatKey, itinerary, pay) => {
    if (active.current || (pay && isGroup)) return;
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    if (!isOwner) return;
    active.current = true;
    setBusy(true);

    const saveSeat = (patch) => {
      const current = readBookingSession(params);
      if (!current || current.checkoutOwner !== session.user.id) {
        throw new Error("Could not restore your payment progress.");
      }
      const next = writeBookingSession(params, {
        itineraries: {
          ...current.itineraries,
          [seatKey]: { ...current.itineraries[seatKey], ...patch },
        },
      });
      if (!next) throw new Error("Could not save your payment progress.");
      setSaved(next);
    };

    try {
      const { bookingId } = itinerary;
      const status = await fetchBusPaymentStatus(bookingId);
      if (status.supplierStatus === "confirmed") {
        saveSeat({ state: "confirmed" });
        return;
      }
      if (!pay || itinerary.state !== "ready") {
        message.info("The supplier has not confirmed this ticket yet.");
        return;
      }
      if (!(await loadRazorpay())) throw new Error("Unable to load Razorpay.");
      const checkout = itinerary.checkout ?? await createBusPaymentOrder(bookingId);
      saveSeat({ checkout, state: "checking" });
      const payment = await openCheckout(checkout);
      if (!payment) {
        saveSeat({ state: "ready" });
        return;
      }
      await verifyBusPayment(bookingId, payment);
      const verified = await fetchBusPaymentStatus(bookingId);
      if (verified.supplierStatus === "confirmed") {
        saveSeat({ state: "confirmed" });
      } else {
        message.info("Payment verified. Check again for supplier confirmation.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message || "Could not complete the payment request.");
    } finally {
      active.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#d5e0e6] px-4 pb-16">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[146px] bg-[#05144b]" />
      <div className="relative mx-auto max-w-[1251px]">
        <Link href={bookingHref} className="inline-block py-7 text-sm font-semibold text-white hover:underline">
          <span aria-hidden>?</span> Back to Traveler Details
        </Link>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_401px]">
          <div className="flex min-w-0 flex-col gap-6">
            <TripSummary bus={bus} seats={seats} pickup={pickup} drop={drop} date={params} />
            {isOwner && lead && (
              <section aria-label="Traveler details" className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 text-[#0b1c30] shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#dce9ff]">
                    <Image src={`${IMG}/passenger.svg`} alt="" width={18.33} height={18.33} />
                  </span>
                  <div>
                    <p className="flex flex-wrap items-center gap-1 font-bold leading-[22px]">
                      {lead.title} {lead.first} {lead.last}
                      {seats.length > 1 && (
                        <span className="rounded bg-[#e5eeff] px-1 text-[11px]">+{seats.length - 1} {seats.length === 2 ? "Traveler" : "Travelers"}</span>
                      )}
                    </p>
                    <p className="text-xs text-[#727272]">
                      Primary Passenger ? Seats <span className="font-semibold text-[#ba611e]">{seats.map((seat) => seat.id).join(", ")}</span>
                    </p>
                  </div>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#45464f]">
                  {contact?.phone && <span className="flex items-center gap-1"><Image src={`${IMG}/phone.svg`} alt="" width={10} height={14.67} /> +91 {contact.phone}</span>}
                  {contact?.email && <span className="flex min-w-0 items-center gap-1"><Image src={`${IMG}/mail.svg`} alt="" width={13.33} height={10.67} /> <span className="break-all">{contact.email}</span></span>}
                </div>
              </section>
            )}
            <section aria-labelledby="bus-make-payment" className="overflow-hidden rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <h1 id="bus-make-payment" className="flex items-center gap-3.5 bg-[#eff4ff] p-4 text-lg leading-6 font-semibold text-[#0b1c30]">
                <Image src={`${IMG}/wallet-header.svg`} alt="" width={19} height={18} />
                Make Payment
              </h1>
              <div className="p-4 sm:p-6">
              {!isOwner ? (
                <div className="mt-4">
                  <p>Sign in with the account that started this booking to view payment details.</p>
                  {!isAuthenticated && (
                    <button type="button" className="mt-2 font-bold underline" onClick={() => requireAuth()}>Log In</button>
                  )}
                </div>
              ) : (
                <>
                  {isGroup && seatPayments.some(({ itinerary }) => itinerary?.state !== "confirmed") && (
                    <p role="status" className="mt-3 rounded-lg bg-[#eff4ff] p-3 text-sm text-[#45464f]">
                      Single checkout for multiple seats is currently unavailable.
                    </p>
                  )}
                  {canPay && (
                    <div className="rounded-xl bg-[#f5f8fc] p-4">
                      <p className="font-semibold text-[#0b1c30]">Pay securely with Razorpay</p>
                      <p className="mt-1 text-sm text-[#45464f]">Choose your payment method in Razorpay Checkout.</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-[#45464f]">Total Payable Amount</p>
                          <p className="text-xl font-bold text-[#0b1c30]">{total}</p>
                        </div>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => runPayment(singlePayment.seat.key, singlePayment.itinerary, true)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#e08b00] px-8 py-4 text-sm font-bold text-white shadow-sm disabled:opacity-50"
                        >
                          <Image src={`${IMG}/lock.svg`} alt="" width={13.33} height={17.5} />
                          {busy ? "Processing..." : "Make Payment"}
                        </button>
                      </div>
                    </div>
                  )}
                  {!canPay && <ul className="mt-3 divide-y divide-[#e2e8f0]">
                    {seatPayments.map(({ seat, itinerary }) => (
                      <li key={seat.key} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                        <div>
                          <p className="font-semibold text-[#05144b]">Seat {seat.id}</p>
                          {itinerary?.state === "confirmed" && <p className="text-green-700">Ticket confirmed</p>}
                          {itinerary?.state === "checking" && <p>Awaiting ticket confirmation</p>}
                          {!itinerary?.bookingId && (
                            <p className="text-red-700">
                              {itinerary?.state === "failed"
                                ? "Itinerary creation failed."
                                : "Itinerary status is unavailable. Contact support before booking this seat again."}
                            </p>
                          )}
                        </div>
                        {itinerary?.bookingId && itinerary.state !== "confirmed" && (isGroup || !canPay) && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => runPayment(seat.key, itinerary, false)}
                            className="font-semibold text-[#05144b] underline disabled:opacity-50"
                          >
                            Check status
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>}
                </>
              )}
              </div>
            </section>
          </div>
          {isOwner && (
            <aside className="rounded-xl bg-white p-5 shadow-sm sm:p-6" aria-labelledby="bus-price-details">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="bus-price-details" className="text-xl font-bold text-[#0b1c30]">Price Details</h2>
                <span className="rounded-full bg-[#eff4ff] px-2 py-1 text-[11px] text-[#45464f]">
                  {seats.length} {seats.length === 1 ? "Passenger" : "Passengers"}
                </span>
              </div>
              <dl className="mt-4 space-y-3 text-sm text-[#45464f]">
                {seatPayments.map(({ seat, itinerary }) => (
                  <div key={seat.key} className="flex justify-between gap-3">
                    <dt>Seat {seat.id}</dt>
                    <dd>{itinerary?.bookingId ? formatAmount(itinerary.amount, itinerary.currency) : "Unavailable"}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3 rounded-xl bg-[#eff4ff] p-4 font-bold text-[#0b1c30]">
                  <dt>Total Amount</dt>
                  <dd>{total}</dd>
                </div>
              </dl>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
