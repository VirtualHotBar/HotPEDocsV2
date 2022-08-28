# 添加自定义驱动，把驱动打包成HotPE模块
## 工具
1. [HotPE模块制作工具](https://down.hotpe.top/HotPE%E6%A8%A1%E5%9D%97/HotPE%E6%A8%A1%E5%9D%97%E5%88%B6%E4%BD%9C%E5%B7%A5%E5%85%B72.1.exe)
2. [Dism++](https://dl.lancdn.com/landian/soft/dism/Dism%2B%2B10.1.1002.1.zip)
3. [Drvindex](https://download.s21i.faiusr.com/17110378/0/0/ABUIABBLGAAgp4qilAYokOGr3gc.exe?f=%E9%A9%B1%E5%8A%A8%E5%AE%89%E8%A3%85%E5%B7%A5%E5%85%B7DrvIndex_v5.2.0.6_x64.exe&v=1653114151)

## 步骤

1.用Dism++提取驱动

![](https://i.hotpe.top/i/2022/05/02/zgobuv.png)
![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwlux-0.png)


2.将驱动打包为.7z文件，使用7-Zip

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwvko-0.png)


3.打开HotPE模块制作工具填写基本信息，点击“下一步”

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwnna-0.png)

4.跳过嵌入文件步骤，点击“跳过此步骤(高级)”

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwq1u-0.png)


5.点击“编辑嵌入文件和脚本”

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwlvn-0.png)


6.将驱动包和Drvindex拖进HotPE模块制作工具

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwtg0-0.png)


7.添加脚本，复制以下内容到脚本，然后点击“完成编辑”：
```bash
EXEC %CurDir%\Drvindex.exe -b
//搜索当前目录下的驱动压缩包将自动匹配安装驱动
//%CurDir%表模块目录
```

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwkcr-0.png)


8.点击“开始制作”，等待制作完成

![简单图床 - EasyImage](https://i.hotpe.top/i/2022/05/02/zbwkm6-0.png)

制作好的模块就可以在HotPE中测试了
自动加载模块：[如何加载HotPE模块——自动加载](https://wiki.hotpe.top/#/course/loadhpm?id=%e8%87%aa%e5%8a%a8%e5%8a%a0%e8%bd%bd )











