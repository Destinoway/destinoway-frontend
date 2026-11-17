"use client";

import dynamic from "next/dynamic";
import { useAuthModalStore } from "../store/authModal.store";

const LoginModal = dynamic(() => import("./LoginFormModal"), { ssr: false });

export default function GlobalLoginModal() {
  const { isOpen, closeLoginModal } = useAuthModalStore();

  if (!isOpen) return null;

  return (
    <LoginModal
      isOpen={isOpen}
      onClose={closeLoginModal}
      onSuccess={closeLoginModal}
    />
  );
}
