"use client";

import { useRouter } from "next/navigation";

export default function HotelNotFound({
  type = "not-found",
  message,
}) {
  const router = useRouter();

  const isError = type === "error";

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white px-6 py-12 text-center shadow-sm md:px-10">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          {isError ? (
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-600"
            >
              <path
                d="M12 8V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M12 16H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M10.3 3.4L2.8 16.4C2.1 17.6 3 19 4.4 19H19.6C21 19 21.9 17.6 21.2 16.4L13.7 3.4C13 2.2 11 2.2 10.3 3.4Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-600"
            >
              <path
                d="M3 21H21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M5 21V9L12 4L19 9V21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M9 21V14H15V21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Heading */}
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 md:text-3xl">
          {isError ? "Hotel Information Unavailable" : "No Hotels Found"}
        </h2>

        {/* Message */}
        <p className="mx-auto mb-8 max-w-lg text-sm leading-6 text-gray-500 md:text-base">
          {message ||
            (isError
              ? "Hotel information is temporarily unavailable. Please try again later."
              : "We couldn't find any hotels for your selected destination and dates. Try changing your destination or search dates to find available hotels.")}
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleHome}
            className="navbar-background-color rounded-lg px-6 py-3 text-sm font-medium text-white! transition hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}