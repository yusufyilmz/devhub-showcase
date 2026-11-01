import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const nextFontGoogle = fileURLToPath(new URL("./.storybook/next-font-google.ts", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "next/font/google": nextFontGoogle,
    },
  },
});
