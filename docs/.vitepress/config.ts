import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
  lang: "zh-CN",
  title: "HotPE Docs",
  description: "一个纯净、强大、优雅的Win11PE",
  lastUpdated: true,
  base: "/",
  vite: {
    server: {},
  },
  head: [
    // 改变title的图标
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    ["script", { src: "/main.js" }],
    ["script", { id: "MXA_COLLECT", charset: "UTF-8", src: "//mxana.tacool.com/sdk.js" }],
    ["script", {}, `MXA.init({ id: "c1-D65yy2xb" })`],
  ],
  themeConfig: {
    logo: "/favicon.ico",
    sidebar,
    nav: [
      {
        text: "首页",
        link: "https://www.hotpe.top/",
      },
      {
        text: "下载站",
        link: "https://down.hotpe.top/",
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present VirtualHotBar",
    },
    editLink: {
      pattern: "https://github.com/VirtualHotBar/HotPEDocsV2/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
    lastUpdatedText: "最近更新于",
    socialLinks: [
      { icon: "github", link: "https://github.com/VirtualHotBar/HotPEToolBox" }
    ],
    search: {
      provider: "local"
    }
  },
  sitemap: {
    hostname: "https://docs.hotpe.top"
  }
});
