# API
## 静默安装

安装到系统：

```bash
HotPE安装包.exe /S [欲安装到的分区]
```
例：
```bash
HotPE安装包.exe /S C:\
```
---
安装到U盘：

```bash
HotPE安装包.exe /U [U盘索引]
```
例：
```bash
HotPE安装包.exe /U 4
```

## 获取HotPE模块列表
接口地址：https://api.hotpe.top/API/HotPE/GetHPMList/

请求方式：GET

返回格式：JSON 

请求示例：https://api.hotpe.top/API/HotPE/GetHPMList/


## 检查更新

接口地址：https://api.hotpe.top/API/HotPE/GetUpdate/

请求方式：GET

返回格式：JSON 

请求示例：https://api.hotpe.top/API/HotPE/GetUpdate/


