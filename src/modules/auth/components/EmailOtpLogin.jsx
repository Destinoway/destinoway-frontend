"use client";

import AppButton from "@/components/ui/AppButton";
import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import OtpInput from "@/modules/auth/components/OtpInput";
import { useSendEmailotp } from "@/modules/auth/hooks/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { App } from "antd";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter valid email"),
  otp: z.string().optional(),
});

export default function EmailOtpLogin({ onSuccess }) {
  const { message } = App.useApp();
  const [step, setStep] = useState("email");
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const sendOtpMutation = useSendEmailotp();

  // FORM
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const email = watch("email");
  const otp = watch("otp");

  // SUBMIT
  const onSubmit = async (data) => {
    try {
      // SEND OTP
      if (step === "email") {
        await sendOtpMutation.mutateAsync({
          email: data.email,
        });
        message.success("OTP sent to email");
        setStep("otp");
        setTimer(30);
        return;
      }

      if (!data.otp || data.otp.length !== 6) {
        message.error("Enter valid OTP");
        return;
      }
      setVerifying(true);

      const res = await signIn("credentials", {
        email: data.email,
        otp: data.otp,
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
    } catch (err) {
      message.error(err?.message || "Something went wrong");
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!timer) return;
    const t = setInterval(() => {
      setTimer((p) => p - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleResend = async () => {
    try {
      await sendOtpMutation.mutateAsync({ email });
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
        {/* EMAIL */}
        {step === "email" && (
          <RHFInput name="email" label="Enter Email Address" />
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
              <p className="mt-2 text-center text-sm text-red-500">
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
          {step === "email" ? "Continue" : "Verify OTP"}
        </AppButton>
      </form>
    </FormProvider>
  );
}
