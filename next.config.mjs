/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['react-icons'],
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

export default nextConfig;
