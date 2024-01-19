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
});
