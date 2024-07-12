# PE集成HotPE模块
> 本章节将实现把HotPE模块加入到你的PE，从而实现HotPE模块的功能

## 新版HPM加载器实现(推荐)
仓库地址：https://github.com/VirtualHotBar/HPM-cil/

HPM-cil为命令行工具，无图形界面，请参考以下命令行参数帮助实现HPM相关功能：
``` BATH
HPM(HotPE Module) Manager

Usage: hpm_cil.exe [OPTIONS] [HPMPath]

Arguments:
  [HPMPath]  Sets the input file to use

Options:
  -i, --install <PATH>             Install HPM package
  -q, --quickload <QuickPATH>      Quickly load HPM package
      --installpath <installPath>  Set install path
  -h, --help                       Print help
  -V, --version                    Print version
```

## 旧版HPM加载工具(将弃用)

[HotPEModDeploy下载](https://p0.hotpe.top/HotPE%E6%A8%A1%E5%9D%97/HotPEModDeploy.exe)

请独立参考HotPEModDeployTool命令行帮助完成：

以下是HotPEModDeploy命令行的使用方法（/help内容）:
```bash
HotPEModDeployTool2.3命令行帮助
---------------------------------------------
HotPEModDeploy [method] [path] [/lp:"loadPath"] [/h] [/c]
---------------------------------------------

【method】必须
---------------------------------------------
method = [default|quick]
---------------------------------------------
default:以默认模式进行加载
quick:以快速模式进行加载，不必再重新加载直接执行脚本，首先需要通过默认模式自定义模块加载目录进行加载


【path】必须
---------------------------------------------
当method = default时，path = 模块文件或放模块文件的目录
当method = quick时，path = 模块加载目录，为通过默认模式进行加载后的模块加载目录
---------------------------------------------

【/lp:"loadPath"】可选
当method = default时，此参数可选，默认为"X:\Program Files\HotPEModules\"
当method = quick时，不应存在此参数
---------------------------------------------
*说明：冒号和引号均为英文，必须存在引号


【其它参数】可选
/h:隐藏UI
/help:帮助

*注意：所有参数区分大小写
```
