/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['openai'],
  reactStrictMode: true,
}

export default nextConfig
