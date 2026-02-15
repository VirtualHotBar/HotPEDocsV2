import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import HpmUpload from "../components/HpmUpload.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("HpmUpload", HpmUpload);
  },
} satisfies Theme;
