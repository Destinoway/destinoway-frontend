import { DatePicker, Input, Select } from "antd";

export default function FlightSearchForm() {
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">Book Flights</h3>

      <div className="grid gap-4 md:grid-cols-4">
        <Input size="large" placeholder="From" />
        <Input size="large" placeholder="To" />

        <DatePicker className="h-15 w-full" />

        <Select
          size="large"
          options={[
            { label: "1 Adult", value: 1 },
            { label: "2 Adults", value: 2 },
          ]}
        />
      </div>
    </div>
  );
}
