/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript 7 provides the native CLI rather than the existing JavaScript API.
  experimental: { useTypeScriptCli: true },
  reactStrictMode: true,
  serverExternalPackages: ["postgres"],
  transpilePackages: [
    "@shared/env",
    "@shared/auth",
    "@shared/ui",
    "@shared/runtime",
    "@shared/utils",
  ],
};

export default nextConfig;
