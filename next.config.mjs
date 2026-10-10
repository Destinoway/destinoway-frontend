import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "panjourney-media-dev.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // Hotel API Images
      {
        protocol: "https",
        hostname: "i.travelapi.com",
      },
      {
        protocol: "https",
        hostname: "hg-static.hyperguest.com",
      },
      {
        protocol: "https",
        hostname: "hotel-extranet-new.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "rukmini-ct.flixcart.com",
      },
      {
        protocol: "https",
        hostname: "photos.hotelbeds.com",
      },
      {
        protocol: "https",
        hostname: "static-images.webbeds.com",
      },
      {
        protocol: "https",
        hostname: "cdn.xconnect.in",
      },
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "pix8.agoda.net",
      },
      {
        protocol: "https",
        hostname: "www.tboholidays.com",
      },
    ],

    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60 * 60 * 24 * 30,

    deviceSizes: [320, 420, 640, 768, 1024, 1200, 1440, 1920],

    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default withBundleAnalyzer(nextConfig);
