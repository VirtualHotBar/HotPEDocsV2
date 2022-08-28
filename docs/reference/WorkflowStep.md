# WorkflowStep

工作流步骤基础信息。

## name

步骤名称，通常是步骤键名的标准英文句式。

- **类型：** `String`
- **示例**
  ```toml
  [setup_flow.install_vscode]
  name = "Install VSCode"
  ```

## type

步骤类型，必须为[步骤类型 API 参考](Steps.md)中指定的一种。

- **类型：** `Enum<String>`
- **示例**
  ```toml
  type = "Copy"
  ```

## if

条件语句，满足语句中的条件时才会执行当前步骤或步骤组。

- **类型：** `String`
- **示例**
  ```toml
  if = '${SystemDrive}=="X:"'
  ```

## elif

条件语句，

- **类型：** `String`
- **详情**

  必须紧随包含 `if` 或 `elif` 的步骤出现，当上一步骤因 `if` 或 `elif` 指定的语句结果为假而未执行时才会判断此步骤是否需要执行。

- **示例**

  ```toml
  [setup_flow.group_1]
  name = "Group 1"
  type = "Group"
  if = '${SystemDrive}=="X:"'

      [setup_flow.group_1._step_1]
      name = "Step 1"
      ...

  [setup_flow.group_2]
  name = "Group 2"
  type = "Group"
  elif = '${SystemDrive}=="C:"'

      [setup_flow.group_2._step_1]
      name = "Step 1"
      ...

  [setup_flow.group_3]
  name = "Group 3"
  type = "Group"
  elif = '${SystemDrive}=="D:"'

      [setup_flow.group_3._step_1]
      name = "Step 1"
      ...
  ```

## else

条件语句，必须紧随包含 `if` 或 `elif` 的步骤出现，当上一步骤因 `if` 或 `elif` 指定的语句结果为假而未执行时才会执行此步骤。

由于含 `else` 语句的步骤是否执行仅取决于上一步骤，因此无论 `else` 指定的语句结果是什么都不会影响其性质，推荐使用 `else = 'true'`。你完全可以使用 `else = 'false'`，不过这样做很不好（恼）。

- **类型：** `String`
- **示例**

  ```toml
  [setup_flow.group_1]
  name = "Group 1"
  type = "Group"
  if = '${SystemDrive}=="X:"'

      [setup_flow.group_1._step_1]
      name = "Step 1"
      ...

  [setup_flow.group_2]
  name = "Group 2"
  type = "Group"
  elif = '${SystemDrive}=="C:"'

      [setup_flow.group_2._step_1]
      name = "Step 1"
      ...

  [setup_flow.group_3]
  name = "Group 3"
  type = "Group"
  else = 'true'

      [setup_flow.group_3._step_1]
      name = "Step 1"
      ...
  ```

:::tip
字段 `if` `elif` `else` 在同一步骤中只能出现其中一个，否则会被 nep 视为无效的步骤而拒绝执行。
:::

## throw

异常处理字段，若当前步骤执行异常(退出码不等于`0`)则立即抛出指定的错误信息，然后退出当前工作流。

在不指定 throw 语句的情况下，出现异常后工作流会继续执行，不过在下一个逻辑步骤中 [`${ExitCode}`](内置变量.md#exitcode) 会不为`0`。

:::tip
这里 throw 真正的含义是“throw if error”，不太贴切，如果你有更好的命名建议请给我们发 issue
:::

- **类型：** `String`
- **示例**

  ```toml
  [setup_flow.start_vscode]
  name = "Start VSCode"
  type = "Execute"
  throw = "Can't start VSCode"

  command = "exec explorer ${Desktop}/Visual Studio Code.lnk"
  shell = "pecmd"
  ```

  在[步骤组](Steps.md#group)中的 throw 会捕获该组中步骤的所有异常：

  ```toml
  [setup_flow.install_group]
  name = "Install Group"
  type = "Group"
  # 使用一个throw语句捕获整组步骤的异常
  throw = "Group install failed"

      [setup_flow.install_group._install_1]
      name = "Install 1"
      type = "Execute"

      command = "./MySoftware/Installer1.exe /S"


      [setup_flow.install_group._install_2]
      name = "Install 2"
      type = "Execute"

      command = "./MySoftware/Installer2.exe /S"


      [setup_flow.install_group._install_3]
      name = "Install 3"
      type = "Execute"

      command = "./MySoftware/Installer3.exe /S"
  ```
