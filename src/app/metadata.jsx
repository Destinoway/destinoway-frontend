const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const OG_IMAGE = "/images/OGIMAGE1.png";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Destonoway",
    template: "%s | Destonoway",
  },

  description:
    "Book hotels, flights and buses easily with Destonoway. Find the best travel deals and destinations.",

  keywords: [
    "Destonoway",
    "hotels",
    "flights",
    "bus booking",
    "travel booking",
    "travel deals",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Destonoway - Travel & Booking",
    description: "Book hotels, flights and travel packages with Destonoway.",
    url: "/",
    siteName: "Destonoway",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Destonoway - Travel & Booking",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Destonoway - Travel & Booking",
    description: "Book hotels, flights and travel packages with Destonoway.",
    images: [OG_IMAGE],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  /*
   * IMPORTANT:
   * Currently Destonoway should NOT be indexed by search engines.
   */
  robots: {
    index: false,
    follow: false,
    nocache: true,

    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};
