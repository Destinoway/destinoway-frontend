"use client";

import BookingWebsiteLoader from "@/components/common/loder/BookingWebsiteLoader";
import styles from "@/modules/shared/home/components/styles/Hero.module.css";
import { usePathname } from "next/navigation";

export default function Loading() {
  const isHomepage = usePathname() === "/";

  return (
    <div className="min-h-screen">
      {isHomepage ? (
        <div
          className={`${styles.heroBg} bg-[#EDF7FF]`}
          role="status"
          aria-label="Loading"
        />
      ) : (
        <BookingWebsiteLoader />
      )}
    </div>
  );
}
