"use client";

import { useEffect, useRef, useState } from "react";

const tabs = [
  "Rooms",
  "Amenities",
  "Policies",
  "Fees & Rules",
  "Location",
  "About Hotel",
];

const sectionIds = {
  Rooms: "rooms-section",
  Amenities: "amenities-section",
  Policies: "policies-section",
  "Fees & Rules": "fees-section",
  Location: "location-section",
  "About Hotel": "about-section",
};

const HotelSectionsTabs = ({ activeTab = "Rooms", setActiveTab }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const ref = useRef(null);
  const footerRef = useRef(null);
  const ignoreScroll = useRef(false);

  const [isFixed, setIsFixed] = useState(false);
  const [height, setHeight] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);

  // ------------------------------------------------------------
  // HEADER OFFSET
  // ------------------------------------------------------------

  const getHeaderOffset = () => (window.innerWidth >= 768 ? 170 : 110);

  // ------------------------------------------------------------
  // MEASURE INITIAL POSITION
  // ------------------------------------------------------------

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;

      setHeight(ref.current.offsetHeight);

      const rect = ref.current.getBoundingClientRect();

      setOffsetTop(rect.top + window.scrollY);

      footerRef.current = document.getElementById("site-footer");
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("load", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  // ------------------------------------------------------------
  // STICKY LOGIC
  // ------------------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      let shouldStick = window.scrollY >= offsetTop;

      const footer = footerRef.current;

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;

        const stickyHeight = ref.current.offsetHeight;

        const headerOffset = getHeaderOffset();

        if (footerTop <= stickyHeight + headerOffset) {
          shouldStick = false;
        }
      }

      setIsFixed(shouldStick);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleScroll);
    };
  }, [offsetTop]);

  // ------------------------------------------------------------
  // SCROLL SPY
  // ------------------------------------------------------------

  useEffect(() => {
    const handleScrollSpy = () => {
      if (ignoreScroll.current) return;

      const offset = getHeaderOffset();

      let active = currentTab;

      for (const tab of tabs) {
        const el = document.getElementById(sectionIds[tab]);

        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= offset && rect.bottom >= offset) {
          active = tab;
          break;
        }
      }

      if (active !== currentTab) {
        setCurrentTab(active);

        if (setActiveTab) {
          setActiveTab(active);
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, [currentTab, setActiveTab]);

  // ------------------------------------------------------------
  // TAB SCROLL
  // ------------------------------------------------------------

  const handleScrollTo = (tab) => {
    const el = document.getElementById(sectionIds[tab]);

    if (!el) return;

    setCurrentTab(tab);

    if (setActiveTab) {
      setActiveTab(tab);
    }

    ignoreScroll.current = true;

    // ----------------------------------------------------------
    // EXTRA OFFSET FOR ROOMS
    // ----------------------------------------------------------
    // Rooms par click karne par 40px extra upar jayega.
    // Baaki tabs ka scroll same rahega.
    // ----------------------------------------------------------

    const extraOffset = tab === "Rooms" ? 40 : 0;

    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      getHeaderOffset() -
      extraOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setTimeout(() => {
      ignoreScroll.current = false;
    }, 700);
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <>
      {/* Placeholder when tabs become fixed */}
      {isFixed && <div style={{ height }} />}

      <div
        ref={ref}
        className={`z-30 w-full border border-gray-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)] ${
          isFixed
            ? "fixed top-13.75 left-0 w-full sm:top-13.75 md:top-32.5 lg:top-32.5 xl:top-32.5"
            : "relative rounded-2xl"
        }`}
      >
        <div className="scrollbar-hide flex overflow-x-auto">
          {tabs.map((tab) => {
            const active = currentTab === tab;

            return (
              <button
                key={tab}
                onClick={() => handleScrollTo(tab)}
                className={`relative min-w-max flex-1 cursor-pointer border-none bg-transparent px-5 py-4 text-[14px] font-bold whitespace-nowrap transition-colors sm:px-6 sm:py-5 sm:text-[15px] ${
                  active
                    ? "text-(--theme-secondary)!"
                    : "text-gray-500! hover:text-(--theme-secondary)!"
                }`}
              >
                {tab}

                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.75 w-[60%] -translate-x-1/2 rounded-full bg-(--theme-secondary)" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HotelSectionsTabs;
