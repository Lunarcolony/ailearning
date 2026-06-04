/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/feed',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
