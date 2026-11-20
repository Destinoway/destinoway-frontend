"use client";

import { fareBreakdown, inr } from "@/modules/bus/data/busResultsData";
import { busBookingHrefFromParams, busSearchHref } from "@/modules/bus/utils/busSearchHref";
import { App } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import BookingSkeleton from "../booking/BookingSkeleton";
import {
  HoldTimer,
  TripSummary,
  getHoldEnd,
  mmss,
  readBookingSession,
  resolveBooking,
  useCountdown,
  useHydrated,
  writeBookingSession,
} from "../booking/bookingShared";
import { PriceDetails, PromoCard } from "../booking/FareSidebar";
import { METHODS, MethodPanel, MethodTabs, VPA_RE, validateCard } from "./PaymentMethods";

const IMG = "/images/bus/payment";

const TRUST = [
  { title: "PCI-DSS 3.2", text: "Certified Secure Vault", icon: "t-pci.svg", size: [18.67, 23.33] },
  { title: "Instant Refund", text: "Zero-deduction guarantee", icon: "t-refund.svg", size: [25.67, 25.67] },
  { title: "24/7 Road Desk", text: "Live operator support", icon: "t-support.svg", size: [21, 24.5] },
];

const EMPTY_PAYMENT = {
  upi: { vpa: "", verified: false, error: null },
  card: { number: "", name: "", expiry: "", cvv: "" },
  bank: "",
  emi: "",
  wallet: "",
};

const formatPhone = (p) => (p?.length === 10 ? `+91 ${p.slice(0, 5)} ${p.slice(5)}` : p);
const isWindow = (seat) => seat.row === "A" || seat.row === "D";

function SessionTimer({ endAt, onExpire }) {
  const left = useCountdown(endAt, onExpire);
  return (
    <span
      role="timer"
      className="flex items-center gap-1 rounded-full bg-white px-4 py-1 text-xs leading-4 font-bold tracking-[0.24px] text-[#ba611e] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
    >
      <Image src={`${IMG}/timer.svg`} alt="" width={12} height={14} />
      Session expires in : <span className="text-[#0b1c30] tabular-nums">{mmss(left)}</span>
    </span>
  );
}

function validatePayment(method, state) {
  if (method === "upi") {
    // QR flow needs nothing typed; a typed VPA must be valid and verified.
    if (state.upi.vpa && !VPA_RE.test(state.upi.vpa)) return { upi: "Enter a valid UPI ID, e.g. name@okhdfcbank" };
    if (state.upi.vpa && !state.upi.verified) return { upi: "Tap Verify VPA first" };
    return {};
  }
  if (method === "credit" || method === "debit" || method === "amex") {
    const card = validateCard(state.card, method);
    return Object.keys(card).length ? { card } : {};
  }
  if (method === "netbanking" && !state.bank) return { bank: "Choose your bank" };
  if (method === "emi" && !state.emi) return { emi: "Choose an EMI or PayLater option" };
  if (method === "wallet" && !state.wallet) return { wallet: "Choose a wallet" };
  return {};
}

