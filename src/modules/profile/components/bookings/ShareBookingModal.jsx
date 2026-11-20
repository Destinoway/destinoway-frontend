"use client";

import {
  CopyOutlined,
  ShareAltOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { App, Modal } from "antd";

export default function ShareBookingModal({ open, onClose, shareText }) {
  const { message } = App.useApp();
  const handleWhatsApp = () => {
    const text = encodeURIComponent(shareText);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const whatsappUrl = isMobile
      ? `https://wa.me/?text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(shareText);

      message.success("Booking details copied successfully");
    } catch {
      message.error("Unable to copy booking details");
    }
  };

  return (
    <Modal open={open} footer={null} onCancel={onClose} centered width={520}>
      <div className="p-5">
        {/* ICON */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf7ff]">
            <ShareAltOutlined className="text-[26px] text-[#72C0F0]" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="mb-2 text-center text-[24px] font-bold text-gray-900">
          Share Booking Details
        </h2>

        {/* DESCRIPTION */}
        <p className="mb-6 text-center text-[15px] text-gray-600">
          Share your booking details instantly with family, friends or travel
          companions.
        </p>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-4">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex h-27.5 flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 transition-all hover:bg-green-100"
          >
            <WhatsAppOutlined className="text-[30px] text-green-600" />

            <span className="mt-3 text-[15px] font-semibold text-gray-900">
              WhatsApp
            </span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopyDetails}
            className="flex h-27.5 flex-col items-center justify-center rounded-xl border border-[#d9ecf8] bg-[#edf7ff] transition-all hover:bg-[#d9f1ff]"
          >
            <CopyOutlined className="text-[30px] text-[#3b82b6]" />

            <span className="mt-3 text-[15px] font-semibold text-gray-900">
              Copy Details
            </span>
          </button>
        </div>

        {/* INFO BOX */}
        <div className="mt-5 rounded-lg border border-[#d9ecf8] bg-[#edf7ff] p-3">
          <p className="mb-0 text-[13px] text-[#3b82b6]">
            The booking information will be shared exactly as shown in your
            reservation details.
          </p>
        </div>
      </div>
    </Modal>
  );
}
