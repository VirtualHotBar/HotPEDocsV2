import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    const modules = import.meta.glob("../components/**/*.vue", { eager: true });
    Object.entries(modules).forEach(([path, mod]) => {
      const component = (mod as { default?: unknown }).default;
      if (!component) return;
      const name = path.split("/").pop()?.replace(/\.vue$/i, "");
      if (!name) return;
      app.component(name, component as any);
    });
  },
} satisfies Theme;
