"use client";

import { inr } from "@/modules/bus/data/busResultsData";
import Image from "next/image";
import { useState } from "react";

const IMG = "/images/bus/payment";

export const METHODS = [
  { key: "upi", label: "UPI & QR Pay", icon: "m-upi.svg", size: [13.5, 13.5], badge: "FAST" },
  { key: "credit", label: "Credit Card", icon: "m-credit.svg", size: [15, 12], dots: true },
  { key: "debit", label: "Debit Card", icon: "m-debit.svg", size: [15, 12], note: "ALL BANKS" },
  { key: "netbanking", label: "Net Banking", icon: "m-netbanking.svg", size: [15, 15] },
  { key: "amex", label: "AMEX / Diners", icon: "m-amex.svg", size: [15, 13.5] },
  { key: "emi", label: "Card EMI & PayLater", icon: "m-emi.svg", size: [12, 12] },
  { key: "wallet", label: "Wallets", icon: "m-wallet.svg", size: [15, 12] },
];

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM", "CRED", "Amazon Pay"];
const POPULAR_BANKS = ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB"];
const OTHER_BANKS = ["Bank of Baroda", "Canara Bank", "Union Bank", "IDFC First Bank", "Yes Bank", "IndusInd Bank"];
const EMI_OPTIONS = [
  { key: "simpl", label: "Simpl", note: "Pay in 15 days, zero interest" },
  { key: "lazypay", label: "LazyPay", note: "Buy now, pay later up to ₹10,000" },
  { key: "zest", label: "ZestMoney", note: "3–6 month EMI on travel" },
  { key: "card-emi", label: "Credit Card EMI", note: "3 / 6 months on HDFC, ICICI, Axis & SBI cards" },
];
const WALLETS = ["Paytm Wallet", "PhonePe Wallet", "Amazon Pay Balance", "MobiKwik", "Freecharge"];

// ---------- validation helpers (exported for the page's Make Payment) ----------

export const VPA_RE = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

const digits = (v) => v.replace(/\D/g, "");

function luhn(num) {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export function cardBrand(num) {
  const n = digits(num);
  if (/^3[47]/.test(n)) return "AMEX";
  if (/^3(0[0-5]|[68])/.test(n)) return "Diners";
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^(60|65|81|82|508)/.test(n)) return "RuPay";
  return null;
}

