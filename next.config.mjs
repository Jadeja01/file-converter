/** @type {import('next').NextConfig} */

// next.config.js
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // You can increase it to 10mb or more
    },
  },
  images: {
    domains: ["cdn.buymeacoffee.com"],
  }
};

export default nextConfig;
