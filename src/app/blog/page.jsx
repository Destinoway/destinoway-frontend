import BlogPage from "@/modules/blog/pages/BlogPage";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Travel Blog | Destonoway",
  description:
    "Explore travel guides, hotel tips and destination inspiration from Destonoway.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  robots: getRobotsMetadata(),
  openGraph: {
    title: "Travel Blog | Destonoway",
    description:
      "Explore travel guides, hotel tips and destination inspiration from Destonoway.",
    url: `${siteUrl}/blog`,
    siteName: "Destonoway",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Travel Blog | Destonoway",
    description:
      "Explore travel guides, hotel tips and destination inspiration from Destonoway.",
  },
};

export default function Blog() {
  return <BlogPage />;
}
