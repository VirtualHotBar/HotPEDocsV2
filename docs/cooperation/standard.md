# 项目规范

## 加载模块文件
双击.HPM文件加载（打开方式）

## 快捷方式建议
桌面添加：模块商店

开始菜单HotPE模块文件夹添加：模块商店，选择模块文件加载

## 模块商店及模块源
模块商店建议用[官方版](https://p0.hotpe.top/HotPE%E6%A8%A1%E5%9D%97/HPMMGR.7z)，对于第三方发布的模块商店的模块源必须为[官方源](/devdoc/API.html#%E8%8E%B7%E5%8F%96hotpe%E6%A8%A1%E5%9D%97%E5%88%97%E8%A1%A8)或其镜像。

官方版模块商店可自行修改(logo、名称、标题、模块目录等),配置文件HPMMGR.ini：
```INI
[Custom]
Title = 模块管理{ver} - 在线获取和管理HotPE模块
Name = HotPE模块管理
Logo = icon.ico
AboutText = 本工具用于管理和获取HotPE模块。且可将此工具用于其他PE或桌面系统(详见:docs.hotpe.top)。
AboutLink = HotPE官网->https://www.hotpe.top/

[Path]
HotPEModule = \HotProgMods\
```
