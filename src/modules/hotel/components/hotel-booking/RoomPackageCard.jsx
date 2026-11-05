"use client";

import RoomDescription from "@/modules/hotel/components/hotels/viewhotles/RoomDescription";
import SectionCard from "@/modules/hotel/components/hotels/viewhotles/HotelSections/SectionCard";
import {
  CheckCircleFilled,
  CheckOutlined,
  CreditCardOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const formatDetail = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value.map(formatDetail).filter(Boolean).join(", ");
  }
  return String(
    value?.description ||
      value?.name ||
      value?.title ||
      value?.text ||
      value?.value ||
      value?.reason ||
      "",
  );
};

const SubHeading = ({ children }) => (
  <p className="m-0 mb-2 text-[11px] font-bold tracking-[0.08em] text-gray-500 uppercase">
    {children}
  </p>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-200 bg-slate-50 px-3 py-1.5 text-[12px] font-medium text-gray-700">
    {children}
  </span>
);

export default function RoomPackageCard({ bookingData }) {
  const room = Array.isArray(bookingData?.rooms)
    ? bookingData.rooms[0] || bookingData?.selectedRoom || {}
    : bookingData?.rooms || bookingData?.selectedRoom || {};
  const boardBasis =
    room?.boardBasis || room?.inclusion || room?.Inclusion || "";
  const beds = Array.isArray(room?.beds) ? room.beds : [];
  const facilities = Array.isArray(room?.facilities) ? room.facilities : [];
  const cancellationPolicy = formatDetail(
    room?.policy?.outPolicyReason || room?.cancellationPolicy || room?.policies,
  );
  const refundable = room?.refundable ?? bookingData?.refundable;
  const payment = room?.payment || {};
  const isPANRequired =
    bookingData?.isPANRequired === true || room?.isPANRequired === true;
  const occupancies = Array.isArray(room?.occupancies) ? room.occupancies : [];
  const hasRoomCount =
    room?.roomCount !== null &&
    room?.roomCount !== undefined &&
    room?.roomCount !== "";

  const roomFacts = [
    ["Rooms", hasRoomCount ? room.roomCount : ""],
    ["Area", room?.area],
    ["View", room?.views],
    ["Room type", room?.type],
    ["Max guests", room?.maxGuestAllowed],
    ["Max adults", room?.maxAdultAllowed],
    ["Max children", room?.maxChildrenAllowed],
    [
      "Smoking",
      typeof room?.smokingAllowed === "boolean"
        ? room.smokingAllowed
          ? "Allowed"
          : "Not allowed"
        : "",
    ],
  ]
    .map(([label, value]) => [label, formatDetail(value)])
    .filter(([, value]) => value);

  const refundLabel = cancellationPolicy
    ? "Free Cancellation"
    : refundable === null || refundable === undefined
      ? ""
      : refundable
        ? "Refundable"
        : "Non-refundable";

  const facilityNames = facilities
    .map((facility) =>
      typeof facility === "string"
        ? facility
        : facility?.name || facility?.description || "",
    )
    .filter(Boolean);

  const paymentNotes = [
    payment?.creditCardRequired && "Credit card is required for this booking.",
    (payment?.panMandatory || isPANRequired) &&
      "PAN number is mandatory for this booking.",
  ].filter(Boolean);

  return (
    <SectionCard
      icon={<HomeOutlined />}
      title={room?.roomType || "Selected Room"}
      subtitle="Room package details"
      action={
        refundLabel && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              refundLabel === "Non-refundable"
                ? "border border-red-200 bg-red-50 text-red-600"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {refundLabel !== "Non-refundable" && <CheckOutlined />}
            {refundLabel}
          </span>
        )
      }
    >
      <div className="space-y-5">
        {room?.additionalInfo && (
          <p className="m-0 text-[13px] leading-6 text-gray-600">
            {room.additionalInfo}
          </p>
        )}

        {room?.description && (
          <RoomDescription
            html={room.description}
            className="text-[13px] leading-6 text-gray-600 sm:text-sm"
          />
        )}

        {roomFacts.length > 0 && (
          <dl className="m-0 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {roomFacts.map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-gray-100 bg-slate-50 px-3 py-2.5"
              >
                <dt className="text-[11px] text-gray-500">{label}</dt>
                <dd className="m-0 mt-0.5 truncate text-[13px] font-semibold text-gray-800">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {(beds.length > 0 || boardBasis || occupancies.length > 0) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {beds.length > 0 && (
              <div>
                <SubHeading>Beds</SubHeading>
                <div className="flex flex-wrap gap-2">
                  {beds.map((bed, index) => {
                    const bedType =
                      typeof bed === "string"
                        ? bed
                        : bed?.description ||
                          String(bed?.type || "Bed").replace(
                            /([a-z])([A-Z])/g,
                            "$1 $2",
                          );
                    const count = Number(bed?.count) || 1;
                    return (
                      <Chip key={`${bedType}-${index}`}>
                        {count} × {bedType}
                      </Chip>
                    );
                  })}
                </div>
              </div>
            )}

            {boardBasis && (
              <div>
                <SubHeading>Board basis</SubHeading>
                <div className="flex flex-wrap gap-2">
                  <Chip>
                    {Array.isArray(boardBasis)
                      ? boardBasis.map(formatDetail).join(", ")
                      : formatDetail(boardBasis)}
                  </Chip>
                </div>
              </div>
            )}

            {occupancies.length > 0 && (
              <div>
                <SubHeading>Room occupancy</SubHeading>
                <div className="flex flex-wrap gap-2">
                  {occupancies.map((occupancy, index) => {
                    const adults = Number(
                      occupancy?.numOfAdults ?? occupancy?.adults ?? 0,
                    );
                    const children = Number(
                      occupancy?.numOfChildren ??
                        occupancy?.children?.length ??
                        0,
                    );
                    const childAges = Array.isArray(occupancy?.childAges)
                      ? occupancy.childAges
                      : [];

                    return (
                      <Chip key={occupancy?.occupancyId ?? index}>
                        {adults} {adults === 1 ? "adult" : "adults"}
                        {children > 0 &&
                          `, ${children} ${children === 1 ? "child" : "children"}`}
                        {childAges.length > 0 &&
                          ` (ages ${childAges.join(", ")})`}
                      </Chip>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {facilityNames.length > 0 && (
          <div>
            <SubHeading>Room facilities</SubHeading>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-2 p-0 sm:grid-cols-2">
              {facilityNames.map((facility, index) => (
                <li
                  key={`${facility}-${index}`}
                  className="flex items-start gap-2 text-[13px] text-gray-700"
                >
                  <CheckOutlined className="mt-1 shrink-0 text-[11px] text-emerald-600" />
                  <span className="min-w-0">{facility}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cancellationPolicy && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
            <SafetyCertificateOutlined className="mt-0.5 text-[18px] text-emerald-600" />
            <div className="min-w-0">
              <p className="m-0 text-[13px] font-bold text-emerald-800">
                Cancellation policy
              </p>
              <p className="m-0 mt-0.5 text-[12px] leading-5 text-emerald-700 sm:text-[13px]">
                {cancellationPolicy}
              </p>
            </div>
          </div>
        )}

        {paymentNotes.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
            <CreditCardOutlined className="mt-0.5 text-[18px] text-amber-600" />
            <div className="min-w-0">
              <p className="m-0 text-[13px] font-bold text-amber-800">
                Payment requirements
              </p>
              <ul className="m-0 mt-1 list-none space-y-1 p-0">
                {paymentNotes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-2 text-[12px] leading-5 text-amber-800 sm:text-[13px]"
                  >
                    <CheckCircleFilled className="mt-1 shrink-0 text-[11px] text-amber-500" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
