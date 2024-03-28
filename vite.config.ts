import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [UnoCSS({ configFile: "./uno.config.ts" }), solid(), visualizer()],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
    exclude: ["@evolu/common-web"],
  },
  worker: {
    format: "es",
  },
});
