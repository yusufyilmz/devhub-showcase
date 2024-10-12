/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   ppr: 'incremental'
  // },
  bundlePagesRouterDependencies: true,
  // Opt specific packages out of bundling for both App and Pages Router:
  serverExternalPackages: ['openai']
}

export default nextConfig
