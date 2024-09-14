import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
  lang: "zh-CN",
  title: "HotPE Docs",
  description: "一个纯净、强大、优雅的Win11PE",
  lastUpdated: true,
  base: "/",
  head: [
    ['script', { type: 'text/javascript'},`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ne6d69tu0p");
  `],
    ['script', { type: 'text/javascript'},`
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?c5d2e80c13f692ab9e3b8ca50bc49adb";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
  `],
    // 改变title的图标
    [
      'link',
      {
        rel: 'icon',
        href: 'https://www.hotpe.top/favicon.ico',
      },
    ],
  ],
  themeConfig: {
    logo: "https://www.hotpe.top/favicon.ico",
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
