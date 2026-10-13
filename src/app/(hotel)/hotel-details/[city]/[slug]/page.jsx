import { buildCmsMetadata } from "@/modules/cms/seo/cmsSeo";
import {
  buildHotelDescription,
  buildHotelTitle,
} from "@/modules/cms/seo/hotelSeo";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";
import HotelDetails from "@/modules/hotel/pages/hotelDetails";

export async function generateMetadata({ params, searchParams }) {
  const { slug, city } = await params;

  const query = await searchParams;

  const preview = query?.preview === "true";

  const cms = await fetchCmsBySlug(slug, preview);

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
  const hotelSlug =
    slug?.replace(/-/g, " ")?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Hotel";
  const canonical = `${siteUrl}/hotel-details/${city}/${slug}`;
  const cityName =
    city?.replace(/-/g, " ")?.replace(/\b\w/g, (l) => l.toUpperCase()) || "";
  return {
    metadataBase: new URL(siteUrl),
    title: buildHotelTitle(hotelSlug, cityName),
    description: buildHotelDescription(hotelSlug, city),
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
    openGraph: {
      title: buildHotelTitle(hotelSlug, cityName),
      description: buildHotelDescription(hotelSlug, city),
      url: canonical,
      siteName: "PAN Journey",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: buildHotelTitle(hotelSlug, cityName),
      description: buildHotelDescription(hotelSlug, city),
    },
    creator: "PAN Journey",
    publisher: "PAN Journey",
  };
}

export default async function Page({ params, searchParams }) {
  const { slug, city } = await params;
  const query = await searchParams;
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const preview = query?.preview === "true";

  const cms = await fetchCmsBySlug(slug, preview);
  const hotelName =
    cms?.data?.hotelMeta?.hotelName ||
    slug?.replace(/-/g, " ")?.replace(/\b\w/g, (l) => l.toUpperCase());

  const schema = cms?.schema || {
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
            name: city?.replace(/-/g, " ") || "",
            item: `${siteUrl}/hotels/${city}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: hotelName,
            item: `${siteUrl}/hotel-details/${city}/${slug}`,
          },
        ],
      },

      {
        "@type": "Hotel",

        name: hotelName,

        description:
          cms?.metaDescription ||
          "Hotel details and booking information on PAN Journey.",

        url: `${siteUrl}/hotel-details/${city}/${slug}`,

        image: cms?.data?.hotelMeta?.image || cms?.data?.hotelMeta?.images?.[0],

        address: {
          "@type": "PostalAddress",

          addressLocality:
            cms?.data?.cityMeta?.destination || city?.replace(/-/g, " "),
        },

        starRating: cms?.data?.hotelMeta?.starRating
          ? {
              "@type": "Rating",
              ratingValue: cms?.data?.hotelMeta?.starRating,
            }
          : undefined,

        priceRange: cms?.data?.hotelMeta?.priceRange || undefined,

        amenityFeature: cms?.data?.hotelMeta?.amenities?.length
          ? cms.data.hotelMeta.amenities.map((item) => ({
              "@type": "LocationFeatureSpecification",

              name: item,
              value: true,
            }))
          : undefined,

        aggregateRating: cms?.data?.hotelMeta?.rating
          ? {
              "@type": "AggregateRating",

              ratingValue: cms.data.hotelMeta.rating,

              reviewCount: cms.data.hotelMeta.reviews || 1,
            }
          : undefined,

        publisher: {
          "@type": "Organization",

          name: "PAN Journey",
        },
      },

      {
        "@type": "Organization",
        name: "PAN Journey",
        url: siteUrl,
      },
    ],
  };
  const hotelId = cms?.entityId || query?.hid;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <HotelDetails
        initialPayload={{
          hotelId,
          searchId: query?.searchId || "",
          supplierHotelId: query?.supplierHotelId || "",
          hotelDetailId: query?.hotelDetailId || "",
          hotelMeta: {
            hotelName: cms?.data?.hotelMeta?.hotelName || hotelName,
            hotelSlug: slug,
            cityId: cms?.data?.cityMeta?.cityId,
            stateName: cms?.data?.cityMeta?.stateName,
            countryCode: cms?.data?.cityMeta?.countryCode,
          },
          searchContext: {
            fullName: cms?.data?.hotelMeta?.hotelName || hotelName,
          },
        }}
        cms={cms}
      />
    </>
  );
}
