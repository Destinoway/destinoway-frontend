import { resolveSavedCanonical } from "../utils/canonical";
import {
  buildPageTitle,
  joinSiteUrl,
  normalizeSiteUrl,
  titleToText,
} from "../utils/seoUrl";

export const buildCmsMetadata = (cms) => {
  if (!cms) {
    return {};
  }

  const siteUrl = normalizeSiteUrl(process.env.NEXTAUTH_URL);

  const slug = cms?.slug || "";

  /*
CANONICAL
*/
  let canonical = siteUrl;

  switch (cms?.entityType) {
    case "hotelCity":
      canonical = joinSiteUrl(siteUrl, "hotels", slug);
      break;

    case "hotel": {
      const citySlug = String(cms?.data?.cityMeta?.destination || "")
        .split(",")[0]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      canonical = citySlug
        ? joinSiteUrl(siteUrl, "hotel-details", citySlug, slug)
        : joinSiteUrl(siteUrl, "hotel-details", slug);
      break;
    }

    case "city":
      canonical = joinSiteUrl(siteUrl, "hotels", slug);
      break;

    case "marketing":
      canonical = joinSiteUrl(siteUrl, slug);
      break;

    case "static":
      canonical = joinSiteUrl(siteUrl, slug);
      break;

    default:
      canonical = joinSiteUrl(siteUrl, slug);
  }
  canonical = resolveSavedCanonical(cms?.canonicalUrl, siteUrl) || canonical;

  /*
  BASIC
  */
  const title = buildPageTitle(cms?.metaTitle || cms?.title);
  const titleText = titleToText(title);

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
      // Must stay a string: Next treats a URL instance as a base and swaps in the page pathname.
      canonical,
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
      title: titleText,
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
              alt: titleText,
            },
          ]
        : [],
    },

    /*
    TWITTER
    */
    twitter: {
      card: "summary_large_image",
      title: titleText,
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
