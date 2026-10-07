import Herobanner from "@/modules/shared/home/components/cashback_sections/OfferBanner";
import ComingSoonSection from "@/modules/shared/home/components/ComingSoonSection";
import DestinationsSection from "@/modules/shared/home/components/DestinationsSection";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import TestimonialsSection from "@/modules/shared/home/components/TestimonialsSection";
import TopRatedHotels from "@/modules/shared/home/components/TopRatedHotels";
import VacationSection from "@/modules/shared/home/components/vacation_sections/VacationSection";
import WhySection from "@/modules/shared/home/components/why_sections/WhySection";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";

import ScrollToTopButton from "@/modules/hotel/ScrollToTopButton";

import GiftCardSlider from "@/modules/shared/home/components/hero_section/GiftCardSlider";
import Hero from "@/modules/shared/home/components/hero_section/Hero";
import TrustSection from "@/modules/shared/home/components/hero_section/TrustSection";

import { fetchHomeContent } from "@/modules/shared/home/services/homeContentFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const OG_IMAGE = `${SITE_URL}/images/OGIMAGE1.png`;

export async function generateMetadata() {
  const homeCms = await fetchCmsBySlug("home");
  const title =
    homeCms?.metaTitle ||
    "PAN Journey – Book Hotels, Flights & Travel Deals Online";
  const description =
    homeCms?.metaDescription ||
    "Book hotels, flights and travel packages with PAN Journey.";
  const keywords = Array.isArray(homeCms?.keywords)
    ? homeCms.keywords.join(", ")
    : homeCms?.keywords || undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: SITE_URL,
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
      title,
      description,
      url: SITE_URL,
      siteName: "PAN Journey",
      type: "website",
      locale: "en_IN",

      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "PAN Journey - Travel & Booking",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function Page() {
  const [homeCms, homeContent] = await Promise.all([
    fetchCmsBySlug("home"),
    fetchHomeContent(),
  ]);

  const { banner, placesAsPerYourVibe, topRatedHotels, popularDestinations } =
    homeContent ?? {};
  const faqBlock = homeCms?.data?.blocks?.find((block) => block.type === "faq");
  const faqItems = faqBlock?.data?.items ?? [];

  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",

          mainEntity: faqItems.map((item) => ({
            "@type": "Question",

            name: item.question,

            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PAN Journey",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/hotels?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PAN Journey",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgSchema),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <ScrollToTopButton />
      <Hero banner={banner} />
      <TrustSection />
      {/* <GiftCardSlider /> */}
      <VacationSection vibes={placesAsPerYourVibe} />
      <Herobanner />
      <WhySection />
      <TopRatedHotels hotels={topRatedHotels} />
      <ComingSoonSection />
      <TestimonialsSection />
      <DestinationsSection destinations={popularDestinations} />
      {homeCms && <CMSContentRenderer cms={homeCms} />}
      <NewsletterSection />
    </>
  );
}
