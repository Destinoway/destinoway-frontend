"use client";

import { Pagination } from "antd";

export default function RoomPagination({
  currentPage,
  total,
  pageSize = 20,
  disabled = false,
  onChange,
}) {
  if (!Number.isFinite(total) || total <= pageSize) {
    return null;
  }

  return (
    <div className="flex justify-center py-5">
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        showSizeChanger={false}
        disabled={disabled}
        onChange={onChange}
        responsive
      />
    </div>
  );
}
