import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

// Rendered for unmatched URLs and every notFound() call.
// No automatic redirect to "/": redirecting a missing URL to the homepage is
// treated by search engines as a soft 404. Next.js adds <meta name="robots"
// content="noindex"> to this page automatically.
export default function NotFound() {
  return (
    <div className="flex min-h-125 w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white px-6 py-12 text-center shadow-sm md:px-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-600"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9 9L13 13M13 9L9 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <p className="mb-2 text-sm font-medium tracking-wide text-blue-600">404</p>

        <h1 className="mb-3 text-2xl font-semibold text-gray-900 md:text-3xl">
          Page Not Found
        </h1>

        <p className="mx-auto mb-8 max-w-lg text-sm leading-6 text-gray-500 md:text-base">
          The page you are looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="navbar-background-color rounded-lg px-6 py-3 text-sm font-medium text-white! transition hover:bg-blue-700"
          >
            Go to Home
          </Link>
          <Link
            href="/blog"
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Read Our Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
