/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // DummyJSON serves product images from these hosts
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "i.dummyjson.com" },
    ],
  },
};

module.exports = nextConfig;
