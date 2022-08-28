# UserConfigItem

用户配置变量元素，支持定义 `bool` `int` `String` 三种类型的变量，然后通过 `${uc.KEY_NAME}` 调用。

:::tip
`int` 类型变量使用 `int64` 表达，支持的范围为 `-9223372036854775808 ~ 9223372036854775807`。
:::

- **通用参数**

  - `name :String`：变量名称
  - `description :String`：变量描述，用于向用户说明此变量用途
  - `default :T`：默认值，类型 `T` 只能为 `{bool, int, String}` 中的一种
  - `options :Array<{title :String, value :T}>`：（可选）值选项，`title` 为该选项描述，`value` 为该选项对应的值，类型必须与 `default` 一致；缺省时根据类型自动提供选择/输入界面

## 布尔型

此时 `options` 缺省为 `[ { title = "是", value = true }, { title = "否", value = false } ]`。

- **示例**

  ```toml
  [uc.AUTO_RUN]
  name = "自动启动"
  description = "安装完成后启动VSCode"
  default = false
  options = [
      {
          title = "是",
          value = true
      },
      {
          title = "否",
          value = false
      }
  ]
  ```

  随后在配置工作流中使用用户配置变量：

  ```toml
  [setup_flow.start_vscode]
  name = "Start VSCode"
  type = "Execute"
  if = "${uc.AUTO_RUN}==true"

  command = "explorer ${Desktop}/Visual Studio Code.lnk"
  ```

## 整型

此时缺省 `options` 则会提供输入框。

- **校验参数**

  - `min :int`：（可选）值的最小值，要求用户输入的数不小于此值
  - `max :int`：（可选）值的最大值，要求用户输入的数不大于此值

- **示例**

  ```toml
  [uc.VOLUME]
  name = "音量"
  description = "启动时的默认音量"
  default = 67

  max = 100
  min = 0
  ```

## 字符串型

此时缺省 `options` 则会提供输入框。

- **校验参数**

  - `regex :String`：（可选）校验正则，要求用户输入的内容满足此正则表达式
  - `tip :String`：（可选）正则校验失败提示

- **示例**

  ```toml
  [uc.RESOLUTION]
  name = "分辨率"
  description = "启动程序时使用的分辨率"
  default = "1920x1080"

  options = [
      {
          title = "1920 x 1080",
          value = "1920x1080"
      },
      {
          title = "800 x 600",
          value = "800x600"
      }
  ]
  ```

  ```toml
  [uc.HOMEPAGE]
  name = "主页"
  description = "浏览器主页"
  default = "https://home.edgeless.top"

  regex = '^https?:\/\/[^\s]*$'
  tip = "请输入 http:// 或 https:// 开头的网址"
  ```

:::tip
可以在工作流中使用 `Modify` 步骤修改自定义变量的值。
:::
