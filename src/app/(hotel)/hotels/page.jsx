import {
  buildHotelDescription,
  buildHotelKeywords,
  buildHotelTitle,
} from "@/modules/cms/seo/cmsDynamicSeo";
import { buildCmsMetadata } from "@/modules/cms/seo/cmsSeo";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";
import HotelContent from "@/modules/hotel/pages/Hotel";
import { Suspense } from "react";

export async function generateMetadata({ searchParams }) {
  const query = await searchParams;

  console.log("SEARCH PAGE QUERY:", query);
  const preview = query?.preview === "true";
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const rawCity = query?.cityName || query?.city || "";
  const cityName = rawCity?.split(",")?.[0]?.trim() || "Hotels";
  const citySlug = cityName
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s-]/g, "")
    ?.replace(/\s+/g, "-");

  const cms = citySlug ? await fetchCmsBySlug(citySlug) : null;

  if (cms) {
    const metadata = buildCmsMetadata(cms);

    if (preview) {
      metadata.robots = {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      };
    }

    return metadata;
  }

  const canonical = citySlug
    ? `${siteUrl}/hotels/${citySlug}`
    : `${siteUrl}/hotels`;

  return {
    metadataBase: new URL(siteUrl),
    title: buildHotelTitle(cityName),
    description: buildHotelDescription(cityName),
    keywords: buildHotelKeywords(cityName),
    alternates: {
      canonical,
    },

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

    openGraph: {
      title: buildHotelTitle(cityName),
      description: buildHotelDescription(cityName),
      url: canonical,
      siteName: "PAN Journey",
      type: "website",
    },
  };
}

export default async function Page({ searchParams }) {
  const query = await searchParams;
  const rawCity = query?.cityName || query?.city || "";
  const cityName = rawCity?.split(",")?.[0]?.trim() || "";
  const citySlug = cityName
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s-]/g, "")
    ?.replace(/\s+/g, "-");
  const cms = citySlug ? await fetchCmsBySlug(citySlug) : null;

  return (
    <Suspense fallback={<div></div>}>
      <HotelContent cms={cms} />
    </Suspense>
  );
}
