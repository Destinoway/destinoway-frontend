import BusHero from "@/modules/bus/components/home/BusHero";
import BusOffers from "@/modules/bus/components/home/BusOffers";
import BusTrustBar from "@/modules/bus/components/home/BusTrustBar";
import CabinClasses from "@/modules/bus/components/home/CabinClasses";
import RtcPartners from "@/modules/bus/components/home/RtcPartners";
import TrendingRoutes from "@/modules/bus/components/home/TrendingRoutes";
import WhatsNew from "@/modules/bus/components/home/WhatsNew";
import { BUS_FAQ } from "@/modules/bus/data/busHomeData";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

import FAQSection from "@/modules/shared/home/components/FAQSection";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import TestimonialsSection from "@/modules/shared/home/components/TestimonialsSection";

const PAGE_SLUG = "bus";
const SITE_URL = getSiteUrl();

export async function generateMetadata() {
  const cms = await fetchCmsBySlug(PAGE_SLUG);
  const title = cms?.metaTitle || "Bus Ticket Booking Online | Destinoway";
  const description =
    cms?.metaDescription ||
    "Book bus tickets online with Destinoway. AC sleeper, Volvo and state RTC buses with free cancellation, live GPS tracking and exclusive offers.";

  return {
    title,
    description,
    keywords: cms?.keywords || undefined,
    alternates: { canonical: `${SITE_URL}/${PAGE_SLUG}` },
    robots: getRobotsMetadata(),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${PAGE_SLUG}`,
      siteName: "Destinoway",
      type: "website",
      locale: "en_IN",
    },
  };
}

export default async function BusPage() {
  // If a "bus" CMS page is published it supplies the FAQ and extra content;
  // otherwise fall back to the built-in bus FAQs.
  const cms = await fetchCmsBySlug(PAGE_SLUG);
  const cmsHasFaq = cms?.data?.blocks?.some((block) => block.type === "faq");

  return (
    <>
      <BusHero />
      <BusTrustBar />
      <BusOffers />
      <TrendingRoutes />
      <WhatsNew />
      <CabinClasses />
      <RtcPartners />
      <TestimonialsSection />
      {cms && <CMSContentRenderer cms={cms} />}
      {!cmsHasFaq && <FAQSection data={BUS_FAQ} />}
      <NewsletterSection />
    </>
  );
}
