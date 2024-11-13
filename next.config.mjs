// next.config.mjs
const nextConfig = {
  images: {
    domains: [
      'via.placeholder.com', 
      'example.com', 
      'tailwindui.com', 
      'vercel-storage.com',  // Добавляем нужный домен
      '9ecgtmz1qx9a2h51.public.blob.vercel-storage.com'  // Ваш домен
    ],
  },
};

export default nextConfig;
