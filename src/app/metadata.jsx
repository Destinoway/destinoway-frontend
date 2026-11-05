import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const SITE_URL = getSiteUrl();

const OG_IMAGE = "/images/OGIMAGE1.png";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Destinoway",
    template: "%s | Destinoway",
  },

  description:
    "Book hotels, flights and buses easily with Destinoway. Find the best travel deals and destinations.",

  keywords: [
    "Destinoway",
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
    title: "Destinoway - Travel & Booking",
    description: "Book hotels, flights and travel packages with Destinoway.",
    url: "/",
    siteName: "Destinoway",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Destinoway - Travel & Booking",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Destinoway - Travel & Booking",
    description: "Book hotels, flights and travel packages with Destinoway.",
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

  robots: getRobotsMetadata(),
};
