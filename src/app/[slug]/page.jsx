import CMSPageLayout from "@/modules/cms/layouts/CMSPageLayout";
import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import { buildCmsMetadata } from "@/modules/cms/seo/cmsSeo";
import { fetchCmsBySlug } from "@/modules/cms/services/cmsFetch";
import { redirectIfCmsMoved } from "@/modules/cms/services/cmsRedirect";
import { buildRequestedPath } from "@/modules/cms/utils/redirectPath";
import { getRobotsMetadata } from "@/modules/cms/utils/seoUrl";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cms = await fetchCmsBySlug(slug);
  // Missing page renders not-found: don't inherit the root "index, follow".
  if (!cms) return { title: "Page Not Found", robots: getRobotsMetadata({ noindex: true }) };
  return buildCmsMetadata(cms);
}
export default async function CMSPage({ params }) {
  const { slug } = await params;
  const cms = await fetchCmsBySlug(slug);
  if (!cms) {
    await redirectIfCmsMoved(buildRequestedPath(slug));
    notFound();
  }

  return (
    <CMSPageLayout cms={cms}>
      <CMSContentRenderer cms={cms} primaryHeading />
    </CMSPageLayout>
  );
}
