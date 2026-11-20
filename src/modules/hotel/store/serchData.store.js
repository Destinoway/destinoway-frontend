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
  roomGuests: [{ adults: 2, children: [] }],
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

      version: 4,

      migrate: (persistedState, version) => {
        if (version < 4) {
          const draft =
            persistedState?.draftSearchData || getDefaultSearchData();

          const applied =
            persistedState?.appliedSearchData || getDefaultSearchData();

          const restoreRoomGuests = (data) => {
            if (Array.isArray(data?.roomGuests) && data.roomGuests.length) {
              return data.roomGuests;
            }
            const adults = Math.max(1, Number(data?.adults) || 2);
            const children = Math.max(0, Number(data?.children) || 0);
            const roomCount = Math.min(8, Math.max(
              Number(data?.rooms) || 1,
              Math.ceil(adults / 8),
              Math.ceil(children / 2),
            ));
            const roomGuests = Array.from({ length: roomCount }, () => ({ adults: 1, children: [] }));
            for (let remaining = adults - roomCount, index = 0; remaining > 0; remaining -= 1, index += 1) {
              roomGuests[index % roomCount].adults += 1;
            }
            const ages = Array.isArray(data?.childAges) ? data.childAges : [];
            for (let index = 0; index < children && index < roomCount * 2; index += 1) {
              roomGuests[index % roomCount].children.push({ age: ages[index] ?? "" });
            }
            return roomGuests;
          };

          return {
            draftSearchData: {
              ...getDefaultSearchData(),
              ...draft,
              roomGuests: restoreRoomGuests(draft),
              cityData: {
                ...getDefaultSearchData().cityData,
                ...(draft?.cityData || {}),
              },
            },

            appliedSearchData: {
              ...getDefaultSearchData(),
              ...applied,
              roomGuests: restoreRoomGuests(applied),
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
