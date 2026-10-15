"use client";
import { Card, Typography } from "antd";
const { Title, Text } = Typography;
export default function RoomPackageCard({ bookingData }) {
  const room = Array.isArray(bookingData?.rooms)
    ? bookingData.rooms[0] || bookingData?.selectedRoom || {}
    : bookingData?.rooms || bookingData?.selectedRoom || {};
  const inclusionSource = room?.inclusion || room?.Inclusion || "";
  const inclusion = Array.isArray(inclusionSource)
    ? inclusionSource
    : String(inclusionSource || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const cancellationPolicy =
    room?.policy?.outPolicyReason || room?.cancellationPolicy || "";
  const refundable = room?.refundable ?? bookingData?.refundable;
  const payment = room?.payment || {};
  return (
    <Card
      className="!mb-3 !rounded-xl !border !border-gray-200 !bg-white !shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
      styles={{ body: { padding: 0 } }}
    >
      <div className="p-4 sm:p-5">
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="min-w-0">
            <Text className="!block !text-[10px] !font-medium !tracking-[0.08em] !text-gray-400 !uppercase">
              Room Package
            </Text>
            <Title
              level={4}
              className="!mt-1.5 !mb-0 !truncate !text-[17px] !leading-6 !font-semibold !text-[#172033] sm:!text-[18px]"
            >
              {room?.roomType || "Selected Room"}
            </Title>
          </div>
          {(cancellationPolicy || refundable === true) && (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600 sm:text-[11px]">
              {cancellationPolicy ? "Free Cancellation" : "Refundable"}
            </span>
          )}
        </div>
        {/* ================= ADDITIONAL INFO ================= */}
        {room?.additionalInfo && (
          <div className="border-b border-gray-100 py-0">
            <Text className="!block !text-[12px] !leading-5 !text-gray-500">
              {room.additionalInfo}
            </Text>
          </div>
        )}
        {room?.description && (
          <div className="border-b border-gray-100 py-3">
            <Text className="!block !text-[12px] !leading-5 !text-gray-500">
              {room.description}
            </Text>
          </div>
        )}
        {/* ================= INCLUSIONS ================= */}
        {!!inclusion.length && (
          <div className="py-4">
            <Text className="!mb-2.5 !block !text-[12px] !font-semibold !text-[#172033]">
              Inclusions
            </Text>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {inclusion.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-1.5 text-[11px] text-gray-600 sm:text-[12px]"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-600">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ================= CANCELLATION ================= */}
        {cancellationPolicy && (
          <div className="border-t border-gray-100 pt-4">
            <Text className="!mb-2 !block !text-[12px] !font-semibold !text-[#172033]">
              Cancellation Policy
            </Text>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
              <Text className="!block !text-[11px] !leading-5 !text-emerald-700 sm:!text-[12px]">
                {cancellationPolicy}
              </Text>
            </div>
          </div>
        )}
        {/* ================= PAYMENT REQUIREMENTS ================= */}
        {(payment?.creditCardRequired || payment?.panMandatory) && (
          <div className="border-t border-gray-100 pt-4">
            <Text className="!mb-2.5 !block !text-[12px] !font-semibold !text-[#172033]">
              Payment Requirements
            </Text>
            <div className="space-y-2">
              {payment?.creditCardRequired && (
                <div className="flex items-start gap-2 text-[11px] leading-5 text-gray-600 sm:text-[12px]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span> Credit card is required for this booking. </span>
                </div>
              )}
              {payment?.panMandatory && (
                <div className="flex items-start gap-2 text-[11px] leading-5 text-gray-600 sm:text-[12px]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span> PAN number is mandatory for this booking. </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
