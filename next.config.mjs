/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
  images: {
    // Untuk Next.js 13+ gunakan remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      // Tambahan untuk Google Images
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      // Tambahan untuk domain gambar eksternal lainnya (opsional)
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
    // Jika Next.js versi lama (12 atau dibawah), gunakan domains
    // domains: ['localhost', 'encrypted-tbn0.gstatic.com'],
  },
};

export default nextConfig;