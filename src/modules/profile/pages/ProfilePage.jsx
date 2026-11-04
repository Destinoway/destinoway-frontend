"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import ProfileOverview from "../components/ ProfileOverview";
import BookingDetailsTab from "../components/bookings/BookingDetailsTab";
import BookingHistoryTab from "../components/bookings/BookingHistoryTab";
import DocumentsTab from "../components/DocumentsTab";
import HelpSupportPage from "../components/HelpSupportPage";
import SupportTicketsTab from "../components/support-tickets/pages/SupportTicketsTab";
import WishlistDetailTab from "../components/wishlist/WishlistDetailTab";
import WishlistTab from "../components/wishlist/WishlistTab";
import Sidebar from "./Sidebar";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeTab = searchParams.get("tab") || "profile";
  const bookingRefNo = searchParams.get("bookingRefNo");

  const handleTabChange = (tab) => {
    router.push(`/profile?tab=${tab}`);
  };

  return (
    <div className="background-color-bg min-h-screen overflow-x-hidden">
      {/* Banner */}
      <div className="relative h-[180px] w-full overflow-hidden sm:h-[200px] md:h-[220px]">
        <img
          src="/images/profile-bg.webp"
          alt="background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
        <h2 className="most-text-color text-lg font-semibold">My Account</h2>

        <Button
          type="text"
          icon={<MenuOutlined className="text-xl" />}
          onClick={() => setDrawerOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{
          body: {
            padding: 0,
          },
          wrapper: {
            width: 320,
          },
        }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            handleTabChange(tab);
            setDrawerOpen(false);
          }}
        />
      </Drawer>

      {/* Main Section */}
      <div className="relative mx-auto mt-8 max-w-[1300px] px-1 pb-10 sm:-mt-6 sm:px-4 md:-mt-12 md:px-1 md:pb-12 lg:px-6">
        {/* Tablet Sidebar */}
        <div className="mb-5 hidden overflow-x-auto md:block lg:hidden">
          <div className="flex min-w-max gap-3">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              horizontal
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-2 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-2">
          {/* Desktop Sidebar */}
          <div className="sticky top-5 hidden self-start lg:block">
            <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>

          {/* Content */}
          <div className="min-w-0">
            {activeTab === "profile" && <ProfileOverview />}

            {activeTab === "documents" && <DocumentsTab />}

            {activeTab === "wishlist" && <WishlistTab />}

            {activeTab === "wishlist-detail" && <WishlistDetailTab />}

            {activeTab === "BookingHistory" && <BookingHistoryTab />}

            {activeTab === "booking-details" && (
              <BookingDetailsTab bookingRefNo={bookingRefNo} />
            )}

            {activeTab === "settings" && (
              <div className="rounded-2xl bg-white p-4 shadow-[1px_4px_4px_4px_#00000014] sm:p-5 md:p-6">
                <p className="text-sm text-gray-700 sm:text-base">
                  Settings coming soon...
                </p>
              </div>
            )}

            {activeTab === "support" && <HelpSupportPage />}

            {activeTab === "support-tickets" && <SupportTicketsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
