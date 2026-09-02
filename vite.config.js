import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "PhishQuest",
        short_name: "PhishQuest",
        description: "Gamified Phishing Awareness Learning Platform",
        theme_color: "#FFD84D",
        background_color: "#FFD84D",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        scope: "/",

       icons: [
  {
    src: "/mascot-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/mascot-512.png",
    sizes: "512x512",
    type: "image/png",
  },
],
      },
    }),
  ],
});