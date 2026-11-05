"use client";

import LoginSuccessModal from "@/components/common/LoginSuccessModal";
import { useUpdateProfile } from "@/modules/profile/hooks/useProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function ProfileCompletionHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [closed, setClosed] = useState(false);
  // UPDATE PROFILE
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // CHECK POPUP
  const shouldShow =
    status === "authenticated" &&
    session?.user?.profileCompleted === false &&
    session?.user?.profilePopupDismissed === false;
  const open = shouldShow && !closed;

  // CONTINUE BROWSING
  const handleClose = () => {
    updateProfile(
      {
        profilePopupDismissed: true,
      },
      {
        onSuccess: () => {
          setClosed(true);
        },
      },
    );
  };

  // PROFILE
  const handleProfile = () => {
    setClosed(true);

    router.push("/profile");
  };

  return (
    <LoginSuccessModal
      open={open}
      onClose={handleClose}
      onProfile={handleProfile}
      loading={isPending}
    />
  );
}
