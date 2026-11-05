"use client";

import RoomDescription from "@/modules/hotel/components/hotels/viewhotles/RoomDescription";
import {
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";

import SectionCard from "./HotelSections/SectionCard";
import { useEffect, useRef, useState } from "react";

const AboutHotelContent = ({ content, isModalOpen, setIsModalOpen }) => {
  const [isLongContent, setIsLongContent] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return undefined;

    const observer = new ResizeObserver(() => {
      const lineHeight = parseFloat(
        window.getComputedStyle(element).lineHeight,
      );
      setIsLongContent(
        Boolean(lineHeight) && element.scrollHeight > lineHeight * 4 + 2,
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
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
          className="mt-2 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-(--theme-secondary) underline-offset-4 transition hover:underline"
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--theme-secondary)/8 text-[18px] text-(--theme-secondary)">
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
    <div className="space-y-4">
      <SectionCard
        icon={<InfoCircleOutlined />}
        title="About Hotel"
        subtitle="Property overview"
      >
        {AboutHotel ? (
          <AboutHotelContent
            content={AboutHotel}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <p className="m-0 text-sm leading-7 text-gray-500">
            No hotel description available.
          </p>
        )}
      </SectionCard>

      <SectionCard
        icon={<EnvironmentOutlined />}
        title="Hotel Address"
        subtitle="Location details"
      >
        <div className="rounded-xl border border-gray-200 bg-slate-50/70 p-4">
          <p className="m-0 text-[14px] font-semibold text-gray-800">
            {Address || "Address unavailable"}
          </p>
          {[City, State, Country].some(Boolean) && (
            <p className="m-0 mt-1 text-[13px] text-gray-500">
              {[City, State, Country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default ViewHotelInfo;
