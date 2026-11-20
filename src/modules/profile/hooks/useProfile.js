import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfileApi,
  sendEmailOtpApi,
  sendMobileOtpApi,
  updateProfileApi,
  verifyEmailApi,
  verifyMobileApi,
} from "../api/profile.api";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getProfileApi();

      if (!res?.data?.data) {
        throw new Error("Profile data missing");
      }

      return res.data.data; 
    },
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => qc.invalidateQueries(["profile"]),
  });
};

export const useSendEmailOtp = () =>
  useMutation({ mutationFn: sendEmailOtpApi });

export const useVerifyEmail = () => useMutation({ mutationFn: verifyEmailApi });

export const useSendMobileOtp = () =>
  useMutation({ mutationFn: sendMobileOtpApi });

export const useVerifyMobile = () =>
  useMutation({ mutationFn: verifyMobileApi });
