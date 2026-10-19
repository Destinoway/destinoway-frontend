import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";
import GrievanceHero from "@/modules/shared/pages/grievance/grievanceHero";
import GrievanceOfficerAndFormSection from "@/modules/shared/pages/grievance/GrievanceOfficerAndFormSection";
import GrievanceProcessSection from "@/modules/shared/pages/grievance/grievanceProcessSection";
import ResolutionTimelineSection from "@/modules/shared/pages/grievance/ResolutionTimelineSection";

export const metadata = {
  title: "Grievance Redressal | Destonoway",
  description:
    "Submit and track grievances related to bookings, refunds, payments, and customer support. Destonoway grievance redressal process.",
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
