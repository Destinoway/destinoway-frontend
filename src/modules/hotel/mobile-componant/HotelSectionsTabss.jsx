"use client";

import { useEffect, useRef, useState } from "react";

const tabs = [
  "Amenities",
  "Policies",
  "Fees & Rules",
  "Location",
  "About Hotel",
];

const sectionIds = {
  Amenities: "amenities-section",
  Policies: "policies-section",
  "Fees & Rules": "fees-section",
  Location: "location-section",
  "About Hotel": "about-section",
};

const HotelSectionsTabss = ({ activeTab = "Amenities", setActiveTab }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const ref = useRef(null);
  const footerRef = useRef(null);
  const ignoreScroll = useRef(false);

  const [isFixed, setIsFixed] = useState(false);
  const [height, setHeight] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);

  // measure position
  useEffect(() => {
    const update = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);

        const rect = ref.current.getBoundingClientRect();

        setOffsetTop(rect.top + window.scrollY);
      }

      footerRef.current = document.getElementById("site-footer");
    };

    update();

    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  // sticky logic
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const footer = footerRef.current;

      let shouldStick = window.scrollY >= offsetTop;

      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;

        const stickyHeight = ref.current.offsetHeight;

        const headerOffset = window.innerWidth >= 768 ? 100 : 55;

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
  // scroll spy
  // scroll spy
  useEffect(() => {
    const handleScrollSpy = () => {
      if (ignoreScroll.current) return;

      const headerOffset = window.innerWidth >= 768 ? 180 : 120;
      const scrollY = window.scrollY + headerOffset;

      let active = tabs[0];

      tabs.forEach((tab) => {
        const el = document.getElementById(sectionIds[tab]);
        if (!el) return;

        if (scrollY >= el.offsetTop) {
          active = tab;
        }
      });

      if (active !== currentTab) {
        setCurrentTab(active);
        setActiveTab?.(active);
      }
    };

    handleScrollSpy();

    window.addEventListener("scroll", handleScrollSpy, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
    };
  }, [currentTab, setActiveTab]);

  const handleScrollTo = (tab) => {
    setCurrentTab(tab);
    if (setActiveTab) setActiveTab(tab);

    const el = document.getElementById(sectionIds[tab]);

    if (el) {
      ignoreScroll.current = true;

      const headerOffset = window.innerWidth >= 768 ? 180 : 120;

      window.scrollTo({
        top: el.offsetTop - headerOffset,
        behavior: "smooth",
      });

      setTimeout(() => {
        ignoreScroll.current = false;
      }, 800);
    }
  };

  return (
    <>
      {/* prevent layout jump */}
      {isFixed && <div style={{ height }} />}

      <div
        ref={ref}
        className={`z-[8] w-full border border-gray-200 bg-white text-[#0ea5e9] shadow-[0_8px_20px_rgba(14,165,233,0.25)] ${
          isFixed
            ? "!lg:top-[55px] fixed top-[55px] left-0 w-full sm:top-[55px]  xl:top-[55px]"
            : "relative"
        }`}
      >
        <div className="scrollbar-hide flex overflow-x-auto">
          {tabs.map((tab) => {
            const active = currentTab === tab;

            return (
              <button
                key={tab}
                onClick={() => handleScrollTo(tab)}
                className={`font-roboto relative min-w-max flex-1 px-6 py-5 text-[15px] font-bold whitespace-nowrap transition ${
                  active
                    ? "teb-text-color"
                    : "hover:teb-text-color !text-gray-900"
                }`}
              >
                
                {tab}

                {active && (
                  <span className="teb-boder-colour absolute bottom-0 left-0 h-[3px] w-full rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HotelSectionsTabss;
