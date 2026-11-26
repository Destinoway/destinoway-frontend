export const HOME_TABS = [
  {
    key: "hotel",
    label: "Hotels",
    icon: "/images/icons/hotel_icon.svg",
    enabled: true,
  },
  {
    key: "flight",
    label: "Flights",
    icon: "/images/icons/flight_icon.svg",
    enabled: false,
  },
  {
    key: "bus",
    label: "Bus",
    icon: "/images/icons/bus_icon.svg",
    enabled: true,
    // Opens the dedicated bus landing page instead of switching the form.
    href: "/bus",
  },
];
