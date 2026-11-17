"use client";

export default function BookingWebsiteLoader() {
  return (
    <div
      className="fixed inset-0 z-999999 flex items-center justify-center bg-white"
      role="status"
      aria-label="Loading"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0077b6]" />
    </div>
  );
}
