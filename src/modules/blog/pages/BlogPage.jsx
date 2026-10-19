"use client";

import {
  ArrowRightOutlined,
  CalendarOutlined,
  CloseCircleFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useBlogCategories } from "@/modules/blog/hooks/useBlogCategories";
import { useBlogs } from "@/modules/blog/hooks/useBlogs";
import { mapBlog } from "@/modules/blog/utils/blogMapper";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";

/* -------------------------------------------------------------------------- */
/*                              BLOG CARD                                     */
/* -------------------------------------------------------------------------- */

const BlogCard = ({ blog, onClick }) => {
  return (
    <article className="group overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]">
      {/* IMAGE */}
      <div className="relative h-[210px] w-full overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />

        {/* CATEGORY */}
        <span className="most-text-color absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow-sm">
          {blog.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* META */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-400">
          <span className="flex items-center gap-1">
            <CalendarOutlined />
            {blog.date}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="group-hover:most-text-color mt-3 line-clamp-2 min-h-[52px] text-[19px] leading-[1.35] font-bold transition-colors duration-200">
          {blog.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-gray-500">
          {blog.description}
        </p>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="most-text-color flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef6fb] text-[13px]">
              <UserOutlined />
            </span>

            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#555]">
                {blog.author}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onClick(blog)}
            className="most-text-color flex shrink-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] font-bold transition-all duration-200 hover:gap-2.5"
          >
            Read More
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*                              BLOG PAGE                                      */
/* -------------------------------------------------------------------------- */

const BlogPage = () => {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* -------------------------------------------------------------------------- */
  /*                              CATEGORIES                                    */
  /* -------------------------------------------------------------------------- */

  const { data: categoryResponse, isLoading: categoriesLoading } =
    useBlogCategories();

  const categories = categoryResponse?.data?.data || [];

  /* -------------------------------------------------------------------------- */
  /*                                BLOGS                                       */
  /* -------------------------------------------------------------------------- */

  const {
    data: blogsResponse,
    isLoading: blogsLoading,
    isFetching: blogsFetching,
  } = useBlogs({
    categoryId: activeCategory,
    search,
    page,
    limit: 10,
  });

  const blogs = blogsResponse?.data?.data?.blogs || [];

  const pagination = blogsResponse?.data?.data?.pagination || {};

  const mappedBlogs = blogs.map(mapBlog);

  /* -------------------------------------------------------------------------- */
  /*                              BLOG OPEN                                     */
  /* -------------------------------------------------------------------------- */

  const handleBlogClick = (blog) => {
    router.push(`/blog/${blog.slug}`);
  };
  return (
    <>
      <main className="min-h-screen w-full bg-[#f6f9fb]">
        {/* ==================================================================== */}
        {/* HERO                                                                 */}
        {/* ==================================================================== */}

        <section className="relative overflow-hidden">
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 overflow-hidden bg-[#092f49]">
            <img
              src="/images/heroimage.jpg"
              alt="Travel"
              className="h-full w-full object-cover object-center !opacity-50"
            />

            {/* White filter on image */}
            <div className="absolute inset-0 bg-white/30" />
          </div>

          {/* OVERLAY */}
          <div className="absolute inset-0" />

          {/* HERO CONTENT */}
          <div className="relative mx-auto flex min-h-[300px] w-full max-w-7xl flex-col items-start justify-center px-4 py-10 text-left sm:px-6 lg:px-8">
            <span className="rounded-full bg-white/8 px-4 py-2 text-[12px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
              Destonoway TRAVEL BLOG
            </span>

            <h1 className="!mt-4 max-w-4xl !text-[30px] leading-[1.12] font-bold tracking-tight text-white sm:text-[44px] lg:text-[52px]">
              Explore. Discover.
              <span className="most-text-color block">Travel More.</span>
            </h1>

            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-white/34 sm:text-[16px]">
              Discover travel inspiration, destination guides, hotel tips and
              useful ideas to make your next journey unforgettable.
            </p>

            {/* SEARCH */}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* MAIN                                                                  */}
        {/* ==================================================================== */}

        <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-5 md:py-0 lg:px-6 xl:px-0">
          <section className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="!most-text-color text-[12px] font-bold tracking-wider uppercase">
                  Explore
                </p>

                <h2 className="; text-[25px] font-bold text-[#172033]">
                  Browse by Category
                </h2>
              </div>

              <div className="most-boder-colour flex h-[52px] w-full max-w-[320px] items-center rounded-full border bg-white px-4">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search travel articles..."
                  className="h-full min-w-0 flex-1 border-none bg-transparent px-2 text-[14px] outline-none"
                />

                {/* CLEAR SEARCH */}
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="mr-2 flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <CloseCircleFilled className="text-[18px]" />
                  </button>
                )}

                <div className="mx-3 h-7 w-px bg-gray-400" />

                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("latest-articles")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="flex shrink-0 items-center justify-center border-0 bg-transparent p-1"
                  aria-label="Search articles"
                >
                  <SearchOutlined className="text-[24px] text-[#222]" />
                </button>
              </div>
            </div>

            {/* DESKTOP CATEGORY BUTTONS */}
            <div className="hidden flex-wrap gap-2 sm:flex">
              {/* ALL */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setPage(1);
                }}
                className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  activeCategory === null
                    ? "buttion-background-color border-transparent !text-white shadow-sm"
                    : "hover:most-text-color border-gray-200 bg-white text-[#555] hover:border-[#008cff]"
                }`}
              >
                All
              </button>

              {/* API CATEGORIES */}
              {categories.map((category) => {
                const active = activeCategory === category._id;

                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category._id);
                      setPage(1);
                    }}
                    className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                      active
                        ? "buttion-background-color border-transparent !text-white shadow-sm"
                        : "hover:most-text-color border-gray-200 bg-white text-[#555] hover:border-[#008cff]"
                    }`}
                  >
                    {category.placeName}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ================================================================== */}
          {/* LATEST ARTICLES                                                    */}
          {/* ================================================================== */}

          <section id="latest-articles" className="mt-10 scroll-mt-24">
            <div className="mb-1 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[25px] font-bold text-[#172033] sm:text-[30px]">
                  Latest Articles
                </h2>
              </div>

              <span className="hidden text-sm text-gray-400 sm:block">
                {pagination.total || 0} articles
              </span>
            </div>

            {blogsLoading ? (
              <div className="py-16 text-center text-gray-500">
                Loading articles...
              </div>
            ) : mappedBlogs.length > 0 ? (
              <div className="relative">
                {blogsFetching && (
                  <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/40 pt-10 backdrop-blur-[1px]">
                    <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow">
                      Loading...
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {mappedBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onClick={handleBlogClick}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[18px] bg-white px-5 py-16 text-center shadow-sm">
                <div className="most-text-color mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6fb] text-xl">
                  <SearchOutlined />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#172033]">
                  No articles found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try another search or choose a different category.
                </p>

                <Button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory(null);
                    setPage(1);
                  }}
                  className="mt-4 !rounded-lg"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </section>

          {/* ================================================================== */}
          {/* POPULAR DESTINATIONS                                               */}
          {/* ================================================================== */}

          <section className="mt-12">
            <div className="mb-5">
              <p className="most-text-color text-[12px] font-bold tracking-wider uppercase">
                Inspiration
              </p>

              <h2 className="mt-1 text-[25px] font-bold text-[#172033] sm:text-[30px]">
                Popular Destinations
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  name: "Goa",
                  image:
                    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Manali",
                  image:
                    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Jaipur",
                  image:
                    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Kerala",
                  image:
                    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Kashmir",
                  image:
                    "https://images.unsplash.com/photo-1595815771614-ade9d0c6b8a4?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Udaipur",
                  image:
                    "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=600&q=80",
                },
              ].map((destination) => (
                <button
                  key={destination.name}
                  type="button"
                  className="group relative h-[145px] overflow-hidden rounded-[15px] border-0 bg-gray-200 text-left"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <span className="absolute bottom-3 left-3 text-[15px] font-bold text-white">
                    {destination.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ================================================================== */}
          {/* NEWSLETTER                                                         */}
          {/* ================================================================== */}
        </div>
      </main>
      <NewsletterSection />
    </>
  );
};

export default BlogPage;
