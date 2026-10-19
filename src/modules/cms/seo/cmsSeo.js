export const buildCmsMetadata = (cms) => {
  if (!cms) {
    return {};
  }

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const slug = cms?.slug || "";

  /*
CANONICAL
*/
  let canonical = siteUrl;

  switch (cms?.entityType) {
    case "hotelCity":
      canonical = `${siteUrl}/hotels/${slug}`;
      break;

    case "hotel": {
      const citySlug = String(cms?.data?.cityMeta?.destination || "")
        .split(",")[0]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      canonical = citySlug
        ? `${siteUrl}/hotel-details/${citySlug}/${slug}`
        : `${siteUrl}/hotel-details/${slug}`;
      break;
    }

    case "city":
      canonical = `${siteUrl}/hotels/${slug}`;
      break;

    case "marketing":
      canonical = `${siteUrl}/${slug}`;
      break;

    case "static":
      canonical = `${siteUrl}/${slug}`;
      break;

    default:
      canonical = `${siteUrl}/${slug}`;
  }
  /*
  BASIC
  */
  const title = cms?.metaTitle || cms?.title || "Destonoway";

  const description =
    cms?.metaDescription ||
    "Find hotels, destinations and travel experiences on Destonoway.";

  const keywords = Array.isArray(cms?.keywords) ? cms.keywords : [];

  const image =
    cms?.data?.heroImage ||
    cms?.data?.bannerImage ||
    cms?.data?.coverImage ||
    "/images/default-og.jpg";

  const robots = {
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
  };

  return {
    /*
    BASE
    */
    metadataBase: new URL(siteUrl),

    /*
    BASIC SEO
    */
    title,
    description,
    keywords,

    /*
    CANONICAL
    */
    alternates: {
      canonical: new URL(canonical),
    },

    /*
    ROBOTS
    */
    robots,

    /*
    AUTHOR
    */
    authors: [
      {
        name: "Destonoway",
      },
    ],

    creator: "Destonoway",

    publisher: "Destonoway",

    category: "travel",

    /*
    OPEN GRAPH
    */
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Destonoway",
      type: "website",
      locale: "en_IN",

      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },

    /*
    TWITTER
    */
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },

    /*
    EXTRA
    */
    other: {
      schema: cms?.schema ? JSON.stringify(cms.schema) : null,
    },
  };
};
