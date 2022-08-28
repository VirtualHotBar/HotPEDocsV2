# Steps

工作流步骤。

## Group

步骤组，与[条件语句](WorkflowStep.md#if)配合使用可以同时控制多个步骤的执行。

不需要提供参数，但是组内步骤的键需要以 `_` 开头。

- **示例**

  ```toml
  [install.install_group]
  name = "Install Group"
  type = "Group"
  # 使用一个条件语句控制整组步骤的执行
  if = "${uc.GROUP_INSTALL}==true"

      [install.install_group._install_1]
      name = "Install 1"
      type = "Execute"
      callInstaller = true

      command = "./MySoftware/Installer1.exe /S"


      [install.install_group._install_2]
      name = "Install 2"
      type = "Execute"
      callInstaller = true

      command = "./MySoftware/Installer2.exe /S"


      [install.install_group._install_3]
      name = "Install 3"
      type = "Execute"
      callInstaller = true

      command = "./MySoftware/Installer3.exe /S"
  ```

:::tip
Group 与 ExitCode 配合使用时有一些注意事项，详见 [ExitCode](内置变量.md#exitcode)。
:::

## LogicAnd

验证一组表达式，仅当*所有表达式均*为真时使 `${ExitCode}=0`，否则 `${ExitCode}=1`。

- **参数**

  - `exp :Array<String>`：需要验证的表达式组

- **示例**

  ```toml
  [install.verify_success]
  name = "Verify success"
  type = "LogicAnd"

  exp = [
  'Exist("${EdgelessDrive}/Edgeless/version.txt")',
  'Exist("${EdgelessDrive}/Edgeless/Nes_Inport.7z")',
  'Exist("${EdgelessDrive}/Edgeless/Resource/*.7z")'
  ]

  [install.log_success]
  name = "Log success"
  type = "Log"
  if = '${ExitCode}==0'

  level = "Info"
  msg = "Installed successfully"
  ```

## LogicOr

验证一组条件，当*存在任一条件*为真时使 `${ExitCode}==0`，否则 `${ExitCode}==1`。

- **参数**

  - `exp :Array<String>`：所有条件

- **示例**

  ```toml
  [install.check_7z]
  name = "Check 7z"
  type = "LogicOr"

  exp = [
  'Exist("${SystemDrive}/Program Files (x86)/7-Zip/7z.exe")',
  'Exist("${SystemDrive}/Program Files/7-Zip/7z.exe")',
  'Exist("./7z.exe")'
  ]

  [install.log_7z]
  name = "Log 7z"
  type = "Log"
  if = '${ExitCode}==0'

  level = "Info"
  msg = "Found 7-Zip"
  ```

## Modify

更改[自定义变量](Env.md)或[用户配置变量](UserConfigItem.md)的值。
:::tip
[内置变量](内置变量.md)*不允许*被工作流或是用户修改，其值仅由加载器运行时决定。
:::

- **参数**

  - `key :String`：需要修改的键
  - `value :any`：新值

- **示例**

  修改自定义变量

  ```toml
  [install.modify_boot_policy]
  name = "Modify boot policy"
  type = "Modify"
  if = '${BootPolicy}=="UEFI"'

  key = "env.MY_BOOT_POLICY"
  value = 1
  ```

  修改用户配置变量

  ```toml
  [install.modify_auto_run]
  name = "Modify auto run"
  type = "Modify"
  if = '${BootPolicy}=="UEFI"'

  key = "uc.AUTO_RUN"
  value = true
  ```

## Wait

等待一定时间。

- **参数**

  - `timeout :int`：延时，单位为 ms

- **示例**

  ```toml
  [install.wait_1]
  name = "Wait 1"
  type = "Wait"

  timeout = 1000
  ```

## Link

创建快捷方式，支持在桌面、任务栏、开始菜单。

- **参数**

  - `source_file :String`：源文件
  - `target_name :String`：快捷方式名称，可以使用 `Folder/Name` 表示创建目录
  - `target_args :String`：（可选）追加参数
  - `target_icon :String`：（可选）快捷方式图标，缺省与源文件一致
  - `location_default :Enum<String>`：（可选）默认创建位置，缺省为`"Desktop"`，下列值中的一个：`{"Desktop", "Taskbar", "StartMenu"}`；用户可以手动更改此项

- **示例**

  ```toml
  [install.create_shortcut]
  name = "Create shortcut"
  type = "Link"

  source_file = "./VSCode/VSCode.exe"
  target_name = "Visual Studio Code"
  target_args = "${env.USER_ARGS}"
  target_icon = "./VSCode/vscode.ico"
  location_default = "Desktop"
  ```

  可以使用 `target_name: "Folder/Name"` 表示将快捷方式放置于目录中，尤其建议当 `location_default` 值为 `StartMenu` 时这样做：

  ```toml
  [install.create_shortcut]
  name = "Create shortcut"
  type = "Link"

  source_file = "./VSCode/VSCode.exe"
  target_name = "集成开发/Visual Studio Code"
  target_args = "${env.USER_ARGS}"
  target_icon = "./VSCode/vscode.ico"
  location_default = "StartMenu"
  ```

## Copy

复制文件/文件夹。

- **参数**

  - `source : String`：复制来源，可以是文件或文件夹，支持通配符
  - `target : String`：复制目的地，支持重命名
  - `overwrite : bool`：（可选）是否覆盖，缺省为 `true`

- **示例**

  ```toml
  [install.copy_config]
  name = "Copy config"
  type = "Copy"

  source = "./VSCode/config/*"
  target = "${SystemDrive}/Users/Config/"
  overwrite = false
  ```

## Move

移动文件/文件夹。

:::tip
配合 [\_patch](/misc/exclusive-directory.md#补丁文件夹) 专用文件夹可以实现打文件补丁操作。
:::

- **参数**

  - `source : String`：移动来源，可以是文件或文件夹，支持通配符
  - `target : String`：移动目的地，支持重命名
  - `overwrite : bool`：（可选）是否覆盖，缺省为 `true`

- **示例**

  ```toml
  [install.move_config]
  name = "Move config"
  type = "Move"

  source = "./_patch/config/*"
  target = "${SystemDrive}/Users/Config/"
  overwrite = false
  ```

## Rename

重命名文件/文件夹。

- **参数**

  - `source : String`：重命名源，可以是文件或文件夹，支持通配符
  - `target : String`：新名称，需要手动添加拓展名

- **示例**

  ```toml
  [install.rename_config]
  name = "Rename config"
  type = "Rename"

  source = "./VSCode/config/*.ini"
  target = "*.wcs"
  ```

## Delete

删除文件/文件夹。

- **参数**

  - `source : String`：删除来源，可以是文件或文件夹，支持通配符
  - `force : bool`：（可选）是否解除占用强制删除，缺省为 `false`

- **示例**

  ```toml
  [install.delete_config]
  name = "Delete config"
  type = "Delete"

  source = "${SystemDrive}/Users/Config/*"
  force = true
  ```

## New

新建文件/文件夹。

- **参数**

  - `target : String`：新建位置，以 `/` 结尾则视为新建文件夹，否则新建一个空白文件
  - `overwrite : bool`：（可选）是否覆盖，缺省为 `false`

- **示例**

  ```toml
  [install.new_folder]
  name = "New folder"
  type = "New"

  target = "${SystemDrive}/Users/Config/"
  overwrite = true
  ```

## Script

执行*自编*脚本，支持 cmd 脚本(`.cmd`)、 pecmd 脚本(`.wcs`)和 [AutoHotKey](https://www.autohotkey.com/) 脚本(`.ahk`)。
:::warning
如果你需要执行上游提供的安装脚本，请使用 [`Execute`](#execute) 步骤并将 `callInstaller` 置为 `true`。
:::

- **参数**

  - `path :String`：脚本路径
  - `args :String`：（可选）参数
  - `use :Array<String>`：（可选）需要传递的变量，可以是[内置变量](内置变量.md)、[自定义变量](Env.md)或[用户配置变量](UserConfigItem.md)
  - `pwd :String`：（可选）工作目录，缺省时自动判断(引用 `_retinue` 内脚本则为资源根目录，其他位置则在脚本所在目录)
  - `hide :bool`：（可选）是否隐藏脚本执行窗口，缺省为 `true`
  - `wait :bool`：（可选）是否等待脚本执行完成，缺省为 `true`
  - `fix :Array<String>`：（可选）需要[修复 `_retinue` 引用](/misc/exclusive-directory.md#随从文件夹)的文本文件

- **示例**

  ```toml
  [install.run_setup_script]
  name = "Run setup script"
  type = "Script"

  path = "./setup.cmd"
  args = "${env.USER_ARGS}"
  use = ["EdgelessDrive","env.PLUGINS","uc.AUTO_RUN"]
  pwd = "${SystemDrive}/System32"
  hide = false
  wait = false
  fix = ["./VSCode/install.cmd", "./_retinue/update.py"]
  ```

## Execute

执行命令，支持 cmd 命令和 pecmd 命令。

- **参数**

  - `command :String`：命令
  - `shell :Enum<String>`：（可选）使用的终端，下列值中的一个：`{"cmd", "pecmd"}`，缺省为 `cmd`
  - `callInstaller :bool`：（可选）此步骤是否在调用安装器（如调用`安装包 /S`或运行`安装.bat`），请务必如实填写，缺省为 `false`
  - `pwd :String`：（可选）工作目录，缺省为资源包根目录
  - `hide :bool`：（可选）是否隐藏命令执行窗口，缺省为 `true`
  - `wait :bool`：（可选）是否等待命令执行完成，缺省为 `true`

- **示例**

  ```toml
  [install.start_vscode]
  name = "Start VSCode"
  type = "Execute"
  if = "${uc.AUTO_RUN}==true"

  command = "exec explorer ${Desktop}/Visual Studio Code.lnk"
  shell = "pecmd"
  callInstaller = false
  pwd = "${SystemDrive}/System32"
  hide = false
  wait = false
  ```

## Kill

杀死某个进程。

- **参数**

  - `target :String`：进程名称，或启动时对应的可执行文件名

- **示例**

  ```toml
  [install.kill_vscode]
  name = "Kill VSCode"
  type = "Kill"

  target = "vscode.exe"
  ```

## Path

将文件/文件夹暴露在 PATH 变量中。如果指定了一个文件夹则会将此文件夹添加到当前用户的 PATH 变量；如果指定了一个文件则会将该文件的快捷方式放置到 nep 的专用 PATH 目录下暴露。

- **参数**

  - `record :String`：需要增/删的记录值
  - `operation :Enum<String>`：指定增/删操作，下列值中的一个：`{"Add", "Remove"}`

- **示例**

  ```toml
  [install.add_path]
  name = "Add PATH"
  type = "Path"

  record = "${SystemDrive}/Users/nodejs"
  operation = "Add"
  ```

## Log

输出日志，分为信息、警告、错误三个等级，错误(`Error`)等级信息的内容会以 [Toast](#toast) 形式直接展示给用户。

- **参数**

  - `level :Enum<String>`：日志等级，下列值中的一个：`{"Info", "Waring", "Error"}`
  - `msg :String`：日志内容

- **示例**

  ```toml
  [install.log_status]
  name = "Log status"
  type = "Log"

  level = "Info"
  msg = "VSCode installed successfully"
  ```

## Toast

弹出悬浮通知。

- **参数**

  - `title :String`：通知标题
  - `content :String`：通知内容

- **示例**

  ```toml
  [install.show_status]
  name = "Show status"
  type = "Toast"

  title = "安装成功"
  content = "VSCode 已安装完成"
  ```

## Dialog

弹出对话框，可以使用 [`${Feedback}`](内置变量.md#feedback) 变量获得用户操作反馈。
:::warning
由于此操作与 nep 所希望实现的自动化管理理念相悖，因此不到万不得已（例如出现了某些严重的无法自动确定后续步骤的错误）请不要使用此步骤。相应地，你可以使用 [`uc`](UserConfigItem.md) 来个性化一些配置。
:::

- **参数**

  - `title :String`：对话框标题
  - `content :String`：对话框内容
  - `options :Array<String>`：（可选）按钮文本，缺省为`["确认"]`

- **示例**

  ```toml
  [install.show_status]
  name = "Show status"
  type = "Dialog"

  title = "安装成功"
  content = "是否打开 VSCode？"
  options = ["是","否"]


  [install.start_vscode]
  name = "Start vscode"
  type = "Execute"
  if = '${Feedback}==1'

  command = "explorer ${Desktop}/Visual Studio Code.lnk"
  ```

## Download

从网络下载文件，默认使用 2 线程的 aria2c 完成下载。
:::warning
此步骤仅能在展开工作流中使用，且必须提供校验信息。
:::

- **参数**

  - `url :String`：链接
  - `save_to :String`：保存路径
  - `verification_algorithm :Enum<String>`：哈希摘要算法，下列值中的一个：`{"MD5", "SHA-1", "SHA-256","CRC-32"}`
  - `verification_value :String`：哈希摘要值
  - `overwrite: bool`：（可选）是否覆盖，缺省为`true`
  - `wait :bool`：（可选）是否等待下载完成，缺省为`true`
  - `thread :int`：（可选）线程数，范围`1~16`，缺省为`2`

- **示例**

    ```toml
    [expand_flow.download_vscode]
    name = "Download VSCode"
    type = "Download"

    url = "https://az764295.vo.msecnd.net/stable/7f6ab5485bbc008386c4386d08766667e155244e/VSCodeUserSetup-x64-1.60.2.exe"
    save_to = "./vscode.exe"
    verification_algorithm = "MD5"
    verification_value = "DD4DD2E97577D88B4E6E4B3BF4AA86A9"
    overwrite = false
    wait = true
    thread = 16
    ```

  :::tip
  如果需要异步地下载并执行回调，请改用脚本，我们会在 [`${Aria2cPath}`](内置变量.md#aria2cpath) 参数上提供一个现成的 aria2c.exe 可执行文件。
  :::

## Unzip

解包压缩文件，支持的文件类型范围等同于 [7-Zip](https://www.7-zip.org/) 支持范围。

- **参数**

  - `source :String`：压缩文件路径
  - `target :String`：解压路径，最好是一个空目录
  - `overwrite: bool`：（可选）是否覆盖，缺省为`true`

- **示例**

  ```toml
  [install.unzip_vscode]
  name = "Unzip VSCode"
  type = "Unzip"

  source = "./vscode.exe"
  target = "./VScode"
  overwrite = false
  ```

## SendKey

向窗口发送键盘输入。

- **参数**

  - `key :String`：按键名称，见[AutoHotKey KeyList](https://www.autohotkey.com/docs/KeyList.htm)
  - `focus :String`：（可选）目标窗口标题

- **示例**

    ```toml
    [install.send_key]
    name = "Send key"
    type = "SendKey"

    key = "Enter"
    focus = "Chrome Setup"
    ```

  :::tip
  如果此步骤无法满足你的需求，你可以使用 [`Script` 步骤](#script)运行一个 AutoHotKey 脚本来实现复杂的模拟按键操作。
  :::

## SendMouse

向窗口发送鼠标左键单击输入。

- **参数**

  - `control :String`：控件名称或文本，或者是需要点击对象的图片（会自动点击图像中心）
  - `focus :String`：（可选）目标窗口标题

- **示例**

  ```toml
  [install.send_mouse]
  name = "Send mouse"
  type = "SendMouse"

  control = "Next"
  focus = "Chrome Setup"
  ```

  或

  ```toml
  [install.send_mouse]
  name = "Send mouse"
  type = "SendMouse"

  control = "./_retinue/screenshots/button.jpg"
  focus = "Chrome Setup"
  ```

:::tip
控件名称可以使用 [AutoHotKey](https://www.autohotkey.com) 提供的 WindowSpy 脚本查看，此脚本位于你下载的 AutoHotKey 发行版压缩包根目录。

如果此步骤无法满足你的需求，你可以使用 [`Script` 步骤](#script)运行一个 AutoHotKey 脚本来实现复杂的模拟按键操作。
:::
