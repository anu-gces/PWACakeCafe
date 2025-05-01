import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }), // put FIRST to avoid error
    react(), // put SECOND
    VitePWA({
      manifest: {
        name: "Cake Cafe",
        short_name: "CakeCafe",
        description: "A PWA for managing Cake Cafe operations.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#e11d48",
        icons: [
          {
            src: "/CakeCafeLogo.png",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/CakeCafeLogo.png",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*$/,
            handler: "NetworkFirst", // Fetch from network first, fallback to cache
            options: {
              cacheName: "firestore-api-cache",
              expiration: {
                maxEntries: 50, // Cache up to 50 requests
                maxAgeSeconds: 86400, // Cache for 1 day
              },
            },
          },
          {
            urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com\/.*$/,
            handler: "NetworkFirst", // Fetch from network first, fallback to cache
            options: {
              cacheName: "auth-api-cache",
              expiration: {
                maxEntries: 20, // Cache up to 20 requests
                maxAgeSeconds: 3600, // Cache for 1 hour
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst", // Cache images for faster loading
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 100, // Cache up to 100 images
                maxAgeSeconds: 2592000, // Cache for 30 days
              },
            },
          },
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
