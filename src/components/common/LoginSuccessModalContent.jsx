"use client";

import { Button, Modal } from "antd";
import Image from "next/image";

export default function LoginSuccessModalContent({
  open,
  onClose,
  onProfile,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={720}
      mask={{ closable: false }}
      styles={{ body: { padding: "40px 32px" } }}
    >
      <div className="flex flex-col items-center text-center">
        {/* ICON */}
        <Image
          src="/images/loginSuccsess-icon.svg"
          alt="success"
          width={200}
          height={200}
          className="mb-4"
          priority
        />

        {/* TITLE */}
        <h2 className="font-roboto mb-3 text-center text-[32px] leading-tight font-bold">
          Logged In Successfully
        </h2>

        {/* DESCRIPTION */}
        <p className="font-roboto max-w-[520px] text-[18px] leading-[150%] font-medium text-gray-500">
          Your account is ready to go. Complete your profile for a faster and
          more personalized booking experience.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex w-full justify-center gap-4">
          {/* PRIMARY */}
          <Button
            size="large"
            onClick={onProfile}
            className="h-[44px] rounded-lg px-10 font-medium text-white!"
            style={{
              background: "buttion-background-color",
              border: "none",
            }}
          >
            Set Up Profile
          </Button>

          {/* SECONDARY */}
          <Button
            size="large"
            loading={loading}
            onClick={onClose}
            className="h-[44px] rounded-lg border border-[#0F6A75] px-6 font-medium text-[#0F6A75] hover:bg-[#0F6A75]/5"
          >
            Continue Browsing
          </Button>
        </div>
      </div>
    </Modal>
  );
}
