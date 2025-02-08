/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Ensure correct deployment structure
  experimental: { appDir: true }, // Ensure Next.js 15 App Router support
};

export default nextConfig;
