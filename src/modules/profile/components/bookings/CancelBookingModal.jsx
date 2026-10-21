"use client";

import { ExclamationCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { Modal } from "antd";
import { useState } from "react";

const CANCEL_REASONS = [
  "Change of travel plans",
  "Found a better price elsewhere",
  "Booked by mistake",
  "Personal or medical emergency",
  "Dates changed",
  "Hotel issue or poor reviews",
  "Payment or booking issue",
  "Other",
];

export default function CancelBookingModal({
  open,
  onCancel,
  onConfirm,
  loading,
  bookingRefNo,
  hotelName,
  cancellationCharge = 0,
}) {
  const [reason, setReason] = useState();
  const [otherText, setOtherText] = useState("");

  const isOther = reason === "Other";
  const remarks = isOther ? otherText.trim() : reason;

  return (
    <Modal open={open} onCancel={onCancel} footer={null} width={520} centered>
      <div className="p-5">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <ExclamationCircleFilled className="text-[28px] text-red-500" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-[24px] font-bold text-gray-900">
          Cancel Booking
        </h2>

        <p className="mb-6 text-center text-[15px] text-gray-600">
          Are you sure you want to cancel this booking?
        </p>

        <div className="rounded-xl border border-[#d9ecf8] bg-[#edf7ff] p-4">
          <div className="mb-3 flex justify-between">
            <span className="text-gray-500">Booking Ref</span>

            <span className="font-semibold text-gray-900">{bookingRefNo}</span>
          </div>

          <div className="mb-3 flex justify-between gap-4">
            <span className="text-gray-500">Hotel</span>

            <span className="text-right font-semibold text-gray-900">
              {hotelName}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Cancellation Charges</span>

            <span className="font-semibold text-green-600">
              ₹{cancellationCharge}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-[14px] font-medium text-gray-700">
            Reason for cancellation <span className="text-red-500">*</span>
          </label>

          <Select
            className="w-full"
            size="large"
            placeholder="Select a reason"
            value={reason}
            onChange={setReason}
            options={CANCEL_REASONS.map((item) => ({
              label: item,
              value: item,
            }))}
          />

          {isOther && (
            <Input.TextArea
              className="mt-2"
              rows={3}
              maxLength={250}
              placeholder="Please tell us the reason"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          )}
        </div>

        <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <InfoCircleOutlined className="mt-[2px] text-amber-500" />

          <p className="mb-0 text-[13px] text-amber-700">
            Once cancelled, this booking cannot be restored.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-[#72C0F0] bg-white font-semibold text-[#3b82b6]"
          >
            Keep Booking
          </button>

          <button
            onClick={() => onConfirm(remarks)}
            disabled={loading || !remarks}
            className="h-11 flex-1 rounded-xl bg-red-500 font-semibold text-white! transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
