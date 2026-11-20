// Static content for the /bus landing page (Figma: "Bus Home Page Design").
// Swap these for API data once the bus inventory endpoints exist.

const IMG = "/images/bus";

export const BUS_ACCENT = "#ba611e";

export const TRIP_MODES = [
  { key: "oneway", label: "One-way / Daily", icon: `${IMG}/mode-oneway.svg`, iconSize: [10.8, 12.83] },
  { key: "round", label: "Round Trip", icon: `${IMG}/mode-roundtrip.svg`, iconSize: [13.47, 12.3] },
  { key: "pass", label: "Bus Pass", icon: `${IMG}/mode-pass.svg`, iconSize: [13.47, 13.47], badge: "Save 35%" },
];

export const POPULAR_ROUTES = [
  { from: "Jaipur", to: "Delhi" },
  { from: "Delhi", to: "Manali" },
  { from: "Mumbai", to: "Goa" },
  { from: "Bangalore", to: "Hyderabad" },
];

// Mobile frame shows only the first four, with its own icons and short labels.
export const TRUST_ITEMS_MOBILE = [
  { title: "Secure Payments", icon: `${IMG}/m-trust-secure.svg`, size: 32 },
  { title: "Best Price", icon: `${IMG}/m-trust-price.svg`, size: 32 },
  { title: "24/7 Support", icon: `${IMG}/m-trust-support.svg`, size: 28 },
  { title: "Easy Booking", icon: `${IMG}/m-trust-booking.svg`, size: 28 },
];

export const TRUST_ITEMS = [
  { title: "Secure Payments", text: "Your payment information is safe with us.", icon: `${IMG}/trust-secure.svg`, size: [21.33, 26.67] },
  { title: "Best Price Guarantee", text: "Find a lower price? We'll match it for you.", icon: `${IMG}/trust-price.svg`, size: [24, 24] },
  { title: "24/7 Support", text: "We're here to help you anytime, anywhere.", icon: `${IMG}/trust-support.svg`, size: [24, 28] },
  { title: "Easy Booking", text: "Book in just a few clicks with a hassle-free experience.", icon: `${IMG}/trust-booking.svg`, size: [26.63, 26.67] },
  { title: "Worldwide Coverage", text: "Thousands of destinations across the globe.", icon: `${IMG}/trust-world.svg`, size: [26.67, 26.67] },
  { title: "Safe & Trusted", text: "Trusted by millions of travelers worldwide.", icon: `${IMG}/trust-safe.svg`, size: [21.33, 26.67] },
];

export const OFFER_FILTERS = [
  { key: "all", label: "All" },
  { key: "bus", label: "Bus Offers" },
  { key: "primo", label: "Primo Buses", icon: `${IMG}/offers-star.svg` },
  { key: "bank", label: "Bank & UPI Deals" },
];

