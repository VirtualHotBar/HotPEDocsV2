# WorkflowConfig

工作流配置。

## method

<!-- TODO:策略应该体现在文件名上 -->

此工作流的安装策略。

- **类型：** `Enum<String>`
- **取值：** `{"GlobalInstaller", "UserInstaller", "Portable"}`
- **细节**

  `GlobalInstaller` 表示使用安装器为所有用户安装；

  `UserInstaller` 表示使用安装器为当前用户安装；

  `Portable` 表示便携安装，仅为当前用户安装。

  :::tip
  便携安装指软件主程序无需提前执行任何其他文件即可直接正常使用；部分便携软件需要运行批处理脚本（`.cmd` 或 `.bat`）才能使用，此类软件的安装策略应当视为 `GlobalInstaller` 或 `UserInstaller`。
  :::

- **示例**
  ```toml
  method = "GlobalInstaller"
  ```

## uac

在安装过程中是否需要 [UAC](https://zh.wikipedia.org/wiki/%E4%BD%BF%E7%94%A8%E8%80%85%E5%B8%B3%E6%88%B6%E6%8E%A7%E5%88%B6) 权限。

- **类型：** `bool`
- **细节**

  通常仅当安装方式为全局安装器安装时需要使能此项。

- **示例**
  ```toml
  uac = false
  ```

## main_program

使用此工作流安装后的主程序位置，用于帮助 nep 判断当前已安装程序的版本号。

- **类型：** `String`
- **细节**

  对于使用安装器安装的软件，提供以 [${SystemDrive}](内置变量.md#systemdrive) 或 [${AppData}](内置变量.md#appdata) 开头的绝对路径；

  对于使用便携安装的软件，提供相对于 `PackageName` 的相对路径。

  nep 默认读取该文件的文件版本作为当前版本号。

  :::tip
  根据[规范](/misc/norm#统一使用正斜杠（-）)，统一使用正斜杠 `/` 分割路径。
  :::

- **示例**
  ```toml
  main_program = "${AppData}/Local/Programs/Microsoft VS Code/Code.exe"
  ```
