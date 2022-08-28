# Env

自定义变量，支持直接通过键值对定义 `bool` `int` `String` 三种类型的变量，然后通过 `${env.KEY_NAME}` 调用。

:::tip
`int` 类型变量使用 `int64` 表达，支持的范围为 `-9223372036854775808 ~ 9223372036854775807`
:::

- **参数**

  - `${KEY} :bool | int | String`：定义的键值对

- **示例**

  ```toml
  [env]
  USER_ARGS = "--help"
  MY_BOOT_POLICY = 0
  INSTALL_CHINESE_PLUGIN = true
  ```

  随后在配置工作流中使用自定义变量：

  ```toml
  [setup_flow.create_shortcut]
  name = "Create shortcut"
  type = "Link"

  source_file = "./VSCode/VSCode.exe"
  target_name = "Visual Studio Code"
  # 使用自定义变量的值，此项会被解释为 target_args = "--help"
  target_args = "${env.USER_ARGS}"
  target_icon = "./VSCode/vscode.ico"
  location_default = "Desktop"
  ```

  支持在自定义变量的值中使用[内置变量](内置变量.md)：

  ```toml
  [env]
  PROFILE_LOCATION = "${SystemDrive}/Users/Profile"
  ```

:::tip
可以在工作流中使用 [`Modify` 步骤](Steps.md#modify)修改自定义变量的值。
:::
