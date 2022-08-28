# Package

资源包的基本信息。

## name

包名，简名标识资源包内容的字段。

- **类型：** `String`
- **细节**

  包名中不能包含 `_`。如果需要使用 `_` 分割内容，请用空格或 `-` 达到近似目的。例如 `frp-server` 或 `IntelliJ IDEA Community`。
  :::tip
  注意仅能使用 `-` 分割同名软件的不同版本，详见[规范](/misc/norm.md#使用-分割同名软件的不同版本)。
  :::

  *不要*在包名中提供代指版本号的数字，例如 `VMware Workstation 16` 就是一个不规范的名称，这会导致用户无法接收大版本更新，因此请将其改为 `VMware Workstation`，然后将版本号的首位置为 `16`。

- **示例**
  ```toml
  name = "Visual Studio Code"
  ```

## type

资源包内容类型。

- **类型：** `Enum<String>`
- **取值：** `{"Software", "Driver", "Manifest", "Runtime"}`
- **细节**

  `Software` 代表软件；

  `Driver` 代表驱动程序；

  `Manifest` 代表[清单资源包](/misc/property.md#清单资源包)；

  `Runtime` 代表运行时，例如 `dotNet Framework` `Python` `Microsoft Visual C++ Runtime Library` 等。

  :::tip
  截至目前，nep 尚未支持 `Driver`。
  :::

- **示例**
  ```toml
  type = "Software"
  ```

## version

资源包内容版本号。

- **类型：** `String`
- **细节**

  资源包版本号的取值使用 4 位的"拓展 Semver 规范"：前三位称为"上游版本号"，通常会遵循 [Semver](https://semver.org/lang/zh-CN/) 规范；最后一位称为"自留版本号"，由资源包打包者自留，用于发布*在上游分发不变的情况下*由打包引起的更新，默认置 `0`。

  上游版本号通常来源于软件官方发布页或是软件主程序的产品版本号；对于驱动来说则使用 Windows 设备管理器中标识的驱动程序版本。如果上游版本号不遵循 Semver 规范，则截取或拓展前三位作为上游版本号；这意味着会忽略像 `ChromeDev` 这类的软件的 nightly 更新，不过我们认为这些感知不强的更新本来就没有必要推送给普通用户。

  根据校验规则，禁止在版本号中出现非数字且非`.`的字符，请考虑将不规范的版本字符删除或移动到包名中；对于 `-beta` `-rc` 这类标识版本阶段的字符，我们建议不制作此阶段的资源，而是等待上游发布正式版。

- **示例**
  ```toml
  version = "2.3.3.0"
  ```

## authors

打包者与内容提供方。

- **类型：** `Array<String>`
- **细节**

  通常来说此数组的元素有两个，第一个元素为 nep 资源包打包者，第二个元素为资源内容提供方；如果打包者同时也是内容提供方则只需保留一个元素即可。

  支持在元素中附加联系方式：GitHub `Nickname <@github_id>` QQ `Nickname <QQ1000000>` 邮箱 `Nickname <user@domain.com>`。

- **示例**
  ```toml
  authors = [
      "Cno <@Cnotech>",
      "Microsoft"
  ]
  ```

## description

资源的简短描述。

- **类型：** `String`
- **细节**

  简短描述的内容不能过长，通常一句话足矣。

  尽量使用来自资源内容提供方的描述（例如 GitHub 仓库简介或 readme 中的恰当概括），如果无法找到贴切的官方描述则自行概括。
  
  使用的语言应当与镜像站服务语言一致，或是使用英语。

- **示例**
  ```toml
  description = "微软开发的跨平台开源编辑器"
  ```

## licence

资源对应的许可证名称或用户协议链接。

- **类型：** `String`
- **细节**

  如果资源是使用知名协议的开源软件，此值可以为 `GPL-3.0` `MIT` `MPL-2.0` 等 [SPDX 协议标识符](https://spdx.org/licenses/)；

  如果资源是商用软件，此值可以是一个指向用户协议网页的 URL 链接；

  如果资源没有提供明确的协议，则根据实际情况使用枚举 `{"Freeware", "Proprietary", "Public Domain", "Shareware", "Unknown"}` 中的一个值，并在无法确定时使用 `Unknown`。

- **示例**
  ```toml
  licence = "MIT"
  ```

## compat \*

（可选）兼容的系统版本。

- **类型：** `Array<Enum<String>>`
- **取值：** `{"win10", "win11", "edgeless"}`
- **细节**

  缺省表示不进行兼容性检查。

- **示例**
  ```toml
  compat = ["win10","win11","edgeless"]
  ```

## protocol

遵守的 nep 协议版本号。

- **类型：** `String`
- **细节**

  此版本号表示整个 nep 包的版本号，此包应当完全符合该版本下的包规范。

- **示例**
  ```toml
  protocol = "0.1.0"
  ```