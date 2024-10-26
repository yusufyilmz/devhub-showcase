/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
    turbo: {},
  },
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['openai'],
  reactStrictMode: true
}

export default nextConfig
