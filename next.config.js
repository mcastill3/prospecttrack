/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "via.placeholder.com" },
      { hostname: "flagcdn.com" },
      { hostname: "randomuser.me" }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb' // ✅ Debe ir DENTRO de 'experimental'
    }
  }
};

module.exports = nextConfig;  