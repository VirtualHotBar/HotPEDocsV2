import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
  lang: "zh-CN",
  title: "HotPE Docs",
  description: "一个纯净、强大、优雅的Win11PE",
  lastUpdated: true,
  base: "/",
  head: [
    // 51La统计
    ['script', { charset: 'UTF-8', id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js?id=Jfyz2AtpDiNlSRpE&ck=Jfyz2AtpDiNlSRpE' }],
    // 改变title的图标
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
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
      style: 'github',
      domain: 'github.com',
      repo: 'VirtualHotBar/HotPEToolBox',
      branch: 'main',
      dir: 'docs',
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/VirtualHotBar/HotPEDocsV2/edit/main/docs/:path'
    },
    lastUpdatedText: "最近更新于",
    socialLinks: [
      { icon: 'github', link: 'https://github.com/VirtualHotBar/HotPEToolBox' }
    ],
  },
});
