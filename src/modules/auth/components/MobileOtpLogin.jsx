"use client";

import AppButton from "@/components/ui/AppButton";
import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import OtpInput from "@/modules/auth/components/OtpInput";
import { useSendOtp } from "@/modules/auth/hooks/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  mobile: z.string().length(10, "Enter valid mobile"),
  otp: z.string().optional(),
});

export default function MobileOtpLogin({ onSuccess }) {
  const [step, setStep] = useState("mobile");
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const sendOtpMutation = useSendOtp();

  // FORM
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mobile: "",
      otp: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const mobile = watch("mobile");
  const otp = watch("otp");

  // SUBMIT
  const onSubmit = async (data) => {
    try {
      // SEND OTP
      if (step === "mobile") {
        await sendOtpMutation.mutateAsync({
          mobile: data.mobile,
        });
        message.success("OTP sent");
        setStep("otp");
        setTimer(30);
        return;
      }

      // VERIFY
      if (!data.otp || data.otp.length !== 6) {
        message.error("Enter valid OTP");
        return;
      }

      setVerifying(true);

      const res = await signIn("credentials", {
        mobile: String(data.mobile),
        otp: String(data.otp),
        redirect: false,
      });

      setVerifying(false);
      if (!res) {
        message.error("No response from server");
        return;
      }

      if (res.error) {
        message.error(res.error);
        return;
      }
      message.success("Login success");
      onSuccess?.();
    } catch {
      message.error("Something went wrong");
      setVerifying(false);
    }
  };

  // TIMER
  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => {
      setTimer((p) => p - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [timer]);

  // RESEND
  const handleResend = async () => {
    try {
      await sendOtpMutation.mutateAsync({ mobile });
      message.success("OTP resent");
      setTimer(30);
    } catch {
      message.error("Failed to resend OTP");
    }
  };

  const isLoading = sendOtpMutation.isPending || verifying;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* MOBILE */}
        {step === "mobile" && (
          <RHFInput
            name="mobile"
            label="Mobile Number"
            transform={(value) => value.replace(/\D/g, "").slice(0, 10)}
          />
        )}

        {/* OTP */}
        {step === "otp" && (
          <>
            <OtpInput
              value={otp}
              onChange={(val) =>
                setValue("otp", val, {
                  shouldValidate: true,
                })
              }
            />

            {errors.otp && (
              <p className="text-center text-sm text-red-500">
                {errors.otp.message}
              </p>
            )}

            <div className="text-center">
              {timer > 0 ? (
                <span className="text-gray-500">Resend in {timer}s</span>
              ) : (
                <span
                  className="cursor-pointer text-blue-500"
                  onClick={handleResend}
                >
                  Resend OTP
                </span>
              )}
            </div>
          </>
        )}

        <AppButton htmlType="submit" loading={isLoading}>
          {step === "mobile" ? "Continue" : "Verify OTP"}
        </AppButton>
      </form>
    </FormProvider>
  );
}
