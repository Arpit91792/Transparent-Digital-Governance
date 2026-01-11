import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Runtime error overlay plugin is disabled to prevent popup issues
// Errors will still be logged to the browser console for debugging

export default defineConfig({
  plugins: [
    // Disable React plugin's error overlay by default
    react({
      // Exclude runtime error plugin from being loaded
      jsxRuntime: 'automatic',
    }),
    // Runtime error overlay plugin is completely disabled
    // Errors will still be logged to browser console for debugging
    // ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Disable HMR overlay to prevent runtime error popups
    hmr: {
      overlay: false, // This completely disables the error overlay popup
    },
  },
  // Additional configuration to prevent error overlays
  clearScreen: false, // Don't clear console on errors
  logLevel: 'warn', // Reduce error logging noise
});
