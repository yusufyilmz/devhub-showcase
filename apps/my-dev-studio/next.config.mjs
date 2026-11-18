/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript 7 provides the native CLI rather than the existing JavaScript API.
  experimental: { useTypeScriptCli: true },
  reactStrictMode: true,
  async redirects() {
    return [
      { destination: "/studio", permanent: false, source: "/admin" },
      { destination: "/studio/:path*", permanent: false, source: "/admin/:path*" },
    ];
  },
  serverExternalPackages: ["openai", "pino", "pdfmake"],
  transpilePackages: [
    "@shared/env",
    "@shared/calendar",
    "@shared/ui",
    "@shared/auth",
    "@shared/config",
    "@shared/lib",
    "@shared/assistant",
    "@shared/runtime",
    "@shared/utils",
    "@shared/billing",
    "@shared/trello",
  ],
  webpack(config) {
    // Use the compiler entry without Handlebars' Node require.extensions hook.
    config.resolve.alias.handlebars$ = "handlebars/dist/cjs/handlebars.js";
    config.module.rules.push({ test: /\.hbs$/, type: "asset/source" });
    return config;
  },
};
export default nextConfig;
