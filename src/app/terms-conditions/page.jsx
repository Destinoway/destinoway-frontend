import TermsBanner from "@/modules/shared/pages/Terms & Conditions/TermsBanner";
import TermsContent from "@/modules/shared/pages/Terms & Conditions/TermsContent";
import { getSiteUrl } from "@/modules/cms/utils/seoUrl";

export const metadata = {
  title: "Terms & Conditions | Destonoway",
  description:
    "Read the terms and conditions for using Destonoway travel booking services.",
  alternates: {
    canonical: `${getSiteUrl()}/terms-conditions`,
  },
  openGraph: {
    title: "Terms & Conditions | Destonoway",
    description:
      "Read the terms and conditions for using Destonoway travel booking services.",
    url: `${getSiteUrl()}/terms-conditions`,
    type: "website",
    siteName: "Destonoway",
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
