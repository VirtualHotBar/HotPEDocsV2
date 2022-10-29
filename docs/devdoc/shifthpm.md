# PE集成HotPE模块
> 本章节将实现把HotPE模块加入到你的PE，从而实现HotPE模块的功能

HotPEModDeploy下载:https://down.hotpe.top/d/HotPE%E6%A8%A1%E5%9D%97/HotPEModDeploy.exe

请将HotPEModDeploy.exe放置到PE的System32文件夹下

### 思路
在PE中使用HotPE模块就是加载HotPE模块，HotPE模块的加载通过HotPEModDeploy实现，HotPEModDeploy是一个命令行工具。
目前HotPE有2种加载模式，默认模式和快速模式，通常你只需要实现默认模式。
以下是HotPEModDeploy命令行的使用方法（/help内容）:
```bash
HotPEModDeployTool2.1命令行帮助
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
/c:禁止校验，仅默认模式，快速模式默不校验
/help:帮助

*注意：所有参数区分大小写
```
此时你看完帮助应已能大概的知道HotPEModDeploy的使用方法并想到集成HotPE模块的方法。

如果你不能理解以上命令行使用方法，可以忽略，把以下的内容部署好就能实现以默认模式加载模块功能了。

### Pecmd脚本
使用：添加到Pecmd.ini

作用：寻找HotPEModule文件夹并用HotPEModDeploy加载其中的模块
```bash
FORX @\HotPEModule,HotPEModule,0,EXEC !%SystemRoot%\System32\HotPEModDeploy.exe default %HotPEModule%
```

### 打开方式注册表
使用：挂载PE的Software注册表到HKEY_LOCAL_MACHINE\pe_soft，然后导入以下内容，卸载注册表

作用：实现HPM文件文件关联，双击文件以默认模式加载模块
```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\pe_soft\Classes\.HPM]
@="HotPE模块文件"
[HKEY_LOCAL_MACHINE\pe_soft\Classes\.HPM\DefaultIcon]
@="%SystemRoot%\\System32\\HotPEModDeploy.exe"
[HKEY_LOCAL_MACHINE\pe_soft\Classes\.HPM\shell]
[HKEY_LOCAL_MACHINE\pe_soft\Classes\.HPM\shell\open]
[HKEY_LOCAL_MACHINE\pe_soft\Classes\.HPM\shell\open\command]
@="PECMD EXEC !HotPEModDeploy.exe default \"%1\""
```
### 说明
HotPE模块有校验和加密的，请勿尝试复刻。
