/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['react-icons'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['react-icons', '@mui/material', '@mui/icons-material', 'lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/blogs/1',
        destination: '/blogs/discover-the-best-salvage-yard-for-affordable-used-auto-parts-nationwide',
        permanent: true,
      },
      {
        source: '/blogs/2',
        destination: '/blogs/the-ultimate-guide-to-finding-quality-used-auto-parts',
        permanent: true,
      },
      {
        source: '/blogs/3',
        destination: '/blogs/everything-you-need-to-know-about-used-oem-parts',
        permanent: true,
      },
      {
        source: '/blogs/4',
        destination: '/blogs/how-to-find-gm-parts-online',
        permanent: true,
      },
      {
        source: '/blogs/5',
        destination: '/blogs/top-reasons-to-buy-used-auto-parts-online',
        permanent: true,
      },
      {
        source: '/blogs/6',
        destination: '/blogs/how-to-identify-genuine-oem-used-parts-online',
        permanent: true,
      },
      {
        source: '/blogs/7',
        destination: '/blogs/the-benefits-of-buying-recycled-auto-parts',
        permanent: true,
      },
      {
        source: '/blogs/8',
        destination: '/blogs/top-websites-for-used-auto-parts-online',
        permanent: true,
      },
      {
        source: '/blogs/9',
        destination: '/blogs/advantages-of-buying-used-auto-parts-for-classic-vintage-cars',
        permanent: true,
      },
      {
        source: '/blogs/10',
        destination: '/blogs/hybrid-vs-electric-vs-normal-engine-comparison',
        permanent: true,
      },
      {
        source: '/blogs/11',
        destination: '/blogs/how-to-check-used-engine-before-you-buy-it',
        permanent: true,
      },
      {
        source: '/blogs/12',
        destination: '/blogs/how-to-tell-if-used-transmission-is-good',
        permanent: true,
      },
      {
        source: '/blogs/13',
        destination: '/blogs/vin-number-guide-identify-right-auto-part',
        permanent: true,
      },
      {
        source: '/blogs/14',
        destination: '/blogs/oem-vs-aftermarket-vs-used-parts-difference',
        permanent: true,
      },
      {
        source: '/blogs/15',
        destination: '/blogs/what-is-salvage-yard-how-used-parts-sourced-tested',
        permanent: true,
      },
      {
        source: '/blogs/16',
        destination: '/blogs/used-engine-buying-guide-mileage-compression-warranty',
        permanent: true,
      },
      {
        source: '/blogs/17',
        destination: '/blogs/used-transmission-buying-guide-vin-code-compatibility',
        permanent: true,
      },
      {
        source: '/blogs/18',
        destination: '/blogs/how-auto-part-interchange-works-hollander-numbers',
        permanent: true,
      },
      {
        source: '/blogs/19',
        destination: '/blogs/what-do-used-auto-part-grades-mean',
        permanent: true,
      },
      {
        source: '/blogs/20',
        destination: '/blogs/how-nationwide-shipping-works-used-auto-parts',
        permanent: true,
      },
      {
        source: '/blogs/21',
        destination: '/blogs/what-is-engine-assembly-long-block-vs-complete-engine',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
