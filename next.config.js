/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        { hostname: "images.pexels.com" },
        { hostname: "res.cloudinary.com" },
        { hostname: "via.placeholder.com" }, // Agregado para imágenes de placeholder
        { hostname: "flagcdn.com" }, // Agregado para imágenes de banderas
        {hostname: "randomuser.me"}
      ]
    },
  };
  
  module.exports = nextConfig;
  