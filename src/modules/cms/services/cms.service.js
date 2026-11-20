import { serverApi } from "@/services/serverApi";

/*
GET BY SLUG
*/
export const getCmsBySlug = async (slug, preview = false) => {
  const query = preview ? "?preview=true" : "";
  const response = await serverApi.get(`/cms/page/${slug}${query}`);
  return response?.data?.data;
};

/*
GET ALL CMS
PUBLIC
SITEMAP
*/
export const getAllCmsPages = async () => {
  const response = await serverApi.get("/cms/public/pages?limit=5000");
  const pages = response?.data?.data?.data;
  return Array.isArray(pages) ? pages : [];
};
