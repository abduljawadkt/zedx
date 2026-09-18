/** @type {import("next").NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      // Medusa product images: Medusa Cloud S3 bucket + repo raw GitHub URLs.
      { protocol: "https", hostname: "s3.ap-southeast-1.amazonaws.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
