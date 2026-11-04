"use client";

import { invalidateCurrencyQueries } from "@/utils/queryInvalidation";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "antd";
import { useMemo, useState } from "react";

export default function CurrencyDropdown({
  currencies,
  setCurrency,
  closeDropdown,
  inline = false,
}) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const filteredCurrencies = useMemo(() => {
    return currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(search.toLowerCase()) ||
        currency.code.toLowerCase().includes(search.toLowerCase()),
    );
  }, [currencies, search]);

  const handleCurrencyChange = (currency) => {
    setCurrency(currency);
    closeDropdown();
    setSearch("");

    // Refetch price queries so they use the new currency header.
    invalidateCurrencyQueries(queryClient);
  };

  return (
    <div
      className={
        inline
          ? "w-full rounded-xl border border-gray-200 bg-white p-2"
          : "w-[calc(100vw-24px)] max-w-[350px] rounded-xl bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:w-[350px]"
      }
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Search */}
      <Input
        allowClear
        placeholder="Search Currency"
        value={search}
        className="h-10 rounded-lg [&_.ant-input]:!border-0 [&_.ant-input]:!shadow-none [&_.ant-input]:focus:!shadow-none"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Currency List */}
      <div
        className={`overflow-y-auto ${inline ? "mt-1 max-h-[40vh]" : "max-h-[55vh] sm:max-h-80"}`}
      >
        {filteredCurrencies.map((currency) => (
          <div
            key={currency.code}
            onClick={() => handleCurrencyChange(currency)}
            className="height-100% flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 transition hover:bg-[#F5FBFE] active:bg-[#EAF7F9]"
          >
            <span className="truncate pr-3 text-sm sm:text-base">
              {currency.name}
            </span>

            <span className="shrink-0 text-sm font-semibold text-[#0F6A75] sm:text-base">
              {currency.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
