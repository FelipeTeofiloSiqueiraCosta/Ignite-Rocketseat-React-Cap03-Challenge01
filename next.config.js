/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains:['localhost','images.prismic.io']
    
  },
};

module.exports = nextConfig;
