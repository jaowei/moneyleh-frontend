import {
  defineConfig,
  presetWebFonts,
  presetUno,
  presetAttributify,
  presetIcons,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetWebFonts({
      fonts: {
        sans: "Noto Sans Display",
        mono: ["Fira Code", "Fira Mono:400,700"],
      },
    }),
    presetIcons(),
  ],
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
    },
  },
});
