export const revalidate = 3600;
import Herobanner from "@/modules/shared/home/components/cashback_sections/OfferBanner";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import TestimonialsSection from "@/modules/shared/home/components/TestimonialsSection";
import WhySection from "@/modules/shared/home/components/why_sections/WhySection";

import AboutContent from "@/modules/shared/pages/about-us/AboutContent";
import AboutHero from "@/modules/shared/pages/about-us/AboutHero";
import JourneySection from "@/modules/shared/pages/about-us/JourneySection";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { getCmsBySlug } from "@/modules/cms/services/cms.service";

const PAGE_SLUG = "about-us";

/*
|--------------------------------------------------------------------------
| SEO Metadata From CMS
|--------------------------------------------------------------------------
*/
export async function generateMetadata() {
  const cms = await getCmsBySlug(PAGE_SLUG);

  const title =
    cms?.metaTitle ||
    "About PAN Journey | Trusted Travel & Hotel Booking Platform";

  const description =
    cms?.metaDescription || "Learn about PAN Journey and our travel mission.";

  const keywords = cms?.keywords || [];

  const canonical = `https://destinoway.com/${cms?.slug || PAGE_SLUG}`;

  return {
    title,
    description,
    keywords,

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
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "PAN Journey",
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
  const cms = await getCmsBySlug(PAGE_SLUG);

  console.log("LIVE FAQ", cms?.data?.blocks?.[0]?.data?.items?.[0]);

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
