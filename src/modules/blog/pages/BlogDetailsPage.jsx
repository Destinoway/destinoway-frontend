"use client";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";

import CMSContentRenderer from "@/modules/cms/renderer/CMSContentRenderer";
import NewsletterSection from "@/modules/shared/home/components/NewsletterSection";

const BlogDetailsPage = ({ blog }) => {
  const router = useRouter();

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.description || "",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // Share cancelled
    }
  };

  const formattedDate = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const authorName = blog?.createdByName || "Destonoway";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#092f49]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          {blog?.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title || ""}
              className="h-full w-full object-cover opacity-50"
            />
          )}
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-[#06283d]/30" />

        {/* HERO CONTENT */}
        <div className="relative mx-auto flex min-h-[320px] w-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="most-text-color !mb-5 flex w-fit cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm font-semibold transition-all duration-200 hover:text-white"
          >
            <ArrowLeftOutlined />
            Back to Blogs
          </button>

          {/* CATEGORY */}
          {blog?.categoryName && (
            <span className="w-fit rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
              {blog.categoryName}
            </span>
          )}

          {/* TITLE */}
          <h1 className="!mt-4 max-w-4xl !text-[30px] leading-[1.15] font-bold tracking-tight text-white sm:text-[40px] lg:text-[48px]">
            {blog.title}
          </h1>

          {/* DESCRIPTION */}
          {blog?.description && (
            <p className="mt-3 max-w-3xl text-[14px] leading-6 text-white/75 sm:text-[15px]">
              {blog.description}
            </p>
          )}

          {/* META */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/70">
            {formattedDate && (
              <span className="flex items-center gap-1.5">
                <CalendarOutlined />
                {formattedDate}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <UserOutlined />
              {authorName}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MAIN CONTENT                                                  */}
      {/* ============================================================ */}

      <main className="bg-[#f8fafc]">
        <article className="min-w-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-[0_5px_22px_rgba(0,0,0,0.05)]">
          {/* CMS CONTENT */}

          <CMSContentRenderer cms={blog} />

          {/* AUTHOR */}

          <div className="flex flex-col gap-4 rounded-[18px] border border-gray-100 bg-[#fafcff] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf6ff] text-lg text-[#008cff]">
                <UserOutlined />
              </div>

              <div>
                <p className="text-[12px] text-gray-400">Written by</p>

                <p className="text-[15px] font-bold text-[#172033]">
                  {authorName}
                </p>

                <p className="text-[12px] text-gray-400">
                  Travel & Destination Guide
                </p>
              </div>
            </div>

            <Button
              onClick={handleShare}
              icon={<ShareAltOutlined />}
              className="!h-[42px] !rounded-lg !border-gray-200 !font-semibold"
            >
              Share Article
            </Button>
          </div>

          {/* BOTTOM NAVIGATION */}
        </article>
      </main>

      <NewsletterSection />
    </>
  );
};

export default BlogDetailsPage;
