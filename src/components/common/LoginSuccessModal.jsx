"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const LoginSuccessModalContent = dynamic(
  () => import("./LoginSuccessModalContent"),
  { ssr: false },
);

export default function LoginSuccessModal(props) {
  const [hasOpened, setHasOpened] = useState(props.open);

  if (props.open && !hasOpened) {
    setHasOpened(true);
  }

  return hasOpened ? <LoginSuccessModalContent {...props} /> : null;
}
