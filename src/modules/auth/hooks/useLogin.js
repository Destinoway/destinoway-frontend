import { useMutation } from "@tanstack/react-query";
import {
  sendEmailOtpApi,
  verifyOtpApi,
  sendOtpApi,
} from "../api/auth.api";

// ✅ MOBILE OTP (optional)
export const useSendOtp = () =>
  useMutation({
    mutationFn: sendOtpApi,
  });

// ✅ EMAIL OTP
export const useSendEmailotp = () =>
  useMutation({
    mutationFn: (data) => {
      return sendEmailOtpApi(data); // ✅ NO WRAP
    },
  });

// ✅ VERIFY OTP
export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (data) => {
      return verifyOtpApi(data); // ✅ NO WRAP
    },
  });