export const OFFERS = [
  {
    id: "festive",
    category: "bus",
    tag: "Bus",
    tagBg: "#dc2626",
    validTill: "Valid till 30 Nov",
    title: "Save up to ₹300 on bus tickets",
    text: "Applicable for all new Destinoway riders across 500+ express routes.",
    code: "FESTIVEDESTINO",
    border: "rgba(254,215,170,0.8)",
    divider: "rgba(254,215,170,0.6)",
    codeBorder: "#fb923c",
    gradient: "linear-gradient(145deg, #fffbeb 0%, #fff1f2 50%, #fff7ed 100%)",
    art: {
      src: `${IMG}/offer-bus.png`,
      w: 1467,
      h: 791,
      // The photo has a black background; Figma clips it to the bus outline.
      // offer-bus-mask.png is that Figma mask converted to an alpha mask.
      style: {
        right: 3,
        top: 99,
        width: 138.384,
        height: 74.65,
        transform: "scaleX(-1)",
        maskImage: `url(${IMG}/offer-bus-mask.png)`,
        WebkitMaskImage: `url(${IMG}/offer-bus-mask.png)`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      },
    },
    shadows: [
      { src: `${IMG}/shadow-2.svg`, style: { right: 71, top: 164, width: 65, height: 10.5 } },
      { src: `${IMG}/shadow-1.svg`, style: { right: 4, top: 152, width: 64, height: 21 } },
    ],
  },
  {
    id: "primo",
    category: "primo",
    tag: "Primo Special",
    tagIcon: `${IMG}/offers-verified.svg`,
    tagBg: "#059669",
    validTill: "Valid till 15 Nov",
    title: "Flat 15% OFF on top rated Primo fleets",
    text: "Guaranteed on-time departures, sanitised cabins & top-tier driving staff.",
    code: "DESTINOPRIMO",
    border: "#a7f3d0",
    divider: "rgba(167,243,208,0.6)",
    codeBorder: "#10b981",
    gradient: "linear-gradient(145deg, #ecfdf5 0%, #f0fdfa 50%, #f8fafc 100%)",
    art: {
      src: `${IMG}/offer-15off.png`,
      w: 451,
      h: 280,
      style: { right: 13, top: 122, width: 104.6, height: 64.94, transform: "rotate(-14.37deg)" },
    },
    shadows: [{ src: `${IMG}/shadow-3.svg`, style: { right: 12, top: 169, width: 78, height: 8 } }],
  },
  {
    id: "icici",
    category: "bank",
    tag: "ICICI Bank",
    tagBg: "#1d4ed8",
    validTill: "Valid till 25 Nov",
    title: "Get ₹500 instant cashback",
    text: "On transactions above ₹1,499 via ICICI NetBanking, Credit & Debit Cards.",
    code: "ICICIBUS",
    border: "#bfdbfe",
    divider: "rgba(191,219,254,0.6)",
    codeBorder: "#60a5fa",
    gradient: "linear-gradient(145deg, #eff6ff 0%, #eef2ff 50%, #f8fafc 100%)",
    art: {
      src: `${IMG}/offer-cashback.png`,
      w: 740,
      h: 592,
      style: { right: -15, top: 71, width: 176, height: 141 },
    },
    shadows: [{ src: `${IMG}/shadow-4.svg`, style: { right: 12, top: 159, width: 43, height: 12 } }],
  },
  {
    id: "upi",
    category: "bank",
    tag: "UPI Cashback",
    tagBg: "#7e22ce",
    validTill: "Valid till 30 Nov",
    title: "Instant ₹150 wallet credit",
    text: "Scan QR with any UPI app (GPay, PhonePe, Paytm) during checkout.",
    code: "UPIPASS",
    border: "#e9d5ff",
    divider: "rgba(233,213,255,0.6)",
    codeBorder: "#c084fc",
    gradient: "linear-gradient(145deg, #faf5ff 0%, #f5f3ff 50%, #fdf2f8 100%)",
    art: {
      src: `${IMG}/offer-wallet.png`,
      w: 642,
      h: 350,
      style: { right: -27, top: 89, width: 191.5, height: 104.4, transform: "rotate(-8.56deg)" },
    },
    shadows: [
      { src: `${IMG}/shadow-5.svg`, style: { right: 18, top: 168, width: 77, height: 12.2, transform: "rotate(2.65deg)" } },
    ],
  },
];

export const ROUTE_BADGES = [
  { label: "Safety First Always", icon: `${IMG}/badge-safety.svg` },
  { label: "Exclusive Fleet", icon: `${IMG}/badge-bus.svg` },
  { label: "Professional Drivers", icon: `${IMG}/badge-pilot.svg` },
  { label: "Clean Rest Stops", icon: `${IMG}/badge-food.svg` },
];

export const ROUTE_FILTERS = [
  { from: "Delhi", to: "Manali" },
  { from: "Mumbai", to: "Goa" },
  { from: "Bangalore", to: "Ooty" },
  { from: "Jaipur", to: "Udaipur" },
  { from: "Chandigarh", to: "Shimla" },
];

