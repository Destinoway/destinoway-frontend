"use client";

import { useDestinationSearch } from "@/modules/hotel/hooks/useDestinationSearch";
import { SearchOutlined } from "@ant-design/icons";
import { Popover, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { memo, useEffect, useMemo, useState } from "react";
import styles from "../components/styles/DestinationSearch.module.css";

function DestinationSearchField({
  value,
  onChange,
  error = false,
  compact = false,
  height = "82px",
  fontSize = "24px",
  wrapperClassName = "",
  autoSelectRecent = false,
  icon,
}) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored =
        JSON.parse(localStorage.getItem("recentHotelSearches") || "[]") || [];

      setRecentSearches(stored);

      if (autoSelectRecent && stored.length > 0 && !value?.city) {
        onChange({
          city: stored[0]?.displayName || stored[0]?.name || "",
          cityData: {
            ...stored[0],
            stateName: stored[0]?.stateName || stored[0]?.state || "",
            countryCode: stored[0]?.countryCode || stored[0]?.country || "",
            normalizedCity: stored[0]?.city || stored[0]?.name || "",
          },
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    }
  }, []);

  const debounceSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  const handleSearch = (value) => {
    setSearchText(value);
    debounceSearch(value);
  };

  const { data = [], isLoading } = useDestinationSearch(debouncedSearch);

  const saveRecentSearch = (item) => {
    if (!item || typeof window === "undefined") {
      return;
    }

    try {
      const existing =
        JSON.parse(localStorage.getItem("recentHotelSearches") || "[]") || [];
      const filtered = existing.filter((x) => x.id !== item.id);
      const updated = [item, ...filtered].slice(0, 4);
      localStorage.setItem("recentHotelSearches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    }
  };

  const isEmptySearch = searchText.trim() === "";

  const sortedSearchResults = useMemo(() => {
    return [...data].sort((a, b) => {
      const search = searchText.toLowerCase();

      const aName = a?.name?.toLowerCase() || "";
      const bName = b?.name?.toLowerCase() || "";

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });
  }, [data, searchText]);

  const buildOptions = (items = []) => {
    return items.map((item) => {
      const fullName =
        item?.displayName ||
        [item?.name, item?.state, item?.country].filter(Boolean).join(", ");

      return {
        label: (
          <div className="flex flex-col py-1">
            <span className="font-semibold text-gray-800">{fullName}</span>

            <span className="text-xs text-gray-500 capitalize">
              {item?.type || ""}
            </span>
          </div>
        ),

        value: `${item?.type || "destination"}-${item?.id}`,

        searchLabel: fullName,

        itemData: item,
      };
    });
  };

  const groupedOptions = useMemo(() => {
    if (isEmptySearch) {
      return recentSearches.length > 0
        ? [
            {
              label: "Recent Searches",
              options: buildOptions(recentSearches),
            },
          ]
        : [];
    }

    const cities = sortedSearchResults.filter((item) => {
      const type = item?.type?.toLowerCase();

      return type === "city" || type === "multicity";
    });

    const hotels = sortedSearchResults.filter((item) => {
      const type = item?.type?.toLowerCase();

      return type === "hotel";
    });

    const locations = sortedSearchResults.filter((item) => {
      const type = item?.type?.toLowerCase();

      return [
        "location",
        "state",
        "neighborhood",
        "trainstation",
        "pointofinterest",
      ].includes(type);
    });

    return [
      // Cities
      ...(cities.length > 0
        ? [
            {
              label: "Cities",
              options: buildOptions(cities),
            },
          ]
        : []),

      ...(hotels.length > 0
        ? [
            {
              label: "Hotels",
              options: buildOptions(hotels),
            },
          ]
        : []),

      ...(locations.length > 0
        ? [
            {
              label: "Locations",
              options: buildOptions(locations),
            },
          ]
        : []),
    ];
  }, [isEmptySearch, recentSearches, sortedSearchResults]);

  const handleChange = (selectedValue, option) => {
    const item = option?.itemData;

    if (!item) {
      return;
    }

    saveRecentSearch(item);

    const normalizedCity = item?.city || item?.name || "";

    onChange({
      city: item?.displayName || option?.searchLabel || item?.name || "",

      cityData: {
        ...item,
        id: item?.id || "",
        name: item?.name || "",
        type: item?.type || "",
        city: item?.city || normalizedCity,
        state: item?.state || "",
        stateName: item?.state || item?.stateName || "",
        country: item?.country || "",
        countryCode: item?.countryCode || "",
        displayName: item?.displayName || "",
        normalizedCity,
      },
    });
  };

  return (
    <>
      {!compact && (
        <span className="mb-2 block text-[14px] font-semibold text-[#222]">
          City, Property name or Location
        </span>
      )}

      <div
        title={value?.city || ""}
        className={`relative w-full min-w-0 overflow-visible rounded border !bg-white px-3 py-1 transition-all hover:border-[#0077b6] ${
          error ? "border-red-500" : "border-gray-300"
        } ${wrapperClassName}`}
        style={{ height }}
      >
        <div
          className={`flex w-full min-w-0 overflow-hidden ${
            compact
              ? "h-full items-center gap-2 px-0"
              : "min-h-[6px] flex-col justify-center px-1 md:px-2"
          }`}
        >
          {icon && <div className="flex shrink-0 items-center">{icon}</div>}

          <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden">
            {icon || <SearchOutlined className="!text-[20px] text-gray-400" />}

            <div className="min-w-0 flex-1">
              <Popover
                open={error}
                placement="bottomLeft"
                content={
                  <span className="text-white">
                    Enter a destination to start searching.
                  </span>
                }
                color="#ef4444"
                trigger={[]}
              >
                <Select
                  showSearch
                  allowClear
                  value={
                    value?.city
                      ? value.city.length > 35
                        ? `${value.city.slice(0, 35)}...`
                        : value.city
                      : undefined
                  }
                  onClear={() => {
                    setSearchText("");
                    setDebouncedSearch("");

                    onChange({
                      city: "",
                      cityData: null,
                    });
                  }}
                  title={value?.city || ""}
                  placeholder="Where do you want to stay?"
                  variant="borderless"
                  popupMatchSelectWidth={compact ? false : true}
                  filterOption={false}
                  loading={isLoading}
                  className={`font-jost! w-full min-w-0 overflow-hidden font-medium text-gray-600 min-[700px]:font-semibold! min-[700px]:text-gray-800! ${styles.destinationSelect}`}
                  style={{
                    width: "100%",
                    fontSize,
                    fontWeight: 400,
                  }}
                  options={groupedOptions}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  notFoundContent={
                    isLoading ? (
                      <div className="flex justify-center py-4">
                        <Spin size="small" />
                      </div>
                    ) : (
                      <div className="py-3 text-center text-sm text-gray-500">
                        No destinations found
                      </div>
                    )
                  }
                />
              </Popover>
            </div>
          </div>

          {compact ? (
            <span
              className="ml-1 max-w-[70px] flex-shrink-0 overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-gray-400"
              title={
                value?.cityData?.country || value?.cityData?.countryCode || ""
              }
            >
              {value?.cityData?.country || value?.cityData?.countryCode || ""}
            </span>
          ) : (
            <span className="!z-34 inline-block w-fit bg-white !font-bold text-xs text-gray-700 md:text-sm">
              {value?.cityData?.country ||
                value?.cityData?.countryCode ||
                "Search destinations"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(DestinationSearchField);
