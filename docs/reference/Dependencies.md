# Dependencies

依赖信息，指定使用资源前需要完成安装的其他资源，如运行库、运行时等。

- **参数**

  - `required :Array<{name:String, version:String}>`：（可选）必须安装的依赖
  - `suggested :Array<{name:String, version:String, remark:String}>`：（可选）（为了达到更好的用户体验）推荐安装的依赖

- **细节**

  `version` 支持在版本号前使用 `>=` `<=` `>` `<` 表达依赖要求，值为 `0.0.0` 则表示无版本限制。

  指定的 `version` 不一定会被安装，`ept` 会自动选择一个可能的最合适版本执行安装。

- **示例**

  ```toml
  [dependencies]
  required = [
      {
          name="dotnet",
          version="3.5.0"
      }
  ]
  suggested = [
      {
          name="PowerShell",
          version="0.0.0",
          remark="如果不安装 PowerShell 则无法运行 .ps1 脚本"
      },
      {
          name="Nodejs-runtime",
          version=">=14.0.0",
          remark="如果需要爬虫功能则必须安装此依赖"
      }
  ]
  ```
