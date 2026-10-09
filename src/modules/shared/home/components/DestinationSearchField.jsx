"use client";

import { useDestinationSearch } from "@/modules/hotel/hooks/useDestinationSearch";
import { SearchOutlined } from "@ant-design/icons";
import { Popover, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { memo, useEffect, useMemo, useState } from "react";
import styles from "../components/styles/DestinationSearch.module.css";

const getDestinationTypeLabel = (type = "") => {
  const normalized = String(type).trim();

  if (!normalized) return "Other Destinations";

  const knownLabels = {
    multicity: "Multi City",
    pointofinterest: "Points of Interest",
    trainstation: "Railway Stations",
  };

  const key = normalized.toLowerCase();

  if (knownLabels[key]) {
    return knownLabels[key];
  }

  return normalized
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getDestinationOptionValue = (item) =>
  `${String(item?.type || "destination").toLowerCase()}-${item?.id}`;

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
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSearch = (inputText) => {
    setSearchText(inputText);
    debounceSearch(inputText);
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
    const search = searchText.trim().toLowerCase();

    const priority = {
      city: 0,
      multicity: 1,
      hotel: 2,
      airport: 3,
      trainstation: 4,
    };

    return [...data].sort((a, b) => {
      const aName = String(a?.displayName || a?.name || "").toLowerCase();

      const bName = String(b?.displayName || b?.name || "").toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts !== bStarts) {
        return aStarts ? -1 : 1;
      }

      const aPriority = priority[String(a?.type || "").toLowerCase()] ?? 99;

      const bPriority = priority[String(b?.type || "").toLowerCase()] ?? 99;

      return aPriority - bPriority || aName.localeCompare(bName);
    });
  }, [data, searchText]);

  const buildOptions = (items = []) => {
    return items.map((item) => {
      const fullName =
        item?.displayName ||
        [item?.name, item?.state, item?.country].filter(Boolean).join(", ") ||
        "Unknown Destination";

      const locationDetails = [
        item?.city,
        item?.state,
        item?.country === "IN" ? "India" : item?.country,
      ]
        .filter(Boolean)
        .filter((part) => part !== fullName)
        .join(", ");

      return {
        label: (
          <div className="flex flex-col py-1">
            <span className="font-semibold text-gray-800">{fullName}</span>

            <span className="text-xs text-gray-500">
              {[getDestinationTypeLabel(item?.type), locationDetails]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        ),

        value: getDestinationOptionValue(item),

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

    const groups = new Map();

    for (const item of sortedSearchResults) {
      const rawType = String(item?.type || "").trim();
      const groupKey = rawType.toLowerCase() || "other";

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          label: getDestinationTypeLabel(rawType),
          options: [],
        });
      }

      groups.get(groupKey).options.push(item);
    }

    const preferredOrder = [
      "city",
      "multicity",
      "hotel",
      "airport",
      "trainstation",
    ];

    return [...groups.entries()]
      .sort(([a], [b]) => {
        const aIndex = preferredOrder.indexOf(a);
        const bIndex = preferredOrder.indexOf(b);

        const aRank = aIndex === -1 ? Infinity : aIndex;
        const bRank = bIndex === -1 ? Infinity : bIndex;

        return aRank - bRank || a.localeCompare(b);
      })
      .map(([, group]) => ({
        label: group.label,
        options: buildOptions(group.options),
      }));
  }, [isEmptySearch, recentSearches, sortedSearchResults]);

  const clearDestination = () => {
    debounceSearch.cancel();

    setSearchText("");
    setDebouncedSearch("");

    onChange({
      city: "",
      cityData: null,
    });
  };
  const handleChange = (selectedValue, option) => {
    if (selectedValue == null || selectedValue === "") {
      clearDestination();
      return;
    }

    const item = option?.itemData;
    if (!item) return;

    saveRecentSearch(item);

    const type = String(item?.type || "").toLowerCase();

    const normalizedCity =
      item?.city ||
      (type === "city" || type === "multicity" ? item?.displayName || "" : "");

    onChange({
      city: item?.displayName || option?.searchLabel || "",
      cityData: {
        ...item,
        id: item?.id || "",
        name: item?.displayName || item?.name || "",
        type: item?.type || "",
        city: normalizedCity,
        state: item?.state || "",
        stateName: item?.state || item?.stateName || "",
        country: item?.country || "",
        countryCode: item?.countryCode || item?.country || "",
        displayName: item?.displayName || item?.name || "",
        normalizedCity,
      },
    });

    debounceSearch.cancel();
    setSearchText("");
    setDebouncedSearch("");
    setIsEditing(false);
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
                  labelInValue
                  value={
                    value?.cityData?.id
                      ? {
                          value: getDestinationOptionValue(value.cityData),
                          label: value.city || value.cityData.displayName || "",
                        }
                      : undefined
                  }
                  searchValue={searchText}
                  onFocus={() => {
                    setIsEditing(true);
                    setSearchText("");
                    debounceSearch.cancel();
                    setDebouncedSearch("");
                  }}
                  onBlur={() => {
                    setIsEditing(false);
                  }}
                  onSearch={handleSearch}
                  onClear={clearDestination}
                  onChange={handleChange}
                  filterOption={false}
                  options={groupedOptions}
                  loading={isLoading}
                  placeholder="Where do you want to stay?"
                  variant="borderless"
                  popupMatchSelectWidth={compact ? false : true}
                  className={`font-jost! w-full min-w-0 overflow-hidden font-medium text-gray-600 min-[700px]:font-semibold! min-[700px]:text-gray-800! ${
                    styles.destinationSelect
                  } ${isEditing ? styles.editing : ""} ${
                    compact ? "text-sm" : "text-base"
                  }`}
                  style={{
                    width: "100%",
                    fontSize,
                    fontWeight: 400,
                  }}
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
