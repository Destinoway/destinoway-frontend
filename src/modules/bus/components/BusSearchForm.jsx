"use client";

import { api } from "@/services/axios";

import { DatePicker, Select } from "antd";
import { useBusSearchStore } from "@/modules/bus/store/busSearch.store";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";

export default function BusSearchForm() {
  const { from, to, date, setFrom, setTo, setDate } = useBusSearchStore();
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);

  const searchStations = useCallback(async (term, type) => {
    if (!term || term.length < 2) return [];
    try {
      const { data: json } = await api.post("/bus/stations", { term, type });
      if (json.success && json.data) {
        return json.data.map((station) => ({
          label: station.name,
          value: station.name,
        }));
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
    return [];
  }, []);

  const handleFromSearch = useCallback(
    async (val) => {
      setFromLoading(true);
      const options = await searchStations(val, "from");
      setFromOptions(options);
      setFromLoading(false);
    },
    [searchStations]
  );

  const handleToSearch = useCallback(
    async (val) => {
      setToLoading(true);
      const options = await searchStations(val, "to");
      setToOptions(options);
      setToLoading(false);
    },
    [searchStations]
  );

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Book Bus Tickets</h3>

      <div className="grid md:grid-cols-4 gap-4">
        <Select
          size="large"
          placeholder="From"
          value={from || undefined}
          onChange={setFrom}
          onSearch={handleFromSearch}
          loading={fromLoading}
          options={fromOptions}
          filterOption={false}
        />
        <Select
          size="large"
          placeholder="To"
          value={to || undefined}
          onChange={setTo}
          onSearch={handleToSearch}
          loading={toLoading}
          options={toOptions}
          filterOption={false}
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
