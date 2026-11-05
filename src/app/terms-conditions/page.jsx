import TermsBanner from "@/modules/shared/pages/Terms & Conditions/TermsBanner";
import TermsContent from "@/modules/shared/pages/Terms & Conditions/TermsContent";
import { getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for using Destinoway travel booking services.",
  alternates: {
    canonical: `${getSiteUrl()}/terms-conditions`,
  },
  openGraph: {
    title: "Terms & Conditions | Destinoway",
    description:
      "Read the terms and conditions for using Destinoway travel booking services.",
    url: `${getSiteUrl()}/terms-conditions`,
    type: "website",
    siteName: "Destinoway",
  },
};

export default function TermsConditionsPages() {
  return (
    <>
      <TermsBanner />
      <TermsContent />
    </>
  );
}
