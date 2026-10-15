"use client";

import RoomDescription from "@/modules/hotel/components/hotels/viewhotles/RoomDescription";
import {
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";

const AboutHotelContent = ({ content, isModalOpen, setIsModalOpen }) => {
  const [isLongContent, setIsLongContent] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkContentHeight = () => {
      const element = contentRef.current;

      if (!element) return;

      const lineHeight = parseFloat(
        window.getComputedStyle(element).lineHeight,
      );
      const maxHeight = lineHeight * 4;

      setIsLongContent(element.scrollHeight > maxHeight + 2);
    };

    checkContentHeight();
    window.addEventListener("resize", checkContentHeight);

    return () => window.removeEventListener("resize", checkContentHeight);
  }, [content]);

  return (
    <>
      <RoomDescription
        html={content}
        contentRef={contentRef}
        className="prose prose-sm line-clamp-4 max-w-none overflow-hidden leading-7 text-gray-600"
      />

      {isLongContent && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="most-text-color mt-2 cursor-pointer text-sm font-semibold underline transition"
        >
          View More
        </button>
      )}

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={800}
        closeIcon={
          <CloseOutlined className="text-gray-500 hover:text-gray-800" />
        }
        title={
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="most-text-color most-boder-colour flex h-10 w-10 items-center justify-center rounded border">
              <InfoCircleOutlined />
            </div>

            <div>
              <h2 className="m-0 text-lg font-bold text-gray-800">
                About Hotel
              </h2>
              <p className="m-0 text-sm font-medium text-gray-500">
                Complete property overview
              </p>
            </div>
          </div>
        }
        styles={{
          body: {
            paddingTop: 20,
            maxHeight: "70vh",
            overflowY: "auto",
          },
        }}
      >
        <RoomDescription
          html={content}
          className="prose prose-sm max-w-none leading-7 text-gray-600"
        />
      </Modal>
    </>
  );
};

const ViewHotelInfo = ({ supplierData = {} }) => {
  const { AboutHotel, Address, City, State, Country } = supplierData;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {/* ================= ABOUT HOTEL ================= */}
        <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="most-boder-colour most-text-colour flex h-10 w-10 items-center justify-center rounded border">
              <InfoCircleOutlined />
            </div>

            <div>
              <h2 className="mb-0 text-[17px] font-bold text-gray-800">
                About Hotel
              </h2>

              <p className="text-sm font-semibold text-gray-500">
                Property overview
              </p>
            </div>
          </div>

          {AboutHotel ? (
            <AboutHotelContent
              content={AboutHotel}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <p className="leading-7 text-gray-600">
              No hotel description available.
            </p>
          )}
        </div>

        {/* ================= HOTEL ADDRESS ================= */}
        <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="most-boder-colour most-text-color flex h-10 w-10 items-center justify-center rounded border">
              <EnvironmentOutlined />
            </div>

            <div>
              <h2 className="mb-0 text-[17px] font-bold text-gray-800">
                Hotel Address
              </h2>

              <p className="text-sm font-semibold text-gray-500">
                Location details
              </p>
            </div>
          </div>

          <div className="rounded bg-[#f8fbfd] p-3">
            <p className="font-semibold text-gray-700">
              {Address || "Address unavailable"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {[City, State, Country].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHotelInfo;
