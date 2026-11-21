import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import GrievanceHero from "@/modules/shared/pages/grievance/grievanceHero";
import GrievanceOfficerAndFormSection from "@/modules/shared/pages/grievance/GrievanceOfficerAndFormSection";
import GrievanceProcessSection from "@/modules/shared/pages/grievance/grievanceProcessSection";
import ResolutionTimelineSection from "@/modules/shared/pages/grievance/ResolutionTimelineSection";
import { getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Grievance Redressal",
  description:
    "Submit and track grievances related to bookings, refunds, payments, and customer support. Destinoway grievance redressal process.",
  // Without this the page inherits the root layout canonical ("/") and points at the homepage.
  alternates: {
    canonical: `${getSiteUrl()}/grievance-redressal`,
  },
  openGraph: {
    title: "Grievance Redressal | Destinoway",
    description:
      "Submit and track grievances related to bookings, refunds, payments, and customer support. Destinoway grievance redressal process.",
    url: `${getSiteUrl()}/grievance-redressal`,
    siteName: "Destinoway",
    type: "website",
  },
};

export default function GrievancePage() {
  return (
    <>
      <GrievanceHero />
      <section className="bg-[#eef5fa] pt-21 lg:pt-28">
        <GrievanceProcessSection />
      </section>

      <GrievanceOfficerAndFormSection />
      <ResolutionTimelineSection />
      <NewsletterSection />
    </>
  );
}
