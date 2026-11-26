import dayjs from "dayjs";
import { create } from "zustand";

// Shared between the bus hero search box and the route cards further down
// the page, so "Book Now" / route chips can prefill the search.
export const useBusSearchStore = create((set) => ({
  tripMode: "oneway",
  from: "",
  to: "",
  date: dayjs().format("YYYY-MM-DD"),

  setTripMode: (tripMode) => set({ tripMode }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  setDate: (date) => set({ date }),
  swap: () => set((s) => ({ from: s.to, to: s.from })),
  setRoute: ({ from, to }) => set({ from, to }),
}));
