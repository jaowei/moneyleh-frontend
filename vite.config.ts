import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [UnoCSS({ configFile: "./uno.config.ts" }), solid()],
  build: {
    target: "esnext",
  },
  server: {
    // see https://github.com/sqlite/sqlite-wasm
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
});
