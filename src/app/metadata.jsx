import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const SITE_URL = getSiteUrl();

const OG_IMAGE = "/images/OGIMAGE1.webp";

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

  robots: getRobotsMetadata(),
};
