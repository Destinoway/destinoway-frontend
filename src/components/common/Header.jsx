"use client";

import useIsMobile from "@/hooks/useIsMobile";
import LoginModal from "@/modules/auth/components/LoginFormModal";
import { useLogout } from "@/modules/auth/hooks/useAuth";
import { useAuthGuard } from "@/modules/auth/hooks/useAuthGuard";
import { useCurrency } from "@/modules/shared/home/hooks/useCurrency";
import { useCurrencyStore } from "@/modules/shared/store/currency.store";
import { useWishlistIds } from "@/modules/wishlist/hooks/useWishlistIds";
import {
  DownOutlined,
  HeartOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Drawer, Dropdown, Tooltip } from "antd";
import {
  Banknote,
  Bus,
  ChevronRight,
  Gift,
  Headset,
  Hotel,
  Info,
  Plane,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CurrencyDropdown from "./CurrencyDropdown";

const navigationItems = [
  {
    id: "hotels",
    label: "Hotels",
    subtitle: "Book Hotels",
    href: "/",
    icon: Hotel,
    desktop: true,
    mobile: true,
    type: "link",
  },
  {
    id: "flight",
    label: "Flight",
    subtitle: "Available Soon",
    icon: Plane,
    desktop: true,
    mobile: true,
    type: "comingSoon",
  },
  {
    id: "bus",
    label: "Bus ",
    subtitle: "Available Soon",
    icon: Bus,
    desktop: true,
    mobile: true,
    type: "comingSoon",
  },
  {
    id: "offers",
    label: "Best Offers",
    subtitle: "Special Offers",
    href: "/gift-cards",
    icon: Gift,
    desktop: true,
    mobile: true,
    type: "link",
  },
  {
    id: "about",
    label: "About Us",
    subtitle: "Know PAN Journey",
    href: "/about-us",
    icon: Info,
    desktop: true,
    mobile: false, // Drawer me nahi dikhana ho to
    type: "link",
  },
  {
    id: "support",
    label: "Support",
    subtitle: "Contact Us",
    href: "/contact-us",
    icon: Headset,
    desktop: true,
    mobile: true,
    type: "link",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [desktopCurrencyOpen, setDesktopCurrencyOpen] = useState(false);

  const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: currencies = [] } = useCurrency();
  const { data: session } = useSession();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const { selectedCurrency, setCurrency, hydrated } = useCurrencyStore();
  const { data: wishlistIdsData } = useWishlistIds();
  const wishlistCount = wishlistIdsData?.length || 0;
  const isMobile = useIsMobile();
  const user = session?.user;

  const { requireAuth } = useAuthGuard();

  const getInitials = useCallback((name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };
  const handleLogout = () => {
    logout(session?.refreshToken);
  };

  const drawerItemClass =
    "group flex cursor-pointer items-center justify-between rounded border border-gray-200 bg-white px-2 py-2 shadow-sm transition-all duration-300 hover:buttion-boder-color hover:shadow-md";

  const items = [
    {
      key: "user",
      label: (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name || "User"}</span>
          <span className="text-xs text-gray-400">
            {user?.email || user?.mobile || ""}
          </span>
        </div>
      ),
      disabled: true,
    },

    { type: "divider" },

    { key: "profile", label: <Link href="/profile">My Profile</Link> },

    {
      key: "booking",
      label: <Link href="/profile?tab=BookingHistory">My Bookings</Link>,
    },

    { type: "divider" },

    {
      key: "logout",
      label: (
        <span
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500"
        >
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  const navLinkClass =
    "relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--theme-secondary)] after:transition-all after:duration-300 header-hover-most-text-color hover:after:w-full";

  const desktopNavigationItems = navigationItems.filter((item) => item.desktop);

  const mobileNavigationItems = navigationItems.filter((item) => item.mobile);

  const currencyDropdownContent = (
    <CurrencyDropdown
      currencies={currencies}
      setCurrency={setCurrency}
      closeDropdown={() => {
        setDesktopCurrencyOpen(false);
        setMobileCurrencyOpen(false);
      }}
    />
  );

  return (
    <div className="w-full">
      {/* Navbar */}
      <header
        className={`flex justify-between bg-white shadow-sm ${
          isMobile
            ? "h-14 px-5 py-1 pt-0"
            : "h-18 px-6 py-1 pt-0 md:px-10 lg:px-8 xl:px-30 2xl:px-30"
        }`}
      >
        {/* Logo */}
        <div className={isMobile ? "" : "flex items-center justify-start"}>
          <Link href="/" className="flex items-center">
            <Image
              src="/images/LOGO-DW.png"
              alt="PAN Journey"
              width={400}
              height={970}
              priority
              unoptimized
              className={`object-contain transition-all duration-300 ${
                isMobile
                  ? "absolute top-0 left-2 h-[50px] w-[170px]"
                  : "h-[200px] w-[200px]"
              }`}
            />
          </Link>
        </div>

        <nav className="font-roboto hidden items-center justify-center gap-5 text-[13px] font-semibold text-[#051449] min-[901px]:flex min-[1100px]:gap-6 min-[1100px]:text-[13.5px] min-[1200px]:gap-7 min-[1200px]:text-[14px] min-[1400px]:gap-8 min-[1400px]:text-[19px]">
          {desktopNavigationItems.map((item) =>
            item.type === "comingSoon" ? (
              <Tooltip
                key={item.id}
                title="Coming Soon"
                color="most-text-color"
              >
                <span className={navLinkClass}>{item.label}</span>
              </Tooltip>
            ) : (
              <Link key={item.id} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Wishlist */}
          <button
            onClick={() =>
              requireAuth(() => {
                router.push("/profile?tab=wishlist");
              })
            }
            className="group teb-border-color most-text-color background-color hidden cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:text-white! md:flex"
          >
            {wishlistCount > 0 && (
              <span className="buttion-background-color group-hover:text-most-text-color ml-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white transition-colors duration-300 group-hover:bg-white">
                {wishlistCount}
              </span>
            )}
            <HeartOutlined />
            Wishlist
          </button>
          <Dropdown
            trigger={["click"]}
            open={desktopCurrencyOpen}
            onOpenChange={setDesktopCurrencyOpen}
            getPopupContainer={(trigger) => trigger.parentElement}
            popupRender={() => currencyDropdownContent}
          >
            <button className="group teb-border-color most-text-color background-color hidden cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:text-white! md:flex">
              <span>{hydrated ? selectedCurrency?.symbol : "₹"}</span>
              <span className="max-w-20 truncate">
                {hydrated ? selectedCurrency?.code : "INR"}
              </span>

              <DownOutlined />
            </button>
          </Dropdown>

          {!session ? (
            <button
              onClick={() => setOpen(true)}
              className={`buttion-background-color flex items-center rounded-lg text-white! transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                isMobile
                  ? "gap-3 px-4 py-2 text-[13px]"
                  : "gap-2 px-3 py-2 text-sm"
              }`}
            >
              <UserOutlined
                className={isMobile ? "text-[12px]" : "text-[18px]"}
              />

              {!isMobile && <span>Login</span>}
            </button>
          ) : (
            <Dropdown menu={{ items }} placement="bottomRight">
              <div className="flex cursor-pointer items-center gap-2 transition-all duration-300 hover:scale-105">
                {/* ✅ PERFECT ROUND AVATAR */}
                <div
                  className={`teb-border-color flex items-center justify-center overflow-hidden rounded-full border-2 bg-gray-100 transition-all duration-300 ${
                    isMobile ? "h-7! w-7!" : "h-9 w-9"
                  }`}
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="avatar"
                      width={isMobile ? 32 : 40}
                      height={isMobile ? 32 : 40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className={`font-semibold text-[#4A9BB5] ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>
              </div>
            </Dropdown>
          )}

          {/* Mobile Menu */}
          <button
            className="most-text-color !text-[22px] transition-all duration-300 hover:scale-110 hover:text-gray-800! min-[901px]:hidden"
            onClick={() => setMobileMenu(true)}
          >
            <MenuOutlined />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <Image
              src="/images/LOGO-DW-Symbol.png"
              alt="PAN Journey"
              width={48}
              height={48}
            />

            <div>
              <h3 className="mb-0! text-[16px] font-bold text-[#051449]">
                Destinoway
              </h3>

              <p className="text-[12px] text-gray-500">
                Explore • Book • Travel
              </p>
            </div>
          </div>
        }
        placement="right"
        size={320}
        open={mobileMenu}
        onClose={closeMobileMenu}
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-col gap-2">
            {mobileNavigationItems.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className={drawerItemClass}>
                  <div className="flex items-center justify-between!">
                    {/* Left Side */}
                    <div className="flex min-w-0 items-center gap-1">
                      {/* Icon */}
                      <div className="boder most-boder-colour flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <Icon size={20} className="most-text-color" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="mb-1! text-[15px] font-semibold text-gray-900">
                          {item.label}
                        </p>

                        <p className="mb-0! text-xs text-gray-500">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Right Side */}
                  {item.type === "comingSoon" ? (
                    <span className="most-text-color shrink-0 rounded-full bg-[#EAF7FB] px-3 py-1 text-[11px] font-medium">
                      Soon
                    </span>
                  ) : (
                    <ChevronRight
                      size={20}
                      className="most-text-color shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </div>
              );

              return item.type === "comingSoon" ? (
                <Tooltip key={item.id} title="Coming Soon" color="#0F6A75">
                  {content}
                </Tooltip>
              ) : (
                <Link key={item.id} href={item.href} onClick={closeMobileMenu}>
                  {content}
                </Link>
              );
            })}

            {/* Currency */}
            <Dropdown
              trigger={["click"]}
              open={mobileCurrencyOpen}
              onOpenChange={setMobileCurrencyOpen}
              getPopupContainer={(trigger) => trigger.parentElement}
              popupRender={() => currencyDropdownContent}
            >
              <div className={drawerItemClass}>
                <div className="flex items-center gap-1">
                  <div className="boder most-boder-colour flex h-10 w-10 items-center justify-center rounded-xl">
                    <Banknote size={20} className="most-text-color" />
                  </div>

                  <div className="flex-1">
                    <p className="mb-1! text-[15px] font-semibold text-gray-900">
                      Currency
                    </p>

                    <p className="mb-0! text-xs text-gray-500">
                      {selectedCurrency?.code}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    mobileCurrencyOpen ? "rotate-90" : ""
                  }`}
                />
              </div>
            </Dropdown>
          </div>

          {/* Footer */}
          <div className="mt-3! border-t border-gray-200 pt-6">
            <div className="rounded-2xl bg-[#F5FBFE] p-4">
              <h4 className="most-text-color text-[15px] font-semibold">
                Destinoway
              </h4>

              <p className="mt-2 text-[13px] leading-6 text-gray-500">
                Discover premium stays, exclusive hotel offers and seamless
                booking experiences across India.
              </p>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Modals */}
      <LoginModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          setShowSuccess(true);
        }}
      />
    </div>
  );
}
