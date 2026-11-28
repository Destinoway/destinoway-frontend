"use client";

import Image from "next/image";

const IMG = "/images/bus/booking";
const TITLES = ["Mr.", "Ms.", "Mrs.", "Master", "Miss"];
const GENDERS = ["Male", "Female", "Other"];

const inputCls = (err) =>
  `h-9 w-full rounded-lg border bg-white px-4 text-sm text-[#0b1c30] outline-none placeholder:text-[#999] focus:border-[#05144b] ${
    err ? "border-[#dc2626]" : "border-transparent"
  }`;

function Field({ label, error, className = "", children, id }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-[#dc2626]">{error}</span>}
    </div>
  );
}

function PassengerCard({ index, seat, value, errors, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const id = (f) => `p${index}-${f}`;
  const restriction =
    seat.state === "availableFemale" ? "Female" : seat.state === "availableMale" ? "Male" : null;

  return (
    <fieldset className="flex flex-col gap-4 rounded-xl bg-[rgba(239,244,255,0.7)] p-4">
      <legend className="sr-only">
        Passenger {index + 1}, seat {seat.id}
      </legend>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
            {index + 1}
          </span>
          <span className="text-base leading-[22px] font-semibold text-[#0b1c30]">Passenger {index + 1}</span>
        </div>
        <span className="rounded bg-[#d3e4fe] px-2 py-0.5 text-xs leading-[14px] font-semibold tracking-[0.33px] text-[#0b1c30]">
          Seat: {seat.id}
          {restriction && <span className="ml-1 font-normal text-[#45464f]">({restriction} only)</span>}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-12">
        <Field label="Title" id={id("title")} className="md:col-span-2">
          <select
            id={id("title")}
            value={value.title}
            onChange={(e) => set({ title: e.target.value })}
            className={`${inputCls(false)} cursor-pointer pr-2 pl-3`}
          >
            {TITLES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Age (Years) *" id={id("age")} error={errors.age} className="md:order-last md:col-span-3">
          <input
            id={id("age")}
            inputMode="numeric"
            value={value.age}
            onChange={(e) => set({ age: e.target.value.replace(/\D/g, "").slice(0, 3) })}
            placeholder="28"
            className={inputCls(errors.age)}
          />
        </Field>
        <Field label="First & Middle Name *" id={id("first")} error={errors.first} className="col-span-2 md:col-span-4">
          <input
            id={id("first")}
            value={value.first}
            onChange={(e) => set({ first: e.target.value })}
            autoComplete="given-name"
            placeholder="Rahul"
            className={inputCls(errors.first)}
          />
        </Field>
        <Field label="Last Name *" id={id("last")} error={errors.last} className="col-span-2 md:col-span-3">
          <input
            id={id("last")}
            value={value.last}
            onChange={(e) => set({ last: e.target.value })}
            autoComplete="family-name"
            placeholder="Sharma"
            className={inputCls(errors.last)}
          />
        </Field>
      </div>

      <div role="radiogroup" aria-label={`Passenger ${index + 1} gender`} className="flex flex-wrap items-center gap-4">
        <span className="text-[11px] leading-[14px] font-medium tracking-[0.33px] text-[#45464f]">Gender:</span>
        {GENDERS.map((g) => {
          const disabled = restriction && g !== restriction;
          return (
            <label
              key={g}
              className={`flex items-center gap-1.5 text-sm text-[#0b1c30] ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name={id("gender")}
                checked={value.gender === g}
                disabled={disabled}
                onChange={() => set({ gender: g })}
                className="size-[13px] accent-[#05144b]"
              />
              {g}
            </label>
          );
        })}
        {errors.gender && <span className="text-[11px] text-[#dc2626]">{errors.gender}</span>}
      </div>
    </fieldset>
  );
}

export default function TravelerDetails({ seats, passengers, setPassengers, errors, open, setOpen, saveProfile, setSaveProfile }) {
  return (
    <section
      id="traveler-details"
      className="scroll-mt-6 rounded-xl bg-white p-4 shadow-[1px_1px_10px_rgba(0,0,0,0.2)] sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl leading-6 font-bold text-[#05144b] sm:text-2xl">Traveler Details</h2>
          <p className="text-xs leading-4 text-[#45464f]">
            Please ensure passenger names match valid government-issued photo ID cards.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="traveler-forms"
          aria-label={open ? "Collapse traveler details" : "Expand traveler details"}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eff4ff]"
        >
          <Image src={`${IMG}/chevron-small.svg`} alt="" width={8} height={4.93} className={open ? "rotate-180" : ""} />
        </button>
      </div>

      {open && (
        <div id="traveler-forms" className="mt-4 flex flex-col gap-4">
          {seats.map((seat, i) => (
            <PassengerCard
              key={seat.id}
              index={i}
              seat={seat}
              value={passengers[i]}
              errors={errors[i] || {}}
              onChange={(v) => setPassengers(passengers.map((p, j) => (j === i ? v : p)))}
            />
          ))}
          <label className="flex cursor-pointer items-center gap-2 pt-2 text-xs leading-4 text-[#45464f]">
            <input
              type="checkbox"
              checked={saveProfile}
              onChange={(e) => setSaveProfile(e.target.checked)}
              className="size-4 accent-[#0075ff]"
            />
            Save traveler details to Destinoway profile for 1-click booking on return and future trips
          </label>
        </div>
      )}
    </section>
  );
}
