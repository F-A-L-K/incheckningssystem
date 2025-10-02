import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // --- PWA ---
    VitePWA({
      registerType: "autoUpdate",           // auto-registrera SW och kolla uppdateringar
      includeAssets: ["icons/*"],            // allt i public/icons
      manifest: {
        name: "Incheckningssystem",
        short_name: "Incheckningssystem",
        description: "Intern app",
        start_url: "/",                      // börja på rot
        scope: "/",                          // SW-scope = rot
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // SPA-fallback så klientrouting fungerar offline
        navigateFallback: "/index.html",
        // Exempel på runtime-caching (GET-bilder/API)
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "images", expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
          {
            urlPattern: ({ url, request }) =>
              request.method === "GET" && url.pathname.startsWith("/api/") && !/\/auth\//.test(url.pathname),
            handler: "NetworkFirst",
            options: { cacheName: "api", networkTimeoutSeconds: 3 },
          },
        ],
      },
      // (valfritt) egen offline-sida:
      // strategies: "generateSW",
      // injectRegister: "auto",
    }),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));