export default function BusPayment({ params }) {
  const { message, modal } = App.useApp();
  const hydrated = useHydrated();
  const booking = useMemo(() => resolveBooking(params), [params]);
  const searchHref = busSearchHref(params);
  const bookingHref = busBookingHrefFromParams(params);

  // Initialisers run in the browser (the page shows a skeleton until hydrated).
  const [saved] = useState(() => (typeof window === "undefined" ? null : readBookingSession(params)));
  const [holdEnd] = useState(() => (typeof window === "undefined" ? 0 : getHoldEnd(params)));
  const [expired, setExpired] = useState(() => holdEnd > 0 && holdEnd <= Date.now());
  const [couponCode, setCouponCodeState] = useState(() => saved?.couponCode ?? null);
  const [method, setMethod] = useState("upi");
  const [payState, setPayState] = useState(EMPTY_PAYMENT);
  const [errors, setErrors] = useState({});

  const onExpire = useMemo(() => () => setExpired(true), []);

  if (!hydrated) return <BookingSkeleton />;

  const problem = booking.error || (!saved?.passengers || !saved?.contact ? "missing" : null);
  if (problem) {
    const missing = problem === "missing";
    return (
      <div className="min-h-[60vh] bg-[#d5e0e6] px-4 py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl bg-white p-8 text-center shadow-[1px_1px_10px_rgba(0,0,0,0.1)]">
          <h1 className="text-xl font-bold text-[#05144b]">
            {missing ? "Traveller details needed" : "We couldn't load this booking"}
          </h1>
          <p className="text-sm text-[#45464f]">
            {missing ? "Please fill in the passenger and contact details before paying." : booking.error}
          </p>
          <Link
            href={missing ? bookingHref : searchHref}
            className="rounded-lg bg-[#e08b00] px-6 py-2.5 text-sm font-bold text-white"
          >
            {missing ? "Add traveller details" : "Back to bus results"}
          </Link>
        </div>
      </div>
    );
  }

  const { bus, seats, pickup, drop } = booking;
  const { passengers, contact } = saved;
  const fare = fareBreakdown(seats.length, bus.price, couponCode);
  const lead = passengers[0];

  const setCouponCode = (code) => {
    setCouponCodeState(code);
    writeBookingSession(params, { couponCode: code });
  };

  const changeMethod = (m) => {
    setMethod(m);
    setErrors({});
  };

  const pay = () => {
    if (expired) return;
    const errs = validatePayment(method, payState);
    setErrors(errs);
    if (Object.keys(errs).length) {
      message.error({ content: "Please check your payment details", key: "bus-pay" });
      return;
    }
    // No payment gateway is connected yet: be explicit that nothing was charged.
    const label = METHODS.find((m) => m.key === method)?.label;
    modal.info({
      title: "Online payment isn't live yet",
      content: `Your booking is ready to pay ${inr(fare.total)} via ${label}, but the payment gateway hasn't been connected. No money has been charged.`,
      okText: "OK",
    });
  };

  return (
    <div className="relative min-h-screen bg-[#d5e0e6] pb-16">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[146px] bg-[#05144b]" />

      <div className="relative mx-auto max-w-[1283px] px-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-8 pb-6">
          <Link href={bookingHref} className="flex items-center gap-1 text-sm leading-4 font-semibold text-white hover:underline">
            <span aria-hidden>←</span> Back to Traveller Details
          </Link>
          <div className="flex items-center gap-6">
            <ul className="hidden items-center gap-6 xl:flex" aria-label="Payment security">
              {[
                ["h-shield.svg", [14.67, 18.33], "RBI Authorized PG", "100% Encrypted & Secure"],
                ["h-support.svg", [18.33, 16.5], "DestinoSafe 24x7", "1800-DESTINO Helpdesk"],
              ].map(([icon, size, t, d]) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[rgba(253,157,37,0.2)]">
                    <Image src={`${IMG}/${icon}`} alt="" width={size[0]} height={size[1]} />
                  </span>
                  <span className="flex flex-col text-xs leading-[15px]">
                    <span className="font-bold tracking-[0.24px] text-white">{t}</span>
                    <span className="font-medium text-[#fd9d25]">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            {!expired && <HoldTimer endAt={holdEnd} onExpire={onExpire} />}
          </div>
        </div>

        {expired && (
          <div role="alert" className="mb-6 flex flex-col items-start gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#991b1b]">
              <strong>Your seat hold has expired.</strong> No payment was taken — please select your seats again.
            </p>
            <Link href={searchHref} className="shrink-0 rounded-lg bg-[#05144b] px-4 py-2 text-xs font-semibold text-white">
              Select seats again
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_401px]">
          <div className="flex min-w-0 flex-col gap-6">
            <TripSummary bus={bus} seats={seats} pickup={pickup} drop={drop} date={params} />

            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#dce9ff]">
                  <Image src={`${IMG}/passenger.svg`} alt="" width={18.33} height={18.33} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <p className="flex flex-wrap items-center gap-1">
                    <span className="text-base leading-[22px] font-bold text-[#0b1c30]">
                      {lead.title} {lead.first} {lead.last}
                    </span>
                    {passengers.length > 1 && (
                      <span className="rounded bg-[#e5eeff] px-1 py-0.5 text-[11px] leading-[15px] font-bold text-[#0b1c30]">
                        +{passengers.length - 1} {passengers.length === 2 ? "Adult" : "Adults"}
                      </span>
                    )}
                  </p>
                  <p className="text-xs leading-4 text-[#727272]">
                    Primary Passenger • Seats:{" "}
                    <span className="font-semibold text-[#ba611e]">
                      {seats.map((s) => `${s.id}${isWindow(s) ? " (Window)" : ""}`).join(", ")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs leading-4 text-[#45464f]">
                <span className="flex items-center gap-1">
                  <Image src={`${IMG}/phone.svg`} alt="" width={10} height={14.67} />
                  {formatPhone(contact.phone)}
                </span>
                <span className="flex min-w-0 items-center gap-1">
                  <Image src={`${IMG}/mail.svg`} alt="" width={13.33} height={10.67} />
                  <span className="truncate">{contact.email}</span>
                </span>
              </div>
            </div>

            <section
              aria-labelledby="make-payment"
              className="overflow-hidden rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#eff4ff] p-4">
                <h2 id="make-payment" className="flex items-center gap-3.5 text-lg leading-6 font-medium text-[#0b1c30]">
                  <Image src={`${IMG}/wallet-header.svg`} alt="" width={19} height={18} />
                  Make Payment
                </h2>
                {!expired && <SessionTimer endAt={holdEnd} onExpire={onExpire} />}
              </div>

              <div className="grid grid-cols-1 md:min-h-[580px] md:grid-cols-12">
                <div className="md:col-span-4 md:bg-[rgba(239,244,255,0.6)]">
                  <MethodTabs method={method} setMethod={changeMethod} />
                </div>
                <div className="flex flex-col justify-between gap-8 p-4 sm:p-6 md:col-span-8">
                  <div role="tabpanel">
                    <MethodPanel method={method} total={fare.total} state={payState} setState={setPayState} errors={errors} />
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl bg-[rgba(239,244,255,0.4)] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">Total Payable Amount</span>
                        <span className="text-xl leading-8 font-bold tracking-[-0.24px] text-[#0b1c30]">{inr(fare.total).replace("₹", "₹ ")}</span>
                      </div>
                      <button
                        type="button"
                        onClick={pay}
                        disabled={expired}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#e08b00] px-8 py-4 text-sm leading-5 font-bold tracking-[0.14px] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-[#c97c00] disabled:cursor-not-allowed disabled:opacity-50 sm:px-12"
                      >
                        <Image src={`${IMG}/lock.svg`} alt="" width={13.33} height={17.5} />
                        Make Payment • {inr(fare.total).replace("₹", "₹ ")}
                      </button>
                    </div>
                    <p className="text-xs leading-[19.5px] text-[#45464f]">
                      By clicking on <strong className="text-[#0b1c30]">Make Payment</strong>, I agree with the{" "}
                      <Link href="/terms-conditions" className="underline">
                        Booking Policies, Privacy Policy &amp; Terms
                      </Link>
                      , the Bus Operator Cancellation Rules, and the Passenger Agreement of Destinoway.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TRUST.map((t) => (
                <li key={t.title} className="flex items-center gap-4 rounded-xl bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                  <Image src={`${IMG}/${t.icon}`} alt="" width={t.size[0]} height={t.size[1]} />
                  <span className="flex flex-col">
                    <span className="text-base leading-[22px] font-bold text-[#0b1c30]">{t.title}</span>
                    <span className="text-xs leading-4 text-[#45464f]">{t.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-4">
            <PriceDetails fare={fare} seatCount={seats.length} price={bus.price} />
            <PromoCard
              fare={fare}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              onFeedback={(type, content) => message[type]({ content, key: "bus-coupon" })}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
