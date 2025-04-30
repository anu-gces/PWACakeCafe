import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/PWACakeCafe/", // ← This is important for GitHub Pages
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }), // put FIRST to avoid error
    react(), // put SECOND
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