export const TRENDING_ROUTES = [
  {
    id: "delhi-manali",
    from: "Delhi",
    to: "Manali",
    title: "Delhi to Manali Snow Valley",
    image: `${IMG}/route-manali.png`,
    badge: "Daily Overnight",
    badgeBg: "rgba(11,59,44,0.9)",
    price: "₹799",
    unit: "/seat",
    duration: "11h 30m",
    rating: "4.9 (1,240 reviews)",
    text: "AC Multi-Axle Volvo with sanitized sleeper berths, continuous air purification, and scenic Himalayan pit-stops.",
    availability: "32 Seats Available",
  },
  {
    id: "mumbai-goa",
    from: "Mumbai",
    to: "Goa",
    title: "Mumbai to Goa Highway Express",
    image: `${IMG}/route-sleeper.png`,
    badge: "VIP Sleeper Pods",
    badgeBg: "#f59e0b",
    price: "₹1,199",
    unit: "/berth",
    duration: "8h 15m",
    rating: "4.95 (3,100 reviews)",
    text: "First class individual privacy suites, individual multimedia LED screens, complimentary refreshments, and quiet sleep zones.",
    availability: "6 VIP Berths Left",
  },
  {
    id: "jaipur-delhi",
    from: "Jaipur",
    to: "Delhi",
    title: "Jaipur to New Delhi Airport Express",
    image: `${IMG}/route-express.png`,
    badge: "Instant GPS",
    badgeBg: "#047857",
    price: "₹449",
    unit: "/seat",
    duration: "4h 45m",
    rating: "4.88 (850 reviews)",
    text: "High-frequency hourly non-stop express buses with live GPS telemetry tracking and designated Terminal 3 drop-off.",
    availability: "Running Every 30 Mins",
  },
];

export const WHATS_NEW = [
  {
    title: "Free Cancellation",
    text: "Get 100% refund on cancellation up to 6 hrs before departure. Zero questions asked.",
    link: "Learn how it works",
    icon: `${IMG}/new-cancel.svg`,
    iconSize: [22, 21],
    arrow: `${IMG}/new-arrow-white.svg`,
    gradient: "linear-gradient(147deg, #dc2626 0%, #be123c 50%, #7f1d1d 100%)",
    textColor: "#ffe4e6",
    linkColor: "#ffffff",
    iconBox: "bg-white/20",
    glow: "rgba(255,255,255,0.1)",
  },
  {
    title: "Live Bus GPS Tracking",
    text: "Track your coach live on Google Maps and share live ETA updates with family members.",
    link: "Explore live tracking",
    icon: `${IMG}/new-gps.svg`,
    iconSize: [23, 23],
    arrow: `${IMG}/new-arrow-green.svg`,
    gradient: "linear-gradient(147deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    textColor: "#cbd5e1",
    linkColor: "#34d399",
    iconBox: "bg-[rgba(16,185,129,0.2)] border border-[rgba(52,211,153,0.3)]",
    glow: "rgba(16,185,129,0.2)",
  },
  {
    title: "Women Passenger Safety",
    text: "Reserved women-only rows, verified co-passenger alerts, and 24x7 SOS rapid helpline.",
    link: "Safety guidelines",
    icon: `${IMG}/new-women.svg`,
    iconSize: [11, 17],
    arrow: `${IMG}/new-arrow-pink.svg`,
    gradient: "linear-gradient(147deg, #7e22ce 0%, #6b21a8 50%, #312e81 100%)",
    textColor: "#f3e8ff",
    linkColor: "#fbcfe8",
    iconBox: "bg-white/20",
    glow: "rgba(236,72,153,0.2)",
  },
  {
    title: "FlexiTicket",
    text: "Reschedule your journey date and time easily with zero operator rescheduling penalties.",
    link: "Know more",
    icon: `${IMG}/new-flexi.svg`,
    iconSize: [20, 19.9],
    arrow: `${IMG}/new-arrow-blue.svg`,
    gradient: "linear-gradient(147deg, #2563eb 0%, #4338ca 50%, #1e3a8a 100%)",
    textColor: "#dbeafe",
    linkColor: "#bae6fd",
    iconBox: "bg-white/20",
    glow: "rgba(56,189,248,0.2)",
  },
];

