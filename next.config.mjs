/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Arreglar errores de tipos pre-existentes y quitar esto
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.digitaloceanspaces.com',
      },
    ],
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
