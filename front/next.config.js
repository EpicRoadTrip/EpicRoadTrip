/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

module.exports = {
  ...nextConfig,
  transpilePackages: ['multi-range-slider-react'],
  images: {
    domains: ['picsum.photos', 'maps.googleapis.com']
  }
}