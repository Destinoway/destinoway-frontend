"use client";

import { LogoutOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

export default function LogoutModal({
  open,
  onCancel,
  onLogout,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onCancel}
      centered
      width={430}
      closable={false}
      destroyOnHidden
      className="logout-modal"
      styles={{
        body: {
          padding: 0,
        },
        content: {
          padding: 0,
          overflow: "hidden",
          borderRadius: "28px",
        },
      }}
    >
      <div className="relative overflow-hidden bg-white">
        {/* TOP DESIGN */}
        <div className="absolute top-0 left-0 h-30 w-full bg-linear-to-r buttion-background-color" />

        {/* CONTENT */}
        <div className="relative z-10 px-7 pt-8 pb-7">
          {/* ICON */}
          <div className="mx-auto mb-5 flex h-22 w-22 items-center justify-center rounded-full border-[6px] border-white bg-[#e8f7fc] shadow-lg">
            <LogoutOutlined className="text-[34px] most-text-color" />
          </div>

          {/* TITLE */}
          <h2 className="mb-2 text-center text-[28px] font-bold text-gray-900">
            Logout
          </h2>

          {/* SUBTITLE */}
          <p className="mx-auto mb-8 max-w-[320px] text-center text-[15px] leading-6.5 text-gray-500">
            Are you sure you want to logout from your account? You’ll need to
            login again to continue your booking journey.
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* CANCEL */}
            <Button
              size="large"
              onClick={onCancel}
              className="h-13! flex-1! rounded-xl! border-gray-300! bg-white! text-[15px]! font-semibold! text-gray-700! shadow-none! hover:border-[#4A9BB5]! hover:text-[#4A9BB5]!"
            >
              Cancel
            </Button>

            {/* LOGOUT */}
            <Button
              size="large"
              type="primary"
              loading={loading}
              onClick={async () => {
                await onLogout();
                onCancel();
              }}
              className="h-13! flex-1! rounded-xl! border-0!  text-[15px]! font-semibold! shadow-none! buttion-background-color"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
