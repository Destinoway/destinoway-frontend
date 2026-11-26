"use client";

import { DatePicker, Select } from "antd";
import { useBusSearchStore } from "@/modules/bus/store/busSearch.store";
import { useBusStationSearch } from "@/modules/bus/hooks/useBusStationSearch";
import { useState } from "react";
import dayjs from "dayjs";

export default function BusSearchForm() {
  const { from, to, date, setFrom, setTo, setDate } = useBusSearchStore();
  const [fromSearchText, setFromSearchText] = useState("");
  const [toSearchText, setToSearchText] = useState("");

  const { data: fromOptions = [], isLoading: fromLoading } = useBusStationSearch(fromSearchText, "from");
  const { data: toOptions = [], isLoading: toLoading } = useBusStationSearch(toSearchText, "to");

  const stationOptions = (stations) =>
    stations.map((station) => ({
      label: station.name,
      value: station.name,
    }));

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Book Bus Tickets</h3>

      <div className="grid md:grid-cols-4 gap-4">
        <Select
          showSearch={{ onSearch: setFromSearchText, filterOption: false }}
          size="large"
          placeholder="From"
          value={from || undefined}
          onChange={setFrom}
          loading={fromLoading}
          options={stationOptions(fromOptions)}
          variant="borderless"
        />
        <Select
          showSearch={{ onSearch: setToSearchText, filterOption: false }}
          size="large"
          placeholder="To"
          value={to || undefined}
          onChange={setTo}
          loading={toLoading}
          options={stationOptions(toOptions)}
          variant="borderless"
        />

        <DatePicker
          className="w-full h-15"
          value={date ? dayjs(date, "YYYY-MM-DD") : null}
          onChange={(d) => setDate(d.format("YYYY-MM-DD"))}
        />

        <Select
          size="large"
          options={[
            { label: "1 Seat", value: 1 },
            { label: "2 Seats", value: 2 },
          ]}
        />
      </div>
    </div>
  );
}