export function validateCard(card, method) {
  const e = {};
  const n = digits(card.number);
  const brand = cardBrand(n);
  if (method === "amex") {
    if (!(brand === "AMEX" || brand === "Diners")) e.number = "Enter an AMEX or Diners card number";
  } else if (brand === "AMEX" || brand === "Diners") {
    e.number = "Use the AMEX / Diners option for this card";
  }
  const lenOk = brand === "AMEX" ? n.length === 15 : brand === "Diners" ? n.length === 14 : n.length >= 13 && n.length <= 19;
  if (!e.number && (!lenOk || !luhn(n))) e.number = "Enter a valid card number";
  if (!/^[A-Za-z][A-Za-z .'-]{1,}$/.test(card.name.trim())) e.name = "Enter the name printed on the card";
  const m = card.expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = "Use MM/YY";
  else {
    const now = new Date();
    const exp = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59, 59);
    if (exp < now) e.expiry = "This card has expired";
  }
  const cvvLen = brand === "AMEX" ? 4 : 3;
  if (digits(card.cvv).length !== cvvLen) e.cvv = `Enter the ${cvvLen}-digit CVV`;
  return e;
}

// ---------- shared bits ----------

const label = "text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]";
const input = (err) =>
  `h-10 w-full rounded-lg bg-white px-4 text-sm text-[#0b1c30] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none ring-1 placeholder:text-[#999] focus:ring-[#05144b] ${
    err ? "ring-[#dc2626]" : "ring-transparent"
  }`;

function PanelHeader({ title, pill, children }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg leading-6 font-medium text-[#0b1c30]">{title}</h3>
        {pill && (
          <span className="rounded-full bg-[#eff4ff] px-2 py-0.5 text-[11px] leading-[14px] font-semibold tracking-[0.33px] text-[#ba611e]">
            {pill}
          </span>
        )}
      </div>
      {children && <div className="text-sm leading-5 text-[#45464f]">{children}</div>}
    </div>
  );
}

function OptionList({ name, options, value, onChange }) {
  return (
    <div role="radiogroup" className="flex flex-col gap-2">
      {options.map((o) => {
        const key = o.key || o;
        const active = value === key;
        return (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 ring-1 ${
              active ? "bg-[#e5eeff] ring-[#05144b]" : "bg-[rgba(239,244,255,0.7)] ring-transparent hover:ring-[#05144b]/30"
            }`}
          >
            <input type="radio" name={name} checked={active} onChange={() => onChange(key)} className="size-4 accent-[#05144b]" />
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-[#0b1c30]">{o.label || o}</span>
              {o.note && <span className="text-xs text-[#45464f]">{o.note}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ---------- panels ----------

function UpiPanel({ total, upi, setUpi, error }) {
  const [verifying, setVerifying] = useState(false);
  const verify = () => {
    if (!VPA_RE.test(upi.vpa.trim())) {
      setUpi({ ...upi, verified: false, error: "Enter a valid UPI ID, e.g. name@okhdfcbank" });
      return;
    }
    setVerifying(true);
    // Format check only — real VPA lookup happens in the payment gateway.
    setTimeout(() => {
      setVerifying(false);
      setUpi({ ...upi, verified: true, error: null });
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Scan & Pay with UPI" pill="Instant Confirmation">
        <ol className="list-inside list-decimal">
          <li>Open any UPI application on your mobile phone.</li>
          <li>
            Scan the dynamic QR code below to approve <strong className="text-[#0b1c30]">{inr(total)}</strong> directly.
          </li>
        </ol>
      </PanelHeader>

      <ul className="flex flex-wrap gap-1" aria-label="Supported UPI apps">
        {UPI_APPS.map((a) => (
          <li key={a} className="rounded bg-[#eff4ff] px-2 py-1 text-[11px] leading-[14px] font-bold tracking-[0.33px] text-[#0b1c30]">
            {a}
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-6 rounded-xl bg-[#eff4ff] p-4 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center rounded-xl bg-white p-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <Image src={`${IMG}/qr.svg`} alt="UPI QR code for this booking" width={160} height={160} />
          <span className="flex items-center gap-1 pt-1 text-[11px] leading-[14px] font-bold tracking-[0.33px] text-[#0b1c30]">
            <span className="size-2 animate-pulse rounded-full bg-[#fd9d25]" /> Dynamic QR Active
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs leading-4 font-semibold tracking-[0.24px] text-[#45464f]">Direct Payment Link</span>
          <p className="flex items-baseline gap-1">
            <span className="text-[32px] leading-10 font-bold tracking-[-1.42px] text-[#0b1c30]">{inr(total).replace("₹", "₹ ")}</span>
            <span className="text-xs leading-4 text-[#45464f]">INR (incl. GST)</span>
          </p>
          <p className="max-w-[240px] text-xs leading-4 text-[#45464f]">
            Scan with Google Pay, PhonePe, Paytm or any BHIM-certified banking app. Real-time confirmation in under 3 seconds.
          </p>
          <p className="flex items-center gap-1 rounded bg-[#e5eeff] px-2 py-1 text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#0b1c30]">
            <Image src={`${IMG}/verified.svg`} alt="" width={14.67} height={14} />
            Destinoway Verified Merchant ID: DW-TRVL-8821
          </p>
        </div>
      </div>

      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          ["Scan QR or enter VPA", "Use any camera or UPI app"],
          ["Approve Request", "Check Destinoway biller details"],
          ["Enter UPI PIN", "Receive instant e-Ticket on WhatsApp"],
        ].map(([t, d], i) => (
          <li key={t} className="flex flex-col items-center gap-1 rounded-lg bg-[#eff4ff] p-2 text-center">
            <span
              className={`flex size-7 items-center justify-center rounded-full text-[11px] font-bold ${
                i === 2 ? "bg-[#fd9d25] text-[#673b00]" : "bg-black text-white"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-[11px] leading-[14px] font-semibold tracking-[0.33px] text-[#0b1c30]">{t}</span>
            <span className="max-w-[130px] text-xs leading-[15px] text-[#45464f]">{d}</span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2 rounded-xl bg-[rgba(239,244,255,0.7)] p-4">
        <label htmlFor="upi-vpa" className="text-sm leading-5 font-bold tracking-[0.14px] text-[#0b1c30]">
          Or Pay via Virtual Payment Address (UPI ID)
        </label>
        <div className="flex gap-1">
          <input
            id="upi-vpa"
            value={upi.vpa}
            onChange={(e) => setUpi({ vpa: e.target.value.trim(), verified: false, error: null })}
            placeholder="example@okhdfcbank or 9876543210@paytm"
            autoComplete="off"
            className={input(upi.error || error)}
          />
          <button
            type="button"
            onClick={verify}
            disabled={verifying || !upi.vpa}
            className="shrink-0 cursor-pointer rounded-lg bg-[#e5eeff] px-4 text-xs leading-4 font-bold tracking-[0.24px] text-[#0b1c30] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            {verifying ? "Checking…" : upi.verified ? "Verified ✓" : "Verify VPA"}
          </button>
        </div>
        {(upi.error || error) && <span className="text-[11px] text-[#dc2626]">{upi.error || error}</span>}
        <p className="text-xs leading-4 text-[#45464f]">
          {upi.verified
            ? `${upi.vpa} looks good. Tap Make Payment to send the request.`
            : "A payment notification will pop up on your UPI application immediately."}
        </p>
      </div>
    </div>
  );
}

function CardPanel({ method, card, setCard, errors }) {
  const brand = cardBrand(card.number);
  const isAmex = brand === "AMEX";
  const formatNumber = (v) => {
    const d = digits(v).slice(0, 19);
    return isAmex || /^3[47]/.test(d)
      ? d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))
      : d.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const formatExpiry = (v) => {
    const d = digits(v).slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const title = method === "credit" ? "Pay with Credit Card" : method === "debit" ? "Pay with Debit Card" : "Pay with AMEX / Diners";

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title={title} pill="Secured by 3-D Secure">
        Your card details are sent straight to our RBI-authorised payment gateway and are never stored by Destinoway.
      </PanelHeader>
      <div className="grid grid-cols-2 gap-4 rounded-xl bg-[rgba(239,244,255,0.7)] p-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label htmlFor="cc-number" className={label}>
            Card Number *
          </label>
          <div className="relative">
            <input
              id="cc-number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatNumber(e.target.value) })}
              placeholder={method === "amex" ? "3782 822463 10005" : "4111 1111 1111 1111"}
              className={`${input(errors.number)} pr-24 tracking-[1px]`}
            />
            {brand && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded bg-[#e5eeff] px-2 py-0.5 text-[10px] font-bold text-[#05144b]">
                {brand}
              </span>
            )}
          </div>
          {errors.number && <span className="text-[11px] text-[#dc2626]">{errors.number}</span>}
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label htmlFor="cc-name" className={label}>
            Name on Card *
          </label>
          <input
            id="cc-name"
            autoComplete="cc-name"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            placeholder="RAHUL SHARMA"
            className={`${input(errors.name)} uppercase`}
          />
          {errors.name && <span className="text-[11px] text-[#dc2626]">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cc-exp" className={label}>
            Expiry (MM/YY) *
          </label>
          <input
            id="cc-exp"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
            placeholder="08/29"
            className={input(errors.expiry)}
          />
          {errors.expiry && <span className="text-[11px] text-[#dc2626]">{errors.expiry}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="cc-cvv" className={label}>
            CVV *
          </label>
          <input
            id="cc-cvv"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={card.cvv}
            onChange={(e) => setCard({ ...card, cvv: digits(e.target.value).slice(0, isAmex ? 4 : 3) })}
            placeholder={isAmex ? "••••" : "•••"}
            className={input(errors.cvv)}
          />
          {errors.cvv && <span className="text-[11px] text-[#dc2626]">{errors.cvv}</span>}
        </div>
      </div>
    </div>
  );
}

function NetBankingPanel({ bank, setBank, error }) {
  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Net Banking" pill="All major banks">
        You&apos;ll be redirected to your bank&apos;s secure login page to approve the payment.
      </PanelHeader>
      <div role="radiogroup" aria-label="Popular banks" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {POPULAR_BANKS.map((b) => (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={bank === b}
            onClick={() => setBank(b)}
            className={`cursor-pointer rounded-lg px-3 py-3 text-sm font-semibold ring-1 ${
              bank === b ? "bg-[#e5eeff] text-[#05144b] ring-[#05144b]" : "bg-[rgba(239,244,255,0.7)] text-[#0b1c30] ring-transparent hover:ring-[#05144b]/30"
            }`}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="other-bank" className={label}>
          Other banks
        </label>
        <select
          id="other-bank"
          value={OTHER_BANKS.includes(bank) ? bank : ""}
          onChange={(e) => setBank(e.target.value)}
          className={`${input(false)} cursor-pointer bg-[rgba(239,244,255,0.7)]`}
        >
          <option value="">Select your bank</option>
          {OTHER_BANKS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      {error && <span className="text-[11px] text-[#dc2626]">{error}</span>}
    </div>
  );
}

function ListPanel({ title, pill, intro, name, options, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title={title} pill={pill}>
        {intro}
      </PanelHeader>
      <OptionList name={name} options={options} value={value} onChange={onChange} />
      {error && <span className="text-[11px] text-[#dc2626]">{error}</span>}
    </div>
  );
}

export function MethodPanel({ method, total, state, setState, errors }) {
  switch (method) {
    case "upi":
      return <UpiPanel total={total} upi={state.upi} setUpi={(upi) => setState({ ...state, upi })} error={errors.upi} />;
    case "credit":
    case "debit":
    case "amex":
      return <CardPanel method={method} card={state.card} setCard={(card) => setState({ ...state, card })} errors={errors.card || {}} />;
    case "netbanking":
      return <NetBankingPanel bank={state.bank} setBank={(bank) => setState({ ...state, bank })} error={errors.bank} />;
    case "emi":
      return (
        <ListPanel
          title="Card EMI & PayLater"
          pill="No-cost options"
          intro="Split this booking into easy instalments or pay later. Eligibility is checked on the next screen."
          name="emi"
          options={EMI_OPTIONS}
          value={state.emi}
          onChange={(emi) => setState({ ...state, emi })}
          error={errors.emi}
        />
      );
    case "wallet":
      return (
        <ListPanel
          title="Wallets"
          pill="One-tap"
          intro="Pay using your wallet balance. You'll approve the payment in the wallet app."
          name="wallet"
          options={WALLETS}
          value={state.wallet}
          onChange={(wallet) => setState({ ...state, wallet })}
          error={errors.wallet}
        />
      );
    default:
      return null;
  }
}

export function MethodTabs({ method, setMethod }) {
  return (
    <div
      role="tablist"
      aria-label="Payment method"
      aria-orientation="vertical"
      className="flex gap-1 overflow-x-auto bg-[rgba(239,244,255,0.6)] p-1 [scrollbar-width:none] md:flex-col md:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {METHODS.map((m) => {
        const active = method === m.key;
        return (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setMethod(m.key)}
            className={`flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-lg p-3 text-left md:p-4 ${
              active ? "bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]" : "hover:bg-white/60"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`flex size-7 items-center justify-center rounded-md ${active ? "bg-[rgba(253,157,37,0.2)]" : "bg-[#e5eeff]"}`}
              >
                <Image src={`${IMG}/${m.icon}`} alt="" width={m.size[0]} height={m.size[1]} />
              </span>
              <span
                className={`text-sm leading-5 font-semibold tracking-[0.14px] whitespace-nowrap ${active ? "text-[#0b1c30]" : "text-[#45464f]"}`}
              >
                {m.label}
              </span>
            </span>
            <span className="hidden md:block">
              {m.badge ? (
                <span className="rounded bg-[#ba611e] px-1.5 py-0.5 text-[11px] leading-[15px] font-bold tracking-[0.5px] text-white">
                  {m.badge}
                </span>
              ) : m.dots ? (
                <span className="flex">
                  <span className="size-3.5 rounded-full bg-[#ba611e] opacity-80" />
                  <span className="-ml-1 size-3.5 rounded-full bg-[#673b00] opacity-80" />
                </span>
              ) : m.note ? (
                <span className="w-14 text-[11px] leading-[15px] font-bold text-[#45464f]">{m.note}</span>
              ) : (
                <Image src={`${IMG}/chevron-right.svg`} alt="" width={4.93} height={8} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
