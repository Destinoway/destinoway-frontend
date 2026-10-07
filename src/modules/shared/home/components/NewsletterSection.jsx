
"use client";

import { useNewsletter } from "@/modules/shared/home/hooks/useNewsletter";
import { MailOutlined } from "@ant-design/icons";
import { App } from "antd";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate: subscribe, isPending } = useNewsletter();

  const { message } = App.useApp();

  // Email validation
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubscribe = () => {
    const trimmedEmail = email.trim();

    // Empty email
    if (!trimmedEmail) {
      setError("Email is required");

      message.error({
        content: "Email is required",
        key: "newsletter-validation",
        duration: 3,
      });

      return;
    }

    // Invalid email
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");

      message.error({
        content: "Please enter a valid email address",
        key: "newsletter-validation",
        duration: 3,
      });

      return;
    }

    // Clear validation error
    setError("");

    subscribe(
      {
        email: trimmedEmail,
      },
      {
        onSuccess: (res) => {
          setEmail("");
          setError("");

          message.success({
            content: res?.message || "Subscribed successfully",
            key: "newsletter-success",
            duration: 3,
          });
        },

        onError: (error) => {
          message.error({
            content:
              error?.response?.data?.message ||
              "Something went wrong. Please try again.",
            key: "newsletter-api-error",
            duration: 3,
          });
        },
      },
    );
  };

  return (
    <section className="bg-[#dce9f0] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Content */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#222] sm:h-14 sm:w-14">
              <MailOutlined className="text-2xl text-[#222]" />
            </div>

            <h2 className="text-xl leading-tight font-bold text-[#222] sm:text-2xl lg:text-3xl">
              Join Our Weekly Newsletter
            </h2>
          </div>

          {/* Right Content */}
          <div className="w-full lg:max-w-[620px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
              <div className="w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    // Remove validation error when typing
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Write Email"
                  className={`w-full flex-1 border-0 border-b bg-transparent py-3 text-[15px] transition-all outline-none placeholder:text-[#8b8b8b] ${
                    error
                      ? "border-red-500"
                      : "border-black focus:border-[#137C9C]"
                  }`}
                />

                {/* Input validation error */}
                {error && (
                  <p className="mt-2 text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isPending}
                className="flex w-[150px] items-center justify-center self-start rounded-md px-5 py-3 text-[15px] font-medium !text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px] buttion-background-color"
              >
                {isPending ? "Subscribing..." : "Subscribe Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

