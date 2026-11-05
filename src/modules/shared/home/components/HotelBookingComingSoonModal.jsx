"use client";

import { Button, Modal } from "antd";

export default function HotelBookingComingSoonModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={540}
      closable
      destroyOnHidden
      className="hotel-coming-soon-modal"
    >
      <div className="px-1 py-2 p-5!">
        {/* HEADER */}
        <div className="flex items-start gap-4 border-b border-gray-100 pb-1 ">
         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#72c0f0] via-[#4fa3c2] to-[#0f6a75] text-white text-[28px] shadow-[0_10px_30px_rgba(0,119,182,0.25)] -translate-y-4 transition-all duration-300 mt-4"> 
            🏨
          </div>

          <div className="flex-1">
            <h2 className="m-0 text-[24px] leading-7.5 font-bold text-[#72c0f0]">
              Hotel Booking Coming Soon
            </h2>

            <p className="mt-2 text-[14px] leading-6 text-gray-500">
              We’re building a smoother and smarter hotel booking experience for
              our users.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-2">
          <p className="text-[15px] leading-7 text-gray-600">
            Our hotel booking system is currently under testing and final
            improvements to ensure a seamless reservation experience with better
            performance, pricing, and reliability.
          </p>

          {/* FEATURE BOX */}
          <div className="mt-6 rounded-2xl border border-[#0077b6]/15 bg-[#0077b6]/5 p-5">
            <h3 className="text-[16px] font-semibold text-gray-800">
              ✨ What’s coming next?
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-[14px] text-gray-700">
                <span>✅</span>
                <span>Instant booking confirmation</span>
              </div>

              <div className="flex items-center gap-3 text-[14px] text-gray-700">
                <span>✅</span>
                <span>Exclusive hotel deals & offers</span>
              </div>

              <div className="flex items-center gap-3 text-[14px] text-gray-700">
                <span>✅</span>
                <span>Fast and secure reservations</span>
              </div>

              <div className="flex items-center gap-3 text-[14px] text-gray-700">
                <span>✅</span>
                <span>Improved hotel search experience</span>
              </div>
            </div>
          </div>

          {/* FOOTER TEXT */}
          <p className="mt-6 text-center text-[13px] leading-6 text-gray-900">
            Thank you for your patience and support while we prepare the best
            experience for you.
          </p>

          {/* BUTTON */}
          <div className="mt-7 flex justify-center">
            <Button
              size="large"
              onClick={onClose}
              className="h-11.5! rounded-xl! border-0! bg-linear-to-r! from-[#72c0f0]! via-[#4fa3c2]! to-[#0f6a75]! px-8! text-[15px]! font-semibold! text-white! hover:scale-105! hover:shadow-lg! transition-all! duration-300!"
            >
              Okay, Got it
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}