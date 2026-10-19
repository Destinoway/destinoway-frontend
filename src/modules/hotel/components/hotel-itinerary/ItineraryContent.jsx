"use client";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateFilled,
  StarFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import Image from "next/image";

import { useRazorpayPayment } from "@/modules/payments/hooks/useRazorpayPayment";
import BackgroundSection from "../hotel-booking/BackgroundSection";

const { Title, Text } = Typography;

const cardClass =
  "rounded-xl border border-[#E5EEF7] bg-white shadow-[0_10px_35px_rgba(5,20,75,0.08)]";

const fullName = (person = {}) =>
  [person.title, person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(" ");

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4de] text-[16px] text-[#05144b]">
        {icon}
      </div>
      <div>
        <Title
          level={5}
          className="font-roboto! !mb-0 !text-[16px] !font-bold !text-[#05144b]"
        >
          {title}
        </Title>
        {subtitle && (
          <Text className="text-[13px] text-gray-500">{subtitle}</Text>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-[#FAFCFF] p-3">
      <span className="mt-0.5 text-[#05144b]">{icon}</span>
      <div className="min-w-0">
        <Text className="block text-[11px] tracking-wide text-gray-500 uppercase">
          {label}
        </Text>
        <Text strong className="block text-[14px] break-words">
          {value || "--"}
        </Text>
      </div>
    </div>
  );
}

export default function ItineraryContent({ itinerary }) {
  const { payNow, loading } = useRazorpayPayment();

  const { hotel = {}, stay = {}, contactInfo = {}, rooms = [] } = itinerary;
  const currency = itinerary.currency || "INR";
  const amount = Number(itinerary.amount || 0);

  const checkIn = dayjs(stay.checkIn);
  const checkOut = dayjs(stay.checkOut);
  const nights = Math.max(checkOut.diff(checkIn, "day"), 1);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);

  const totalGuests = rooms.reduce(
    (sum, room) =>
      sum + (room.adults?.length || 0) + (room.children?.length || 0),
    0,
  );

  const handlePay = () =>
    payNow({
      bookingId: itinerary.bookingId,
      customer: {
        name: fullName({
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
        }),
        mobile: contactInfo.mobile,
        email: contactInfo.email,
      },
    });

  return (
    <div className="background-color-bg min-h-screen pb-10">
      <BackgroundSection />

      <div className="relative z-20 mx-auto -mt-10 max-w-[1250px] px-3 md:px-5">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#d8e4f5] bg-white px-5 py-4 shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <Title
              level={2}
              className="font-roboto !mb-0 !text-[22px] !font-semibold !text-[#05144b]"
            >
              Review & Pay
            </Title>
            <Text className="font-roboto text-[14px] text-gray-500">
              Check your booking details and complete the payment to confirm.
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag color="green" className="!m-0 rounded-full px-3 py-1">
              Itinerary {itinerary.itineraryStatus}
            </Tag>
            <Tag color="orange" className="!m-0 rounded-full px-3 py-1">
              Payment {itinerary.paymentStatus}
            </Tag>
          </div>
        </div>

        <Row gutter={[24, 24]} align="top">
          {/* Left */}
          <Col xs={24} lg={16}>
            <div className="flex flex-col gap-5">
              {/* Hotel + stay */}
              <Card
                className={cardClass}
                styles={{ body: { padding: 0 } }}
                variant="borderless"
              >
                <div className="rounded-t-xl bg-linear-to-r from-[#05144b] to-[#0c2fb1] p-5 text-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[26px] text-[#fda20f]">
                      <HomeOutlined />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex gap-0.5 text-[#fda20f]">
                        {Array.from({
                          length: Number(hotel.starRating) || 0,
                        }).map((_, i) => (
                          <StarFilled key={i} />
                        ))}
                      </div>
                      <Title
                        level={3}
                        className="font-roboto !mb-1 !text-[22px] !font-semibold !text-white"
                      >
                        {hotel.name}
                      </Title>
                      <div className="flex items-start gap-2 text-white/80">
                        <EnvironmentOutlined className="mt-1" />
                        <Text className="!text-[14px] !text-white/80">
                          {hotel.address}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] px-3 py-5 sm:p-5">
                    <div className="flex items-center justify-between gap-3 sm:gap-6">
                      <div className="flex-1 text-center">
                        <Text className="block text-[12px] text-gray-500">
                          Check-in
                        </Text>
                        <Text
                          strong
                          className="block text-[15px] leading-tight text-[#05144b] sm:text-[22px]"
                        >
                          {checkIn.format("DD MMM YYYY")}
                        </Text>
                        <Text className="text-[12px] text-gray-500">
                          {checkIn.format("dddd")}
                        </Text>
                      </div>

                      <div className="flex shrink-0 flex-col items-center">
                        <div className="rounded-full border border-[#fda20f] px-3 py-1 text-[12px] font-medium whitespace-nowrap text-[#05144b]">
                          <ClockCircleOutlined className="mr-1" />
                          {nights} Night{nights > 1 ? "s" : ""}
                        </div>
                        <Text className="mt-2 text-center text-[11px] whitespace-nowrap text-gray-500 sm:text-[13px]">
                          {rooms.length} Room • {totalGuests} Guest
                          {totalGuests > 1 ? "s" : ""}
                        </Text>
                      </div>

                      <div className="flex-1 text-center">
                        <Text className="block text-[12px] text-gray-500">
                          Check-out
                        </Text>
                        <Text
                          strong
                          className="block text-[15px] leading-tight text-[#05144b] sm:text-[22px]"
                        >
                          {checkOut.format("DD MMM YYYY")}
                        </Text>
                        <Text className="text-[12px] text-gray-500">
                          {checkOut.format("dddd")}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact */}
              <Card
                className={cardClass}
                styles={{ body: { padding: 20 } }}
                variant="borderless"
              >
                <SectionTitle
                  icon={<UserOutlined />}
                  title="Contact Details"
                  subtitle="Booking confirmation will be sent here"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoRow
                    icon={<UserOutlined />}
                    label="Name"
                    value={fullName(contactInfo)}
                  />
                  <InfoRow
                    icon={<PhoneOutlined />}
                    label="Mobile"
                    value={contactInfo.mobile}
                  />
                  <InfoRow
                    icon={<MailOutlined />}
                    label="Email"
                    value={contactInfo.email}
                  />
                  <InfoRow
                    icon={<EnvironmentOutlined />}
                    label="Address"
                    value={[
                      contactInfo.address,
                      contactInfo.city,
                      contactInfo.state,
                      contactInfo.pin,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </div>
              </Card>

              {/* Rooms & guests */}
              <Card
                className={cardClass}
                styles={{ body: { padding: 20 } }}
                variant="borderless"
              >
                <SectionTitle
                  icon={<TeamOutlined />}
                  title="Rooms & Guests"
                  subtitle={`${rooms.length} room${rooms.length > 1 ? "s" : ""}, ${totalGuests} guest${totalGuests > 1 ? "s" : ""}`}
                />

                <div className="flex flex-col gap-4">
                  {rooms.map((room, index) => (
                    <div
                      key={room.occupancyId ?? index}
                      className="rounded-xl border border-[#E5EEF7] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Text strong className="text-[#05144b]">
                          Room {room.occupancyId ?? index + 1}
                        </Text>
                        <Text className="text-[13px] text-gray-500">
                          {room.adults?.length || 0} Adult
                          {(room.adults?.length || 0) !== 1 ? "s" : ""}
                          {room.children?.length
                            ? `, ${room.children.length} Child${room.children.length > 1 ? "ren" : ""}`
                            : ""}
                        </Text>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          ...(room.adults || []).map((g) => ({
                            ...g,
                            type: "Adult",
                          })),
                          ...(room.children || []).map((g) => ({
                            ...g,
                            type: "Child",
                          })),
                        ].map((guest, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-lg bg-[#FAFCFF] px-3 py-2"
                          >
                            <Text strong className="text-[14px]">
                              {fullName(guest)}
                            </Text>
                            <Tag
                              color={guest.type === "Adult" ? "blue" : "purple"}
                              className="!m-0"
                            >
                              {guest.type}
                            </Tag>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Col>

          {/* Right: payment */}
          <Col xs={24} lg={8}>
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <Card
                className={cardClass}
                styles={{ body: { padding: 20 } }}
                variant="borderless"
              >
                <SectionTitle
                  icon={<CalendarOutlined />}
                  title="Payment Summary"
                />

                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between">
                    <Text className="text-gray-500">Booking ID</Text>
                    <Text strong className="max-w-[180px] truncate">
                      {itinerary.bookingId}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-500">Stay</Text>
                    <Text strong>
                      {nights} Night{nights > 1 ? "s" : ""}
                    </Text>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-gray-300" />

                <div className="flex items-end justify-between">
                  <Text strong className="text-[15px] text-[#05144b]">
                    Total Payable
                  </Text>
                  <Text
                    strong
                    className="text-[26px] leading-none text-[#05144b]"
                  >
                    {formatPrice(amount)}
                  </Text>
                </div>
                <Text className="mt-1 block text-right text-[12px] text-gray-500">
                  Inclusive of all taxes & fees
                </Text>
              </Card>

              <Card
                className={cardClass}
                styles={{ body: { padding: 20 } }}
                variant="borderless"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/payments/razorpay-icon.svg"
                      alt="Razorpay"
                      width={40}
                      height={40}
                    />
                    <div>
                      <Title
                        level={5}
                        className="!mb-0 !text-[16px] !font-semibold"
                      >
                        Razorpay
                      </Title>
                      <Text className="text-[12px] text-gray-500">
                        UPI, Cards, Net Banking & Wallets
                      </Text>
                    </div>
                  </div>
                  <Tag
                    color="green"
                    icon={<SafetyCertificateFilled />}
                    className="!m-0 rounded-full"
                  >
                    Secure
                  </Tag>
                </div>

                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={handlePay}
                  icon={<LockOutlined />}
                  className="buttion-background-color !h-[52px] w-full !rounded-lg !text-[16px] !font-semibold"
                >
                  Pay {formatPrice(amount)}
                </Button>

                <Text className="mt-3 block text-center text-[12px] leading-5 text-gray-500">
                  By clicking <strong>Pay</strong>, you agree to our booking
                  terms, cancellation policy and secure payment process.
                </Text>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
