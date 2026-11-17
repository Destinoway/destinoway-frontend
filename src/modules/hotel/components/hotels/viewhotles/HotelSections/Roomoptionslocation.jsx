"use client";

import {
  AimOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CoffeeOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FireOutlined,
  HomeOutlined,
  InboxOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";

export default function Roomoptionslocation() {
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  // SHORT LIST (UI me dikhne wala)
  const amenities = [
    { icon: <CoffeeOutlined />, name: "Swimming Pool" },
    { icon: <InboxOutlined />, name: "Bar" },
    { icon: <HomeOutlined />, name: "Lounge" },
    { icon: <FireOutlined />, name: "Smoking Rooms" },
    { icon: <ThunderboltOutlined />, name: "Power Backup" },
    { icon: <InboxOutlined />, name: "Refrigerator" },
  ];

  // FULL LIST (Popup ke liye)
  const allAmenities = [
    ...amenities,
    { icon: <CoffeeOutlined />, name: "Restaurant" },
    { icon: <HomeOutlined />, name: "Parking" },
    { icon: <ThunderboltOutlined />, name: "Elevator" },
    { icon: <InboxOutlined />, name: "Room Service" },
    { icon: <CoffeeOutlined />, name: "Cafe" },
    { icon: <HomeOutlined />, name: "Reception" },
  ];
const locationSections = [
  {
    title: "Key Landmark",
    open: true,

    items: [
      {
        name: "Candolim Beach",
        type: "Tourist Attraction",
        distance: "0.7km",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
      },

      {
        name: "Candolim Beach",
        type: "Tourist Attraction",
        distance: "0.7km",
        image:
          "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=500&auto=format&fit=crop",
      },

      {
        name: "Candolim Beach",
        type: "Tourist Attraction",
        distance: "0.7km",
        image:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500&auto=format&fit=crop",
      },

      {
        name: "Candolim Beach",
        type: "Tourist Attraction",
        distance: "0.7km",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
      },
    ],
  },

  {
    title: "Attractions",
    open: false,
    items: [],
  },

  {
    title: "Transport",
    open: false,
    items: [],
  },

  {
    title: "Restaurants",
    open: false,
    items: [],
  },

  {
    title: "Other Landmark",
    open: false,
    items: [],
  },
];


  const [sections, setSections] = useState(locationSections);

  const toggleSection = (index) => {
    const updated = [...sections];

    updated[index].open = !updated[index].open;

    setSections(updated);
  };
  const [open, setOpen] = useState(false);
  const galleryImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  },
];


  const [openModal, setOpenModal] = useState(false);

  const handleOpenPopup = () => {
    setOpenModal(true);

    // YAHAN AAP LINK YA API CALL LGA SAKTE HO
    // Example:
    // router.push("/all-photos")
  };

  return (
    <>
    <div className=" p-6">

      {/* ================= AMENITIES ================= */}
      <div className="bg-white rounded-lg p-6 mb-6 max-w-6.5xl!">
        <h2 className="text-[20px] font-bold text-[#2d4b3f] mb-5">
          Amenities
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6">
          {amenities.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#2d4b3f] text-[14px]">
              <span className="text-[18px]">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* VIEW ALL */}
        <p
          onClick={() => setAmenitiesOpen(true)}
          className="mt-6 text-[#2a7de1] text-[14px] border-b border-dotted w-fit cursor-pointer"
        >
          View All Amenities
        </p>
      </div>

      {/* ================= FOOD & DINING ================= */}
      <div className="bg-white  p-6">
        <h2 className="text-[20px] font-bold text-[#333] mb-4">
          Food & Dining
        </h2>

        <div className="border-t pt-4">

          {/* TOP HIGHLIGHT */}
          <div className="bg-[#e6d5b3] text-center py-3 font-semibold text-[#444] rounded">
            Room dining available at the Property (undefined)
          </div>

          {/* ROW 1 */}
          <div className="flex flex-col md:flex-row justify-between mt-6 gap-6">

            <div className="flex items-center gap-3 text-gray-700">
              <CoffeeOutlined className="text-[22px] text-blue-400" />
              <span>Food will be served in the room</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <span className="w-5 h-5 border-2 border-green-500 flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              </span>
              <span>Vegetarian food Available</span>
            </div>

          </div>

          {/* ROW 2 */}
          <div className="flex flex-col md:flex-row justify-between mt-6 gap-6">

            <div className="flex items-center gap-3 text-gray-700">
              <span className="w-5 h-5 border-2 border-red-500 flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </span>
              <span>Non-Vegetarian food Available</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <DollarOutlined className="text-[22px] text-blue-400" />
              <span>Average meal cost for 1: ₹ 400</span>
            </div>

          </div>

          {/* TIMING */}
          <div className="border-t mt-6 pt-4 flex items-center gap-3 text-[#444] font-medium">
            <ClockCircleOutlined className="text-yellow-500 text-[20px]" />
            <span>
              Breakfast 07:30 AM - 10:30 AM | Lunch 12:30 PM - 04:00 PM | Dinner 07:00 PM - 11:00 PM
            </span>
          </div>

        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        open={amenitiesOpen}
        onCancel={() => setAmenitiesOpen(false)}
        footer={null}
        title="All Amenities"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allAmenities.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-700">
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </Modal>
      <div className="w-full bg-white  p-3 md:p-5 mt-5">
      {/* TOP HEADING */}
      <div className="mb-5">
        <h2 className="text-[24px] md:text-[32px] font-bold text-[#333]">
          Location
        </h2>

        <div className="flex items-center gap-2 mt-2 text-[#555] text-sm md:text-base">
          <EnvironmentOutlined />

          <span>Location rated 4.3 by guests</span>
        </div>
      </div>

      {/* REVIEW BOX */}
      <div className="bg-white border border-[#ddd] rounded-2xl p-4 md:p-6 mb-5">
        <h3 className="text-[22px] md:text-[34px] font-bold text-[#333] mb-3">
          What guests said
        </h3>

        <p className="text-[#555] leading-7 text-sm md:text-[17px]">
          Guests highly praise the property&apos;s location, admiring its proximity
          to Candolim Beach and local attractions. Many noted that the area
          remains peaceful while being conveniently close to bustling markets
          and dining options.
        </p>
      </div>

      {/* MAP + RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* MAP */}
        <div className="overflow-hidden rounded-2xl border border-[#ddd] h-87.5 md:h-137.5">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Candolim%20Beach&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full"
            loading="lazy"
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white border border-[#ddd] rounded-2xl overflow-hidden h-fit">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border-b border-[#e5e5e5] last:border-none"
            >
              {/* HEADER */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#fafafa] transition"
              >
                <div className="flex items-center gap-3">
                  <EnvironmentOutlined className="text-[18px] text-[#444]" />

                  <span className="text-[16px] md:text-[18px] font-semibold text-[#333]">
                    {section.title}
                  </span>
                </div>

                {section.open ? (
                  <CaretUpOutlined className="text-[14px]" />
                ) : (
                  <CaretDownOutlined className="text-[14px]" />
                )}
              </button>

              {/* OPEN CONTENT */}
              {section.open && (
                <div className="px-3 pb-3">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-3 border-b border-[#f0f0f0] last:border-none"
                    >
                      {/* CHECKBOX */}
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500"
                      />

                      {/* IMAGE */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18.75 h-18.75 rounded-xl object-cover"
                      />

                      {/* TEXT */}
                      <div className="flex-1 min-w-0">
                        <span className="bg-[#eaf2ff] text-[#4d8dff] text-[10px] px-2 py-0.5 rounded-md">
                          Popular
                        </span>

                        <h4 className="text-[15px] md:text-[17px] font-semibold text-[#333] truncate mt-1">
                          {item.name}
                        </h4>

                        <p className="text-[#777] text-xs md:text-sm">
                          {item.type}
                        </p>
                      </div>

                      {/* DISTANCE */}
                      <div className="flex flex-col items-end gap-1">
                        <AimOutlined className="text-[#4d8dff] text-[15px]" />

                        <span className="text-[#444] text-xs md:text-sm">
                          {item.distance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
       <div className="bg-white mt-5 p-8">
        {/* Heading */}
        <h2 className="text-[32px] font-bold text-[#333] mb-6">
          Property Rules
        </h2>

        {/* Check In Out */}
        <div className="flex gap-12 text-[16px] font-semibold text-[#444] ">
          <p>
            Check-in: <span className="font-bold">1 PM</span>
          </p>

          <p>
            Check-out: <span className="font-bold">11 AM</span>
          </p>
        </div>

        <div className="border-t border-[#d9d9d9] pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-[-23]">
            
            {/* DO'S */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <CheckOutlined className="text-[#22c55e]! text-[22px]" />

                <h3 className="text-[18px] font-bold text-[#333]">
                  DO’s
                </h3>
              </div>

              <ul className="list-disc pl-6 space-y-5 text-[14px] leading-3.5 text-[#444]">
                <li>
                  Unmarried couples/guests with Local IDs are allowed.
                  (Couple Friendly)
                </li>

                <li>
                  Primary Guest should be atleast 18 years of age.
                </li>

                <li>
                  Passport, Aadhaar, Driving License and Govt. ID are accepted
                  as ID proof(s)
                </li>
              </ul>
            </div>

            {/* DON'TS */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <CloseOutlined className="text-red-500! text-[18px]" />

                <h3 className="text-[18px] font-bold text-[#333]">
                  Don’t s
                </h3>
              </div>

              <ul className="list-disc pl-6 space-y-5 text-[14px] leading-3.5 text-[#444]">
                <li>Pets are not allowed</li>

                <li>Outside food is not allowed</li>

                <li>Smoking within the premises is not allowed</li>
              </ul>
            </div>
          </div>

          {/* Read More Button */}
          <button
            onClick={() => setOpen(true)}
            className="mt-10 text-[#3ba7ff]! text-[20px] font-semibold border-b border-dashed border-[#3ba7ff] hover:text-blue-700 transition"
          >
            Read All Property Rules
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="p-4">
          <h2 className="text-[30px] font-bold mb-6">
            All Property Rules
          </h2>

          <div className="space-y-4 text-[17px] leading-8 text-[#444]">
            <p>✔ Couples are welcome</p>

            <p>✔ Guests should carry valid ID proof</p>

            <p>✔ Check-in time is 1 PM</p>

            <p>✔ Check-out time is 11 AM</p>

            <p>✖ Smoking is not allowed inside the property</p>

            <p>✖ Outside food is not allowed</p>

            <p>✖ Pets are not allowed</p>
          </div>
        </div>
      </Modal>

    </div>
     <div className="w-full bg-white  p-4 md:p-6 mb-6">
      {/* HEADING */}
      <h2 className="text-[24px] md:text-[28px] font-bold text-[#2b2b2b] mb-5">
        Photos by Guests
      </h2>

      {/* IMAGES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {galleryImages.map((item, index) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl h-35 md:h-43.75 group cursor-pointer"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt="hotel"
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />

            {/* LAST IMAGE OVERLAY */}
            {index === 4 && (
              <div
                onClick={handleOpenPopup}
                className="absolute inset-0 bg-black/45 flex items-center justify-center cursor-pointer"
              >
                <h3 className="text-white text-[22px] md:text-[32px] font-bold text-center leading-tight">
                  +700 Guest Photos
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* POPUP */}
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={false}
        centered
        width={700}
      >
        <div className="py-10 text-center">
          <h2 className="text-[28px] font-bold text-[#2b2b2b] mb-3">
            All Guest Photos
          </h2>

          <p className="text-[#666] text-[16px] leading-7">
            Yahan aap apna custom gallery page, slider, API ya external link
            connect kar sakte ho.
          </p>

          {/* BUTTON */}
          <button
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl text-[15px] font-semibold hover:opacity-90 transition-all"
            onClick={() => {
              // YAHAN LINK LGAO
              // Example:
              // window.open("/gallery")
            }}
          >
            Open Gallery
          </button>
        </div>
      </Modal>
    </div>
    </>
  );
}