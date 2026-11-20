import BlogPage from "@/modules/blog/pages/BlogPage";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Travel Blog",
  description:
    "Explore travel guides, hotel tips and destination inspiration from Destinoway.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  robots: getRobotsMetadata(),
  openGraph: {
    title: "Travel Blog | Destinoway",
    description:
      "Explore travel guides, hotel tips and destination inspiration from Destinoway.",
    url: `${siteUrl}/blog`,
    siteName: "Destinoway",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Travel Blog | Destinoway",
    description:
      "Explore travel guides, hotel tips and destination inspiration from Destinoway.",
  },
};

export default function Blog() {
  return <BlogPage />;
}
