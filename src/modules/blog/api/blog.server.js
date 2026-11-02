import { serverApi } from "@/services/serverApi";
import { cache } from "react";

export const fetchBlogBySlug = cache(async (slug) => {
  try {
    const response = await serverApi.get("/cms/blogs", {
      params: {
        slug,
      },
    });

    if (!response?.data?.success) {
      return null;
    }

    return response.data.data;
  } catch {
    console.error("Blog detail could not be loaded.");

    return null;
  }
});

export const fetchAllPublicBlogs = async () => {
  const blogs = [];
  const limit = 100;
  let page = 1;
  let pages = 1;

  try {
    while (page <= pages) {
      const response = await serverApi.get("/cms/blogs", {
        params: { page, limit },
      });
      const data = response?.data?.data;
      const pageBlogs = Array.isArray(data?.blogs) ? data.blogs : [];
      blogs.push(...pageBlogs);
      pages = Math.max(1, Number(data?.pagination?.pages) || 1);
      page += 1;
      if (!pageBlogs.length) break;
    }
    return blogs;
  } catch {
    console.error("Public blog sitemap entries could not be loaded.");
    return blogs;
  }
};
