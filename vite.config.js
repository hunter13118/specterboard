import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.VITE_BASE_PATH || "/projects/specterboard/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "SpecterBoard",
        short_name: "SpecterBoard",
        theme_color: "#0b0f1a",
        background_color: "#0b0f1a",
        display: "standalone",
        start_url: base,
        icons: [{ src: `${base}favicon.svg`, sizes: "any", type: "image/svg+xml" }],
      },
    }),
  ],
});
