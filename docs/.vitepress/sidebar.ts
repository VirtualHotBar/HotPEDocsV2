import fs from "fs";
import path from "path";
import process from "process";
import type { DefaultTheme } from "vitepress";

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

const sidebar: DefaultTheme.Sidebar = [
  {
    text: "开始",
    items: [
      { text: "写在前面", link: "/started" },
    ],
  },
  {
    text: "总览",
    items: [
      { text: "状态", link: "/overview/state" },
      { text: "感谢", link: "/overview/thanks" },
      { text: "用户协议", link: "/overview/contract" },
      { text: "关于捐赠", link: "/overview/donate" },
    ],
  },
  {
    text: "常见问题",
    items: [
      { text: "HotPE是什么？", link: "/matter/what_winpe" },
      { text: "是否有后门,流氓行为？", link: "/matter/safety" },
      { text: "安装到U盘时出错怎么办？", link: "/matter/install_ud_error" },
      { text: "HotPE支持WIFI吗？", link: "/matter/wifi" },
      { text: "为什么AIDA64没有图标？", link: "/matter/aida64" },
    ],
  },
  {
    text: "教程",
    items: [
      { text: "如何下载HotPE及模块", link: "/course/down" },
      { text: "如何安装HotPE到U盘或系统", link: "/course/install" },
      { text: "如何进入HotPE", link: "/course/intohotpe" },
      { text: "如何加载模块", link: "/course/loadhpm" },
      { text: "使用Edgeless插件", link: "/course/edgeless" },

    ],
  },
  {
    text: "模块生态",
    items: [
      { text: "介绍与指南", link: "/devdoc/hpm_guide" },
      { text: "打包软件模块", link: "/devdoc/makehpm" },
      { text: "打包驱动模块", link: "/course/driver_hpm" },
      { text: "模块投稿", link: "/devdoc/hpm_con" },
      {
        text: "开发者文档",
        items: [
          { text: "开放授权", link: "/cooperation/permit" },
          { text: "项目规范", link: "/cooperation/standard" },
          { text: "系统集成模块功能", link: "/devdoc/shifthpm" },
          {
            text: "示例项目",
            items: [
              { text: "FirPE", link: "/cooperation/FirPE" },
              { text: "GlassPE", link: "/cooperation/GlassPE" },
              { text: "DawnPE", link: "/cooperation/DawnPE" },
              { text: "CowPE", link: "/cooperation/CowPE" },
              { text: "ComPE", link: "/cooperation/ComPE" },
              { text: "PanDaPE", link: "/cooperation/PanDaPE" },
              { text: "GlowPE", link: "/cooperation/GlowPE" },
            ],
          },
        ],
      },
    ],
  },
];

function autoGenerate(dir: string): SidebarItem[] {
  const list = fs.readdirSync(path.join(process.cwd(), "docs", dir));
  return list
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const nameWithoutExt = name.slice(0, -3);
      return {
        text: nameWithoutExt,
        link: `/${dir}/${nameWithoutExt}`,
      };
    });
}

export default sidebar;
