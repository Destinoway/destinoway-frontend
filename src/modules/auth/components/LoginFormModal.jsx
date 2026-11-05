"use client";

import { CloseOutlined, MailOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Image from "next/image";
import { useState } from "react";

import { signIn } from "next-auth/react";
import EmailOtpLogin from "./EmailOtpLogin";
import MobileOtpLogin from "./MobileOtpLogin";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [activeView, setActiveView] = useState("mobile");
  const [resetKey, setResetKey] = useState(0);

  const handleClose = () => {
    setActiveView("mobile");
    setResetKey((prev) => prev + 1);
    onClose();
  };

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: window.location.href,
    });
    onSuccess();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width="95%"
      className="sm:max-w-140! md:max-w-175! lg:max-w-225! xl:max-w-250!"
      closable
      styles={{
        body: {
          padding: 0,
        },
      }}
      closeIcon={
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700">
          <CloseOutlined className="text-[14px]" />
        </span>
      }
    >
      <div className="flex flex-col overflow-hidden rounded-xl lg:h-150 lg:flex-row">
        {/* Left Image */}
        <div className="relative h-55 w-full sm:h-65 lg:h-full lg:w-1/2">
          <Image
            src="/images/auth/login.png"
            alt="travel"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="flex w-full flex-col justify-between px-5 py-6 sm:px-8 lg:w-1/2 lg:px-10 lg:py-8">
          <div className="flex flex-col gap-6">
            {/* Heading */}
            <div className="flex flex-col gap-2">
              <h2 className="font-roboto text-[24px] leading-tight font-semibold sm:text-[28px] lg:text-[32px]">
                Login / Sign Up
              </h2>

              <p className="font-roboto text-[13px] leading-relaxed font-medium text-gray-500 sm:text-[14px] lg:text-[15px]">
                Login or create an account to continue booking your perfect
                stay.
              </p>
            </div>

            {/* Forms */}
            <div key={resetKey} className="flex flex-col gap-4">
              {activeView === "mobile" && (
                <MobileOtpLogin onSuccess={onSuccess} />
              )}

              {activeView === "email" && (
                <div className="flex flex-col gap-4">
                  {/* Back */}
                  <button
                    onClick={() => setActiveView("mobile")}
                    // className="text-sm text-gray-500  hover:text-black text-left "
                    className="font-roboto text-left text-[14px] leading-relaxed font-medium text-gray-500"
                  >
                    ← Back to Mobile Login
                  </button>

                  <EmailOtpLogin onSuccess={onSuccess} />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex flex-col gap-4">
              <p className="text-center text-[14px] text-gray-400">
                Or Login/Sign Up with
              </p>

              {/* Social Buttons */}
              <div className="flex justify-center gap-3 sm:gap-4">
                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border transition hover:bg-gray-100 sm:h-12 sm:w-12"
                >
                  <Image
                    src="/images/google.webp"
                    alt="google"
                    width={20}
                    height={20}
                  />
                </button>

                {/* Email */}
                <button
                  onClick={() => setActiveView("email")}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border transition hover:bg-gray-100 sm:h-12 sm:w-12"
                >
                  <MailOutlined className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] text-gray-400 sm:text-xs">
            By continuing, you agree to Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </Modal>
  );
}
