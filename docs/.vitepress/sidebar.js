import fs from "fs"
import path from "path"
import process from "process"

export default [
  {
    text: "开始",
    items: [
      { text: "写在前面", link: "/started", },
    ],
  },
  {
    text: "总览",
    items: [
      { text: "状态", link: "/overview/state", },
      { text: "感谢", link: "/overview/thanks", },
      { text: "用户协议", link: "/overview/contract", },
      { text: "关于捐赠", link: "/overview/donate", },
    ],
  },
  {
    text: "常见问题",
    items: [
      { text: "HotPE是什么？", link: "/matter/what_winpe" },
      { text: "是否有后门,流氓行为？", link: "/matter/safety" },
      { text: "HotPE支持WIFI吗？", link: "/matter/wifi" },
      { text: "为什么AIDA64没有图标？", link: "/matter/aida64" }
    ]
  }, {
    text: "教程",
    items: [
      { text: "如何下载HotPE及模块", link: "/course/down" },
      { text: "如何安装HotPE到U盘或系统", link: "/course/install" },
      { text: "如何进入HotPE", link: "/course/intohotpe" },
      { text: "如何加载HotPE模块", link: "/course/loadhpm" },
      { text: "使用Edgeless插件", link: "/course/edgeless" },
      { text: "将驱动打包成HotPE模块", link: "/course/driver_hpm" },
    ]
  }, {
    text: "模块生态",
    items: [
      { text: "制作HotPE模块", link: "/devdoc/makehpm" },
      { text: "模块投稿", link: "/devdoc/hpm_con" },

      {
        text: "开发者文档",
        items: [
          { text: "开放授权", link: "/cooperation/permit" },
          { text: "项目规范", link: "/cooperation/standard" },
          { text: "PE集成HotPE模块", link: "/devdoc/shifthpm" },
          {
            text: "示例项目",
            items: [
              { text: "GlassPE", link: "/cooperation/GlassPE" },
              { text: "DawnPE", link: "/cooperation/DawnPE" },
              { text: "CowPE", link: "/cooperation/CowPE" },
              { text: "ComPE", link: "/cooperation/ComPE" },
              { text: "PanDaPE", link: "/cooperation/PanDaPE" },
              { text: "GlowPE", link: "/cooperation/GlowPE" },
            ]
          },
        ]
      },

    ]
  }
];

function autoGenerate(dir) {
  let list = fs.readdirSync(path.join(process.cwd(), "docs", dir))
  return list
    .filter(name => name.endsWith(".md"))
    .map(name => {
      name = name.slice(0, -3)
      return {
        text: name,
        link: `/${dir}/${name}`
      }
    })
}
