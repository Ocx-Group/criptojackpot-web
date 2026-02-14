/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // Optimizaciones del compilador
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Optimizar imports de librerías grandes (compatible con webpack)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-toastify', '@tanstack/react-query'],
  },

  webpack: config => {
    // Mejorar caché de webpack
    config.cache = {
      type: 'filesystem',
    };

    return config;
  },
};

export default nextConfig;
