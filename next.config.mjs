/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/seen-portal',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
