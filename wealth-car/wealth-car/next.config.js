/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "mcvewawvriontqggrzfg.supabase.co", // ← adicionar
      },
    ],
  },
};

module.exports = nextConfig;
