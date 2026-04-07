/** @type {import('next').NextConfig} */
const nextConfig = {
  // In Next.js 14, external packages for server components is set here.
  // This tells Next.js NOT to bundle these packages through webpack;
  // instead they will be resolved natively by Node.js at runtime.
  experimental: {
    serverComponentsExternalPackages: [
      '@mendable/firecrawl-js',
      'openai',
      '@upstash/redis',
    ],
  },

  // Allow images / logos from Clearbit CDN
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'logo.clearbit.com' },
    ],
  },
};

export default nextConfig;
