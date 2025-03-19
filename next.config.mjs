/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3000'],
      },
    },
    async redirects() {
      return [
        // Redirect old API routes to new ones to avoid slug conflict
        {
          source: '/api/events/:type',
          destination: '/api/events/types?type=:type',
          permanent: true,
        },
        {
          source: '/api/events/:type/create',
          destination: '/api/events/types/create',
          permanent: true,
        }
      ];
    },
  };
  
  export default nextConfig;
  