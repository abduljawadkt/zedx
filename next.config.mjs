/** @type {import("next").NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    // Serve images directly from the source (S3 / local) instead of routing them
    // through Vercel's image optimizer. The optimizer was returning HTTP 402
    // (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) once the project hit its image
    // optimization quota, which broke every newly added/updated product image.
    // Our S3 product images are already web-sized, so skipping optimization has
    // negligible quality/perf impact and removes the quota dependency entirely.
    unoptimized: true,
    remotePatterns: [
      // Medusa product images: Medusa Cloud S3 bucket + repo raw GitHub URLs.
      { protocol: "https", hostname: "s3.ap-southeast-1.amazonaws.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
