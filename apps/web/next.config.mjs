/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript 7 provides the native CLI rather than the legacy JavaScript API.
  experimental: { useTypeScriptCli: true },
  reactStrictMode: true,
  serverExternalPackages: ["openai", "pino", "pdfmake"],
  transpilePackages: [
    "@shared/ui",
    "@shared/auth",
    "@shared/components",
    "@shared/sections",
    "@shared/content",
    "@shared/lib",
    "@shared/chat",
    "@shared/cache",
    "@shared/cv",
  ],
  webpack(config) {
    // Use the compiler entry without Handlebars' Node require.extensions hook.
    config.resolve.alias.handlebars$ = "handlebars/dist/cjs/handlebars.js";
    config.module.rules.push({ test: /\.hbs$/, type: "asset/source" });
    return config;
  },
};
export default nextConfig;
