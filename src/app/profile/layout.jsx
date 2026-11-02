import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Your Account | Destonoway",
  alternates: { canonical: `${siteUrl}/profile` },
  robots: getRobotsMetadata({ noindex: true }),
};

export default function ProfileLayout({ children }) {
  return children;
}
