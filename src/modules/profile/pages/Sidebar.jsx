"use client";

import {
  AccountBookOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  HeartOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useLogout } from "@/modules/auth/hooks/useAuth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import LogoutModal from "../components/LogoutModal";

export default function Sidebar({ activeTab, setActiveTab, horizontal }) {
  const { data: session } = useSession();
  const { mutate: logout } = useLogout();
  const [logoutModal, setLogoutModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const user = session?.user;

  console.log("🚀 USER:", user);

  const handleLogout = () => {
    logout(session?.refreshToken);
  };

  const topMenu = [
    { key: "profile", label: "My Profile", icon: <UserOutlined /> },
    { key: "documents", label: "Documents", icon: <FileTextOutlined /> },
    { key: "wishlist", label: "Wishlist", icon: <HeartOutlined /> },
    {
      key: "BookingHistory",
      label: "Booking History",
      icon: <AccountBookOutlined />,
    },
    {
      key: "support-tickets",
      label: "Support Tickets",
      icon: <CustomerServiceOutlined />,
    },
    {
      key: "support",
      label: "Help & Support",
      icon: <CustomerServiceOutlined />,
    },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  console.log("USER IMAGE", user?.image);

  return (
    <>
      <div
        className={
          horizontal
            ? "w-full overflow-x-auto bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            : "w-full max-w-[320px] lg:w-[320px] bg-white p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        }
      >
        {/* 🔹 DESKTOP PROFILE HEADER */}
        {!horizontal && (
          <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:gap-4 lg:pb-6">
            <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center overflow-hidden rounded-full bg-[#4A9BB5] text-xl font-bold text-white">
              {user?.image && !avatarError ? (
                <Image
                  src={user.image}
                  alt="avatar"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span>{getInitials(user?.name)}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-roboto! mb-0! truncate text-center text-[16px] font-bold text-gray-700 sm:text-left sm:text-[18px]">
                {user?.name || "User"}
              </p>
              <p className="font-roboto! text-center text-[13px] font-semibold text-gray-500 sm:text-left sm:text-[14px]">
                My Account
              </p>
            </div>
          </div>
        )}

        {/* 🔹 MENU */}
        <div
          className={
            horizontal
              ? "flex min-w-max gap-2"
              : "mt-4 flex flex-col gap-2"
          }
        >
          {topMenu.map((item) => {
            const isActive = activeTab === item.key;

            return (
              <div
                key={item.key}
                onClick={() => {
                  if (item.key === "logout") {
                    setLogoutModal(true);
                    return;
                  }
                  setActiveTab(item.key);
                }}
                className={`font-roboto flex cursor-pointer items-center justify-between rounded border transition-all duration-200 ${horizontal
                  ? "whitespace-nowrap px-2 py-1"
                  : "px-3 py-3 sm:px-3 sm:py-3"
                  } ${isActive
                    ? " !border-[3px] most-boder-colour"
                    : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {/* LEFT */}
                <div
                  className={`flex items-center gap-3 ${isActive ? "most-text-color" : "text-black"
                    }`}
                >
                  {/* 🔥 PROFILE ICON → DP (ONLY in tablet) */}
                  {horizontal && item.key === "profile" ? (
                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#4A9BB5] text-xs text-white">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="avatar"
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                  ) : (
                    <span className="text-[18px] sm:text-[20px]">
                      {item.icon}
                    </span>
                  )}

                  <span className="text-[14px] font-medium sm:text-[15px] lg:text-[16px]">{item.label}</span>
                </div>

                {/* RIGHT ARROW (only desktop) */}
                {!horizontal && (
                  <span
                    className={`${isActive ? "text-[#4A9BB5]" : "text-gray-400"
                      }`}
                  >
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <LogoutModal
        open={logoutModal}
        onCancel={() => setLogoutModal(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
