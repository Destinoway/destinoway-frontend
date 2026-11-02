export const revalidate = 3600;
import Herobanner from "@/modules/shared/home/components/cashback_sections/OfferBanner";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import TestimonialsSection from "@/modules/shared/home/components/TestimonialsSection";
import WhySection from "@/modules/shared/home/components/why_sections/WhySection";

import AboutContent from "@/modules/shared/pages/about-us/AboutContent";
import AboutHero from "@/modules/shared/pages/about-us/AboutHero";
import JourneySection from "@/modules/shared/pages/about-us/JourneySection";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const PAGE_SLUG = "about-us";

/*
|--------------------------------------------------------------------------
| SEO Metadata From CMS
|--------------------------------------------------------------------------
*/
export async function generateMetadata() {
  const cms = await fetchCmsBySlug(PAGE_SLUG);

  const title =
    cms?.metaTitle ||
    "About Destonoway | Trusted Travel & Hotel Booking Platform";

  const description =
    cms?.metaDescription || "Learn about Destonoway and our travel mission.";

  const keywords = cms?.keywords || [];
  const canonical = `${getSiteUrl()}/${cms?.slug || PAGE_SLUG}`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords,

    alternates: {
      canonical,
    },
    robots: getRobotsMetadata(),

    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Destonoway",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/*
|--------------------------------------------------------------------------
| About Page
|--------------------------------------------------------------------------
*/
export default async function AboutUsPage() {
  const cms = await fetchCmsBySlug(PAGE_SLUG);

  /*
  |--------------------------------------------------------------------------
  | FAQ Schema From CMS
  |--------------------------------------------------------------------------
  */
  const faqBlock = cms?.data?.blocks?.find((block) => block?.type === "faq");

  const faqs = faqBlock?.data?.items || [];

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq?.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq?.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* Static Sections */}
      <AboutHero />
      <AboutContent />
      <JourneySection />

      {/* CMS Dynamic Blocks (FAQ etc.) */}
      <CMSContentRenderer cms={cms} />

      <WhySection />
      <Herobanner />

      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
