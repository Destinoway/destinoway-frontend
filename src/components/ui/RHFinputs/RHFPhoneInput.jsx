"use client";

import { useCountries } from "@/modules/shared/home/hooks/useCountries";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input } from "antd";
import { useMemo, useState } from "react";
import { Controller, get, useFormContext, useWatch } from "react-hook-form";

export default function RHFPhoneInput({
  name = "mobile",
  codeName = "phoneCode",
  label = "Mobile Number",
  placeholder = "Enter mobile number",
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: countries = [] } = useCountries("");

  const selectedCode = useWatch({
    control,
    name: codeName,
    defaultValue: "+91",
  });

  const mobile = useWatch({
    control,
    name,
    defaultValue: "",
  });

  const selectedCountry = useMemo(() => {
    return (
      countries.find((country) => country.phoneCode === selectedCode) ||
      countries.find((country) => country.countryCode === "IN")
    );
  }, [countries, selectedCode]);

  const filteredCountries = useMemo(() => {
    if (!search) return countries;

    const value = search.toLowerCase();

    return countries.filter((country) => {
      return (
        country.countryName.toLowerCase().includes(value) ||
        country.countryCode.toLowerCase().includes(value) ||
        country.phoneCode.toLowerCase().includes(value)
      );
    });
  }, [countries, search]);

  return (
    <div className="relative">
      {/* Floating Label */}
      <label
        className={`pointer-events-none absolute left-3 z-10 bg-white px-1 transition-all duration-200 ${
          mobile || selectedCode
            ? "most-text-color -top-2 text-xs"
            : "top-3 text-sm text-gray-500"
        }`}
      >
        {label}
      </label>

      <div
        className={`flex h-11 overflow-hidden rounded border bg-white ${
          get(errors, name) ? "border-red-500" : "border-gray-300"
        }`}
      >
        {/* Country Dropdown */}
        <Controller
          name={codeName}
          control={control}
          render={() => (
            <Dropdown
              trigger={["click"]}
              open={open}
              onOpenChange={setOpen}
              popupRender={() => (
                <div className="w-62.5 rounded bg-white p-3 shadow-xl">
                  <Input
                    allowClear
                    placeholder="Country Name or Code"
                    prefix={<SearchOutlined />}
                    value={search}
                    className="[&_.ant-input]:border-0! [&_.ant-input]:shadow-none! [&_.ant-input]:focus:shadow-none!"
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <div className="mt-3 max-h-62.5 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <div
                        key={country._id}
                        onClick={() => {
                          setValue(codeName, country.phoneCode, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });

                          setOpen(false);
                          setSearch("");
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 transition hover:bg-gray-100 ${
                          selectedCode === country.phoneCode
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://flagcdn.com/w20/${country.countryCode.toLowerCase()}.png`}
                            alt={country.countryName}
                            className="h-4 w-5 rounded object-cover"
                          />

                          <span className="text-sm">{country.countryName}</span>
                        </div>

                        <span className="text-sm font-medium text-gray-500">
                          {country.phoneCode}
                        </span>
                      </div>
                    ))}

                    {!filteredCountries.length && (
                      <div className="py-6 text-center text-sm text-gray-500">
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}
            >
              <button
                type="button"
                className="flex min-w-17.5 items-center gap-1 border-r border-gray-300 px-2"
              >
                {selectedCountry && (
                  <>
                    <img
                      src={`https://flagcdn.com/w20/${selectedCountry.countryCode.toLowerCase()}.png`}
                      alt=""
                      className="h-3.5 w-5"
                    />

                    <span className="text-xs font-medium">
                      {selectedCountry.phoneCode}
                    </span>
                  </>
                )}

                <DownOutlined className="text-[10px] text-gray-500" />
              </button>
            </Dropdown>
          )}
        />

        {/* Mobile Input */}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder={mobile ? "" : placeholder}
              className="h-full border-0! text-[16px]! shadow-none focus:shadow-none"
            />
          )}
        />
      </div>

      {get(errors, name) && (
        <p className="mt-2 text-xs text-red-500">
          {get(errors, name)?.message}
        </p>
      )}
    </div>
  );
}
