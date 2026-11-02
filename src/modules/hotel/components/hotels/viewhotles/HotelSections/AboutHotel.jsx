"use client";
import { BankOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
const AboutHotel = ({ about = "" }) => {
  const contentRef = useRef(null);
  const [showFull, setShowFull] = useState(false);
  const [isLongContent, setIsLongContent] = useState(false);
  const content = typeof about === "string" ? about.trim() : "";
  useEffect(() => {
    const checkContentHeight = () => {
      const element = contentRef.current;
      if (!element || !content) {
        setIsLongContent(false);
        return;
      }
      const styles = window.getComputedStyle(element);
      const lineHeight = parseFloat(styles.lineHeight);
      if (!lineHeight || Number.isNaN(lineHeight)) {
        setIsLongContent(false);
        return;
      }
      const maxHeight = lineHeight * 4;
      setIsLongContent(element.scrollHeight > maxHeight + 2);
    };
    checkContentHeight();
    window.addEventListener("resize", checkContentHeight);
    return () => {
      window.removeEventListener("resize", checkContentHeight);
    };
  }, [content]);
  useEffect(() => {
    if (!isLongContent) {
      setShowFull(false);
    }
  }, [isLongContent]);
  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-[#e9f2f8] bg-[#f7fcff] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="most-boder-colour most-text-color flex h-11 w-11 items-center justify-center rounded">
            <BankOutlined className="text-[18px]" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800">
              About Hotel
            </h2>
            <p className="mt-1 leading-7 text-gray-500">
              Property overview & stay information
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="rounded-xl border border-gray-300 p-4">
          <div className="most-text-color mb-3 flex items-center gap-2">
            <InfoCircleOutlined />
            <span className="!text-[15px] font-medium">Hotel Information</span>
          </div>
          {content ? (
            <div>
              <div
                ref={contentRef}
                className={`prose prose-sm max-w-none overflow-hidden leading-7 text-gray-600 ${showFull ? "" : "line-clamp-4"}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {isLongContent && (
                <button
                  type="button"
                  onClick={() => setShowFull((prev) => !prev)}
                  className="mt-1! cursor-pointer text-sm font-semibold text-[#0ea5e9]! underline transition hover:text-[#0284c7]!"
                >
                  {showFull ? "View Less" : "View More"}
                </button>
              )}
            </div>
          ) : (
            <p className="leading-7 text-gray-500">
              No hotel description available for this property.
            </p>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#eef8fd] px-3 py-1 text-xs text-[#0ea5e9]">
            Property Overview
          </span>
          <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs text-gray-500">
            Stay Details
          </span>
          <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs text-gray-500">
            Guest Information
          </span>
        </div>
      </div>
    </div>
  );
};
export default AboutHotel;
