"use client";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useMemo, useState } from "react";
const ViewHotelModal = ({ open, onClose, images = [] }) => {
  const galleryImages = Array.isArray(images) ? images : [];
  const [active, setActive] = useState("All");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const normalizedImages = useMemo(() => {
    return galleryImages
      .map((img) => {
        if (typeof img === "string") {
          return { url: img, description: "Hotel Photo" };
        }
        if (img && typeof img === "object") {
          return {
            url: img?.url || img?.ImageURL || img?.image || img?.src || "",
            description:
              img?.description || img?.ImageDesc || img?.name || "Hotel Photo",
          };
        }
        return { url: "", description: "Hotel Photo" };
      })
      .filter((img) => img.url);
  }, [galleryImages]);
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        normalizedImages.map((img) => img?.description).filter(Boolean),
      ),
    ];
    return ["All", ...uniqueCategories];
  }, [normalizedImages]);
  const filteredImages = useMemo(() => {
    if (active === "All") {
      return normalizedImages;
    }
    return normalizedImages.filter((img) => img?.description === active);
  }, [normalizedImages, active]);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setPreviewOpen(false);
      setCurrentIndex(0);
    }
  }
  const selectCategory = (category) => {
    setActive(category);
    setCurrentIndex(0);
  };
  const handlePrev = () => {
    if (filteredImages.length <= 1) {
      return;
    }
    setCurrentIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1,
    );
  };
  const handleNext = () => {
    if (filteredImages.length <= 1) {
      return;
    }
    setCurrentIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1,
    );
  };
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setPreviewOpen(true);
  };
  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={1100}
        centered
        destroyOnHidden
        closable={false}
        styles={{
          body: {
            padding: 24,
            maxHeight: "85vh",
            overflowY: "auto",
            background: "#f5f5f5",
          },
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <CloseOutlined />
        </button>
        <div className="space-y-6">
          <div className="sticky -top-6 z-20 -mx-6 flex justify-between border-b bg-white px-6">
            <div className="scrollbar-hide mb-2 flex overflow-x-auto">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`border-b-2 px-8 py-2 text-[15px] font-semibold whitespace-nowrap transition-all ${active === category ? "border-[#64b5f6] text-[#64b5f6]" : "border-transparent text-[#222]"}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-2 shrink-0 text-center font-semibold text-gray-500">
              {filteredImages.length} Photos
            </div>
          </div>
          <div className="rounded-md bg-[#efefef] p-4">
            <h3 className="mb-5 text-[18px] font-semibold text-[#333]">
              {active === "All" ? "All Photos" : active}
            </h3>
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredImages.map((img, index) => (
                  <div
                    key={`${img.url}-${index}`}
                    className="cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={img.url}
                      alt={img.description}
                      className="h-77.5 w-full rounded-xl object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
                No photos available
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        closable={false}
        width="100%"
        style={{ top: 20, maxWidth: "90vw", paddingBottom: 0 }}
        styles={{
          body: { padding: 0, background: "#000" },
          content: {
            padding: 24,
            background: "#000",
            borderRadius: 24,
            boxShadow: "none",
          },
          mask: { background: "rgba(0,0,0,0.9)" },
        }}
        className="mmt-gallery-modal"
      >
        <div className="relative h-[90vh]">
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            className="absolute top-0 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black"
          >
            <CloseOutlined />
          </button>
          {filteredImages[currentIndex] && (
            <img
              src={filteredImages[currentIndex].url}
              alt={filteredImages[currentIndex].description}
              className="h-[90vh] w-full object-contain"
            />
          )}
          {filteredImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute top-1/2 left-6 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <LeftOutlined />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 right-6 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <RightOutlined />
              </button>
            </>
          )}
          <div className="absolute top-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/70 px-5 py-2 text-sm text-white">
            {filteredImages.length ? currentIndex + 1 : 0} /
            {filteredImages.length}
          </div>
          {filteredImages.length > 0 && (
            <div className="absolute bottom-0 left-0 z-30 flex w-full gap-3 overflow-x-auto bg-black/80 p-4">
              {filteredImages.map((img, index) => (
                <img
                  key={`${img.url}-thumb-${index}`}
                  src={img.url}
                  alt={img.description}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-20 w-32 shrink-0 cursor-pointer rounded-md object-cover transition ${currentIndex === index ? "border-2 border-white opacity-100" : "opacity-60 hover:opacity-100"}`}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
export default ViewHotelModal;
