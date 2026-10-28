/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeScript 7 provides the native CLI rather than the legacy JavaScript API.
  experimental: { useTypeScriptCli: true },
  transpilePackages: [
    '@shared/ui',
    '@shared/content',
    '@shared/lib',
    '@shared/chat',
    '@shared/cache',
    '@shared/cv'
  ],
  serverExternalPackages: ['openai', 'pino', 'pdfmake'],
  webpack(config) {
    // Use the compiler entry without Handlebars' Node require.extensions hook.
    config.resolve.alias.handlebars$ = 'handlebars/dist/cjs/handlebars.js'
    config.module.rules.push({ test: /\.hbs$/, type: 'asset/source' })
    return config
  }
}
export default nextConfig
