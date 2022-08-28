# Service

在打包服务型软件资源时需要提供服务配置来控制服务，nep 会向用户提供相应操作界面便于集中管理全部服务。

- **参数**

  - `progress :String`：进程名，用于判断服务运行状态
  - `start :String`：启用服务命令
  - `stop :String`：停止服务命令

- **示例**

  ```toml
  [service]
  progress = "sshd.exe"
  start = "./sshd.exe"
  stop = "taskkill /im sshd.exe /t"
  ```

:::tip
命令默认使用 cmd 进行解释
:::