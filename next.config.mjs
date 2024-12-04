// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
      {
        protocol: 'https',
        hostname: 'vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '9ecgtmz1qx9a2h51.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
