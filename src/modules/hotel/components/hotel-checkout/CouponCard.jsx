"use client";
import {
  CheckCircleFilled,
  CheckOutlined,
  GiftOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { App, Button, Card, Empty, Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;

export default function CouponCard({
  coupons = [],
  priceSummary = {},
  onApplyCoupon,
  loading = false,
}) {
  const { message } = App.useApp();


  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const appliedCouponCode = priceSummary?.couponCode;
  const totalDiscount = Number(priceSummary?.couponDiscount || 0);

  const handleApply = (coupon) => {
    onApplyCoupon?.(coupon);
    message.success("Coupon applied");
  };

  return (
    <Card
      variant={false}
      className="rounded shadow-[0_6px_18px_rgba(0,0,0,0.08)] mt-4!"
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      {/* Header */}
      <div className="mt-4! flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECFDF5]">
          <GiftOutlined className="text-xl text-[#0f766e]" />
        </div>

        <div>
          <Title level={5} className="mb-0!">
            Offers & Coupons
          </Title>

          <Text className="text-sm text-gray-500">
            Apply the best coupon and save more
          </Text>
        </div>
      </div>

      {!coupons.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No offers available"
        />
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const applied = coupon.code === appliedCouponCode;

            return (
              <div
                key={coupon._id}
                className={`overflow-hidden rounded  border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  applied
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-[#0F766E]"
                }`}
              >
                {/* Image */}
                <div className="relative h-27.5 w-full">
                  <Image
                    src={coupon.image || "/images/no-image.jpg"}
                    alt={coupon.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow">
                      {coupon.code}
                    </span>
                  </div>

                  {coupon.isAutoApply && (
                    <div className="absolute top-3 right-3 rounded-full bg-yellow-400 px-3 py-1 text-[11px] font-semibold text-black shadow">
                      ⭐ Recommended
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Title
                        level={5}
                        className="mb-1! text-[18px]! font-semibold!"
                      >
                        {coupon.title}
                      </Title>

                      <Text className="block text-[13px] text-gray-500">
                        Save instantly on your booking
                      </Text>
                    </div>

                    {/* Discount */}
                    <div className="rounded-xl bg-[#ECFDF5] px-3 py-2 text-center">
                      <div className="text-[10px] font-bold tracking-widest text-[#0F766E] uppercase">
                        UP TO
                      </div>

                      <div className="text-[24px] leading-none font-bold text-[#0F766E]">
                        {coupon.discountType === "flat"
                          ? `₹${formatPrice(coupon.discountValue)}`
                          : `${coupon.discountValue}%`}
                      </div>

                      <div className="text-[11px] font-semibold text-[#0F766E]">
                        OFF
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                      <CheckOutlined className="text-[#0F766E]" />
                      Minimum Booking
                      <strong>₹ {formatPrice(coupon.minAmount)}</strong>
                    </div>

                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                      <ThunderboltFilled className="text-yellow-500" />
                      Instant Discount
                    </div>
                  </div>

                  {applied && totalDiscount > 0 && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-100 p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircleFilled className="text-green-600" />

                        <div>
                          <div className="font-semibold text-green-700">
                            Coupon Applied
                          </div>

                          <div className="text-sm text-green-600">
                            You saved ₹ {formatPrice(totalDiscount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    {applied ? (
                      <Button
                        block
                        size="large"
                        disabled
                        className="h-11! rounded-xl! border-green-500! bg-green-50! font-semibold! text-green-700!"
                      >
                        ✓ Applied
                      </Button>
                    ) : (
                      <Button
                        block
                        size="large"
                        loading={loading}
                        className="h-11! rounded-xl! border-none! text-white! bg-[#0F766E]! font-semibold! hover:bg-[#115e59]!"
                        onClick={() => handleApply(coupon)}
                      >
                        Apply Coupon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
