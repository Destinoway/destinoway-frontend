import { notFound } from "next/navigation";

import { fetchBlogBySlug } from "@/modules/blog/api/blog.server";
import BlogDetailsPage from "@/modules/blog/pages/BlogDetailsPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {};
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.description,

    keywords: Array.isArray(blog.keywords) ? blog.keywords : undefined,

    alternates: {
      canonical: `https://destinoway.com/blog/${blog.slug}`,
    },

    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.description,
      url: `https://destinoway.com/blog/${blog.slug}`,

      ...(blog.featuredImage
        ? {
            images: [
              {
                url: blog.featuredImage,
                alt: blog.title,
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
    notFound();
  }

  return <BlogDetailsPage blog={blog} />;
}
