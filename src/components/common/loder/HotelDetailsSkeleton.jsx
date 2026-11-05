"use client";

import { Card, Col, Row, Skeleton } from "antd";

function ImageSkeleton({ height }) {
  return (
    <Skeleton.Node
      active
      className="flex! w-full! max-w-none! items-center! justify-center!"
      style={{
        width: "100%",
        height,
        borderRadius: 5,
      }}
    >
      <svg
        width="90"
        height="90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c0c0c0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="M21 16l-5-5-4 4-2-2-5 5" />
      </svg>
    </Skeleton.Node>
  );
}

export default function HotelDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#edf2f5] px-2 py-4 sm:px-4 md:px-6 lg:px-8">
<Card
  variant="borderless"
  className="rounded-xl"
  styles={{
    body: {
      padding: 8, // mobile ke liye
    },
  }}
>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Skeleton.Input
              active
              block
              style={{
                width: "100%",
                height: 42,
              }}
            />

            <div className="mt-4">
              <Skeleton.Input
                active
                style={{
                  width: "60%",
                  height: 22,
                }}
              />
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Skeleton.Avatar
              active
              shape="circle"
              size={{ xs: 38, sm: 44, md: 56 }}
            />
            <Skeleton.Avatar
              active
              shape="circle"
              size={{ xs: 38, sm: 44, md: 56 }}
            />
          </div>
        </div>

        {/* Gallery */}
        {/* Desktop Skeleton */}
        <div className="hidden lg:block">
          <Row gutter={16}>
            {/* Left Image */}
            <Col xs={24} lg={8}>
              <ImageSkeleton height={665} />
            </Col>

            {/* Center Images */}
            <Col xs={24} lg={8}>
              <div className="flex flex-col gap-4">
                <ImageSkeleton height={325} />
                <ImageSkeleton height={325} />
              </div>
            </Col>

            {/* Right Card */}
            <Col xs={24} lg={8}>
              <Card>
                <Skeleton.Button
                  active
                  style={{
                    width: 140,
                    height: 34,
                    borderRadius: 999,
                  }}
                />

                <div className="mt-6">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>

                <Card variant="borderless" className="mt-5">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>

                <Card variant="borderless" className="mt-4">
                  <Skeleton active paragraph={{ rows: 6 }} />
                </Card>

                <div className="mt-5 flex gap-3">
                  <Skeleton.Button active block style={{ height: 56 }} />
                  <Skeleton.Button active block style={{ height: 56 }} />
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Mobile Skeleton */}
        <div className="block lg:hidden">
          <ImageSkeleton height={220} />

          <Card className="mt-4">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>

          <Card className="mt-4">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>

          <Card className="mt-4">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>

          <Card className="mt-4">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </div>
      </Card>
    </div>
  );
}
