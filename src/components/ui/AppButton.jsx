"use client";

import { Button } from "antd";

export default function AppButton({
  children,
  loading,
  htmlType = "button",
  onClick,
}) {
  return (
    <Button
      htmlType={htmlType}
      loading={loading}
      onClick={onClick}
      className="w-full h-11.25! rounded-lg! text-white! buttion-background-color "
      style={{
       border: "none",
      }}
    >
      {children}
    </Button>
  );
}
