import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const nextFontGoogle = fileURLToPath(new URL("./.storybook/next-font-google.ts", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "next/font/google": nextFontGoogle,
    },
  },
});
