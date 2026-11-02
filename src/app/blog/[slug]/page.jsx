import { notFound } from "next/navigation";

import { redirectIfCmsMoved } from "@/modules/cms/services/cmsRedirect";
import { resolveSavedCanonical } from "@/modules/cms/utils/canonical";
import { buildRequestedPath } from "@/modules/cms/utils/redirectPath";
import { getRobotsMetadata, getSiteUrl } from "@/modules/cms/utils/seoUrl";

import { fetchBlogBySlug } from "@/modules/blog/api/blog.server";
import BlogDetailsPage from "@/modules/blog/pages/BlogDetailsPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const selfUrl = `${siteUrl}/blog/${encodeURIComponent(blog.slug)}`;
  const savedCanonical = resolveSavedCanonical(blog.canonicalUrl, siteUrl);
  const canonical =
    savedCanonical && new URL(savedCanonical).origin === new URL(siteUrl).origin
      ? savedCanonical
      : selfUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.description,

    keywords: Array.isArray(blog.keywords) ? blog.keywords : undefined,

    alternates: {
      canonical,
    },
    robots: getRobotsMetadata(),

    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.description,
      url: canonical,
      siteName: "Destonoway",
      type: "article",

      ...(blog.featuredImage
        ? {
            images: [
              {
                url: blog.featuredImage,
                alt: blog.featuredImageAlt || blog.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: blog.featuredImage ? "summary_large_image" : "summary",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.description,
      ...(blog.featuredImage ? { images: [blog.featuredImage] } : {}),
    },
  };
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;

  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    await redirectIfCmsMoved(buildRequestedPath("blog", slug));
    notFound();
  }

  return <BlogDetailsPage blog={blog} />;
}
