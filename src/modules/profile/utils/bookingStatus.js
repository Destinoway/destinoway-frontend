const STATUS_META = {
  confirmed: { label: "Confirmed", group: "confirmed", tone: "green" },
  b0: { label: "Confirmed", group: "confirmed", tone: "green" },
  awaiting_payment: {
    label: "Awaiting Payment",
    group: "pending",
    tone: "orange",
  },
  cancelled: { label: "Cancelled", group: "cancelled", tone: "red" },
  canceled: { label: "Cancelled", group: "cancelled", tone: "red" },
};

export const getBookingStatusMeta = (status) => {
  const key = String(status ?? "")
    .trim()
    .toLowerCase();

  if (STATUS_META[key]) return STATUS_META[key];

  return {
    label: key
      ? key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Pending",
    group: "pending",
    tone: "orange",
  };
};

export const STATUS_TONE_CLASSES = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-600",
};