export const CABIN_CLASSES = [
  {
    title: "AC Seater",
    subtitle: "For short journeys",
    icon: `${IMG}/class-seater.svg`,
    iconSize: [19.87, 21.79],
    badge: "Most Popular",
    badgeClass: "bg-[#fef3c7] text-[#92400e]",
    features: ["Reclining comfortable seats", "Individual USB charging", "Warm reading lights", "Overhead luggage rack"],
    price: "₹249",
  },
  {
    title: "AC Sleeper",
    subtitle: "Relax on overnight trips",
    icon: `${IMG}/class-sleeper.svg`,
    iconSize: [24.03, 16.47],
    badge: "Night Travel",
    badgeClass: "bg-[#f1f5f9] text-[#05144b]",
    features: ["Individual berth curtains", "Clean fresh linen & pillow", "Privacy warm night lamp", "Dedicated luggage bay"],
    price: "₹599",
  },
  {
    title: "Volvo / Scania",
    subtitle: "Premium travel experience",
    icon: `${IMG}/class-volvo.svg`,
    iconSize: [17.55, 21.89],
    badge: "Ultra Luxury",
    badgeClass: "bg-[rgba(186,97,30,0.15)] text-[#ba611e]",
    features: ["Multi-axle air suspension", "Onboard infotainment screens", "Complimentary snacks & water", "Clean washroom onboard"],
    price: "₹849",
  },
  {
    title: "Non-AC Express",
    subtitle: "Budget-friendly journeys",
    icon: `${IMG}/class-nonac.svg`,
    iconSize: [21.98, 17.63],
    badge: "Value Saver",
    badgeClass: "bg-[#f1f5f9] text-[#1e293b]",
    features: ["High frequency departures", "Economical ticket pricing", "Quick city-to-city stops", "Deep regional connectivity"],
    price: "₹179",
  },
];

export const RTC_PARTNERS = [
  { code: "RSRTC", fullName: "Rajasthan State Road Transport Corporation", name: "Rajasthan Roadways", fleet: "1,200+ Daily Express Buses", popular: "Jaipur, Jodhpur, Udaipur", rating: "4.8", logo: `${IMG}/rtc-rsrtc.png` },
  { code: "UPSRTC", fullName: "Uttar Pradesh State Road Transport Corporation", name: "Uttar Pradesh RTC", fleet: "2,500+ Daily Express Buses", popular: "Lucknow, Agra, Varanasi", rating: "4.7", logo: `${IMG}/rtc-upsrtc.png` },
  { code: "HRTC", fullName: "Himachal Road Transport Corporation", name: "Himachal Roadways", fleet: "950+ Mountain Hill Coaches", popular: "Shimla, Manali, Dharamshala", rating: "4.9", logo: `${IMG}/rtc-hrtc.png` },
  { code: "GSRTC", fullName: "Gujarat State Road Transport Corporation", name: "Gujarat Roadways", fleet: "1,800+ Daily Express Buses", popular: "Ahmedabad, Surat, Rajkot", rating: "4.8", logo: `${IMG}/rtc-gsrtc.png` },
  { code: "KSRTC", fullName: "Karnataka State Road Transport Corporation", name: "Karnataka RTC", fleet: "3,100+ Premium Airavata Fleets", popular: "Bangalore, Mysore, Mangalore", rating: "4.9", logo: `${IMG}/rtc-ksrtc.png` },
];

export const BUS_FAQ = {
  title: "Questions & Answer",
  items: [
    {
      question: "How do I book a bus ticket on Destinoway?",
      answer:
        "Enter your departure city, destination and journey date in the search box, pick a bus that suits your timing and budget, choose your seat and complete the payment. Your e-ticket is sent to your email and phone instantly.",
    },
    {
      question: "Can I cancel my bus ticket and get a refund?",
      answer:
        "Yes. Tickets with Free Cancellation can be cancelled up to 6 hours before departure for a full refund. For other tickets, the refund depends on the bus operator's cancellation policy shown at booking.",
    },
    {
      question: "Do I need to carry a printout of my ticket?",
      answer:
        "No. An m-ticket on your phone along with a valid government photo ID is accepted by most operators.",
    },
    {
      question: "Can I track my bus live?",
      answer:
        "Buses with Live GPS Tracking let you follow your coach on the map and share your live ETA with family from the booking details page.",
    },
    {
      question: "Which payment methods are supported?",
      answer:
        "You can pay using UPI, credit and debit cards (Visa, MasterCard, RuPay), net banking and popular wallets.",
    },
  ],
};
