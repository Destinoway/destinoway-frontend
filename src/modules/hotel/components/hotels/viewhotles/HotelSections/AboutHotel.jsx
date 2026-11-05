"use client";

import { BankOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

import SectionCard from "./SectionCard";

const COLLAPSED_LINES = 4;

const AboutHotel = ({ about = "" }) => {
  const contentRef = useRef(null);
  const [showFull, setShowFull] = useState(false);
  const [isLongContent, setIsLongContent] = useState(false);
  const content = typeof about === "string" ? about.trim() : "";

  // Measure whether the text exceeds the collapsed height. ResizeObserver
  // fires once on observe and again on resize, so no manual resize listener.
  useEffect(() => {
    const element = contentRef.current;
    if (!element || !content) return undefined;

    const observer = new ResizeObserver(() => {
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
      setIsLongContent(
        Boolean(lineHeight) &&
          element.scrollHeight > lineHeight * COLLAPSED_LINES + 2,
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [content]);

  const canExpand = Boolean(content) && isLongContent;
  const expanded = showFull && canExpand;

  return (
    <SectionCard
      icon={<BankOutlined />}
      title="About Hotel"
      subtitle="Property overview & stay information"
    >
      {content ? (
        <div>
          <div
            ref={contentRef}
            className={`prose prose-sm max-w-none overflow-hidden text-[14px] leading-7 text-gray-600 ${
              expanded ? "" : "line-clamp-4"
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {canExpand && (
            <button
              type="button"
              onClick={() => setShowFull((prev) => !prev)}
              className="mt-2 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-(--theme-secondary) underline-offset-4 transition hover:underline"
            >
              {expanded ? "View Less" : "View More"}
            </button>
          )}
        </div>
      ) : (
        <p className="m-0 rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
          No hotel description available for this property.
        </p>
      )}
    </SectionCard>
  );
};

export default AboutHotel;
