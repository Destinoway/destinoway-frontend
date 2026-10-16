import {
  buildHotelDescription,
  buildHotelKeywords,
  buildHotelTitle,
} from "@/modules/cms/seo/cmsDynamicSeo";
import { buildCmsMetadata } from "@/modules/cms/seo/cmsSeo";
import { fetchCityCms } from "@/modules/cms/services/cmsFetch";
import HotelContent from "@/modules/hotel/pages/Hotel";
import { searchDestinationServer } from "@/modules/hotel/services/search.server";
import dayjs from "dayjs";
import { notFound } from "next/navigation";

const formatCityName = (value = "") => {
  return (
    value
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (letter) => letter.toUpperCase()) || ""
  );
};

const normalizePlaceName = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getCoordinates = (place = {}) => {
  const latitude =
    place?.coordinates?.lat ??
    place?.geoCode?.lat ??
    place?.latitude ??
    place?.lat;
  const longitude =
    place?.coordinates?.long ??
    place?.coordinates?.lng ??
    place?.geoCode?.long ??
    place?.geoCode?.lng ??
    place?.longitude ??
    place?.lng ??
    place?.long;

  if (latitude == null || longitude == null) return null;
  return { lat: latitude, long: longitude };
};

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;

  const preview = query?.preview === "true";

  const cms = await fetchCityCms(slug, preview);

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

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cityName = formatCityName(slug) || "Hotels";
  const canonical = `${siteUrl}/hotels/${slug}`;

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

    authors: [
      {
        name: "PAN Journey",
      },
    ],

    creator: "PAN Journey",
    publisher: "PAN Journey",

    openGraph: {
      title: buildHotelTitle(cityName),
      description: buildHotelDescription(cityName),
      url: canonical,
      siteName: "PAN Journey",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: buildHotelTitle(cityName),
      description: buildHotelDescription(cityName),
    },
  };
}

export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const preview = query?.preview === "true";
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cms = await fetchCityCms(slug, preview);

  let cityName = formatCityName(slug);
  let cityData = null;
  const cityMeta = cms?.data?.cityMeta || {};
  const cmsCityName = cityMeta?.destination || cityName;
  const cmsCoordinates = getCoordinates(cityMeta);
  let matchedCity = null;

  // CMS city metadata can contain an ID without the coordinates required by
  // the hotel-search payload. Resolve the destination when coordinates are
  // missing, even when the CMS already supplied destinationId.
  if (!cmsCoordinates || !cityMeta?.destinationId) {
    const destinations = await searchDestinationServer(cmsCityName);
    const expectedName = normalizePlaceName(cmsCityName);
    const expectedId = String(cityMeta?.destinationId || "");
    const cityDestinations = Array.isArray(destinations)
      ? destinations.filter(
          (item) => String(item?.type || "").toLowerCase() === "city",
        )
      : [];

    matchedCity =
      cityDestinations.find(
        (item) => expectedId && String(item?.id || "") === expectedId,
      ) ||
      cityDestinations.find(
        (item) => normalizePlaceName(item?.city || item?.name) === expectedName,
      ) ||
      cityDestinations[0] ||
      null;
  }

  if (!cityMeta?.destinationId && !matchedCity) {
    notFound();
  }

  const coordinates = cmsCoordinates || getCoordinates(matchedCity);
  cityName = cmsCityName || matchedCity?.city || matchedCity?.name || cityName;
  cityData = {
    id: cityMeta?.destinationId || matchedCity?.id || "",
    name: cityMeta?.destination || matchedCity?.name || cityName,
    type: matchedCity?.type || "city",
    city: matchedCity?.city || cityName,
    state: cityMeta?.stateName || matchedCity?.state || "",
    stateName: cityMeta?.stateName || matchedCity?.state || "",
    country: cityMeta?.country || matchedCity?.country || "",
    countryCode: cityMeta?.countryCode || matchedCity?.countryCode || "",
    displayName:
      matchedCity?.displayName ||
      [
        cityMeta?.destination || matchedCity?.name || cityName,
        cityMeta?.stateName || matchedCity?.state,
        cityMeta?.country || matchedCity?.country,
      ]
        .filter(Boolean)
        .join(","),
    normalizedCity: matchedCity?.city || cityName,
    ...(coordinates ? { coordinates, geoCode: coordinates } : {}),
  };

  if (!cityData.id || !coordinates) {
    notFound();
  }

  const initialSearchData = {
    city: cityData?.displayName || cityName || "",
    cityData: {
      id: cityData?.id || "",
      name: cityData?.name || cityName || "",
      type: cityData?.type || "city",
      city: cityData?.city || cityName || "",
      state: cityData?.state || "",
      stateName: cityData?.stateName || cityData?.state || "",
      country: cityData?.country || "",
      countryCode: cityData?.countryCode || "",
      displayName: cityData?.displayName || cityName || "",
      normalizedCity: cityData?.normalizedCity || cityName || "",
      ...(cityData?.coordinates ? { coordinates: cityData.coordinates } : {}),
      ...(cityData?.geoCode ? { geoCode: cityData.geoCode } : {}),
    },

    checkIn: dayjs().format("YYYY-MM-DD"),
    checkOut: dayjs().add(1, "day").format("YYYY-MM-DD"),
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
    pets: false,
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Hotels",
            item: `${siteUrl}/hotels`,
          },

          {
            "@type": "ListItem",
            position: 3,
            name: cityName,
            item: `${siteUrl}/hotels/${slug}`,
          },
        ],
      },

      {
        "@type": "CollectionPage",
        name: `Hotels in ${cityName}`,
        url: `${siteUrl}/hotels/${slug}`,
        description:
          cms?.metaDescription ||
          `Find hotels in ${cityName} with best prices on PAN Journey.`,
      },

      {
        "@type": "Organization",
        name: "PAN Journey",
        url: siteUrl,
      },
    ],
  };

  const faqBlock = cms?.data?.blocks?.find((block) => block?.type === "faq");
  let faqItems = faqBlock?.data?.items || faqBlock?.data?.faqs || [];

  if (!faqItems.length) {
    faqItems = [
      {
        question: `What are the best areas to stay in ${cityName}?`,
        answer: `The best area depends on your travel needs, budget and nearby attractions in ${cityName}.`,
      },

      {
        question: `When should I book hotels in ${cityName}?`,
        answer: `Booking early is generally recommended during weekends, holidays and peak travel seasons.`,
      },
    ];
  }

  if (faqItems.length) {
    schema["@graph"].push({
      "@type": "FAQPage",

      mainEntity: faqItems.map((item) => ({
        "@type": "Question",

        name: item?.question || "",

        acceptedAnswer: {
          "@type": "Answer",

          text: item?.answer || "",
        },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <HotelContent
        initialSearchData={initialSearchData}
        cms={cms}
        isValidCity={!!cityData?.id}
      />
    </>
  );
}
