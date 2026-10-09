import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const getDefaultCityData = () => ({
  id: "",
  name: "",
  type: "",
  city: "",
  state: "",
  stateName: "",
  country: "",
  countryCode: "",
  displayName: "",
  normalizedCity: "",
});

const getDefaultSearchData = () => ({
  city: "",
  cityData: getDefaultCityData(),
  checkIn: dayjs().format("YYYY-MM-DD"),
  checkOut: dayjs().add(1, "day").format("YYYY-MM-DD"),
  rooms: 1,
  adults: 2,
  children: 0,
  childAges: [],
  pets: false,
});

export const useHotelSearchStore = create(
  persist(
    (set) => ({
      draftSearchData: getDefaultSearchData(),
      appliedSearchData: getDefaultSearchData(),

      setDraftSearchData: (data) =>
        set((state) => {
          const hasCityData = Object.prototype.hasOwnProperty.call(
            data,
            "cityData",
          );

          let cityData = state.draftSearchData.cityData;

          if (hasCityData) {
            cityData =
              data.cityData === null
                ? getDefaultCityData()
                : {
                    ...getDefaultCityData(),
                    ...(data.cityData || {}),
                  };
          }

          return {
            draftSearchData: {
              ...state.draftSearchData,
              ...data,
              cityData,
            },
          };
        }),

      applySearch: () =>
        set((state) => ({
          appliedSearchData: {
            ...state.draftSearchData,
            cityData: {
              ...state.draftSearchData.cityData,
            },
          },
        })),

      setAppliedSearchData: (data) =>
        set((state) => {
          const hasCityData = Object.prototype.hasOwnProperty.call(
            data,
            "cityData",
          );

          let cityData = state.appliedSearchData.cityData;

          if (hasCityData) {
            cityData =
              data.cityData === null
                ? getDefaultCityData()
                : {
                    ...getDefaultCityData(),
                    ...(data.cityData || {}),
                  };
          }

          return {
            appliedSearchData: {
              ...state.appliedSearchData,
              ...data,
              cityData,
            },
          };
        }),
    }),
    {
      name: "hotel-search-storage",

      version: 3,

      migrate: (persistedState, version) => {
        if (version < 3) {
          const draft =
            persistedState?.draftSearchData || getDefaultSearchData();

          const applied =
            persistedState?.appliedSearchData || getDefaultSearchData();

          return {
            draftSearchData: {
              ...getDefaultSearchData(),
              ...draft,
              cityData: {
                ...getDefaultSearchData().cityData,
                ...(draft?.cityData || {}),
              },
            },

            appliedSearchData: {
              ...getDefaultSearchData(),
              ...applied,
              cityData: {
                ...getDefaultSearchData().cityData,
                ...(applied?.cityData || {}),
              },
            },
          };
        }

        return persistedState;
      },

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const today = dayjs().startOf("day");

        const checkIn = dayjs(state.draftSearchData?.checkIn);
        const checkOut = dayjs(state.draftSearchData?.checkOut);

        const invalidDates =
          !checkIn.isValid() ||
          checkIn.isBefore(today) ||
          !checkOut.isValid() ||
          checkOut.isBefore(today);

        if (!invalidDates) return;

        const updatedDates = {
          checkIn: today.format("YYYY-MM-DD"),
          checkOut: today.add(1, "day").format("YYYY-MM-DD"),
        };

        state.setDraftSearchData(updatedDates);

        state.setAppliedSearchData(updatedDates);
      },
    },
  ),
);
