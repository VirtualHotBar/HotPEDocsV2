# Software

软件资源包的独占信息。
## scope
软件名称作用域，用于区分来自不同内容提供方的同名软件。
- **类型：** `String`
- **细节**

  通常直接使用内容提供方的全小写名称作为值。在安装时，没有名称冲突的软件可以使用 `ept install SOFTWARE_NAME` 和 `ept install SCOPE/SOFTWARE_NAME` 两种方式指定安装同一款软件。

- **示例**
  ```toml
  scope = "microsoft"
  ```
## upstream

软件上游 URL，打包者获取此软件的官方发布页面。

- **类型：** `String`
- **细节**

  通常使用包含明显“下载”按钮的官方网站作为上游链接，如果没有提供这样的页面则使用软件官方网站首页或类似于 GitHub 仓库链接的地址。

- **示例**
  ```toml
  upstream = "https://code.visualstudio.com/"
  ```

## category

软件分类，用于标识软件的大致应用范围。

- **类型：** `String`
- **细节**

  推荐使用 Edgeless PE 下载站已有分类中的一种。如果认为没有合适的分类请新建分类。

- **示例**
  ```toml
  category = "集成开发"
  ```

## alias *

（可选）软件别名，用户可以使用别名快速安装此软件。

- **类型：** `String`
- **细节**

  别名的长度必须不少于5位，因为诸如 `code` 这类的短别名非常容易引起冲突。

- **示例**
  ```toml
  alias = "VSCode"
  ```

## tags

软件标签，用于关联同类软件，便于用户快速查找相似软件。

- **类型：** `Array<String>`
- **细节**

  建议将资源名称的非别名同义词（如 `Visual Studio Code` 的同义词有 `vsc` `code` 等）和相关话题（如 `electron`）加入此处，可以在别名、分类或作者中体现的标签（如`vscode` `集成开发` `IDE` `Microsoft`）请不要重复加到这里。

- **示例**
  ```toml
  tags = ["vsc", "code", "electron"]
  ```

## language

软件语言。

- **类型：** `Enum<String>`
- **取值：** `{"Multi", "zh-CN", "en-US"}`
- **细节**

  `Multi` 表示支持多语言。
  
  :::tip
  暂不支持小语种（包括繁体中文）。
  :::

- **示例**
  ```toml
  language = "Multi"
  ```
