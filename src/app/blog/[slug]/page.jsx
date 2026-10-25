import { notFound } from "next/navigation";

import { redirectIfCmsMoved } from "@/modules/cms/services/cmsRedirect";
import { resolveSavedCanonical } from "@/modules/cms/utils/canonical";
import { buildRequestedPath } from "@/modules/cms/utils/redirectPath";

import { fetchBlogBySlug } from "@/modules/blog/api/blog.server";
import BlogDetailsPage from "@/modules/blog/pages/BlogDetailsPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {};
  }

  const selfUrl = `https://destinoway.com/blog/${blog.slug}`;
  const canonical =
    resolveSavedCanonical(blog.canonicalUrl, "https://destinoway.com") ||
    selfUrl;

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.description,

    keywords: Array.isArray(blog.keywords) ? blog.keywords : undefined,

    alternates: {
      canonical,
    },

    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.description,
      url: canonical,

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
