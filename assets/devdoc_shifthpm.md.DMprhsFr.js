import{_ as a,c as i,o as n,ah as p}from"./chunks/framework.CGQFde8j.js";const F=JSON.parse('{"title":"PE集成HotPE模块","description":"","frontmatter":{},"headers":[],"relativePath":"devdoc/shifthpm.md","filePath":"devdoc/shifthpm.md","lastUpdated":1749313197000}'),l={name:"devdoc/shifthpm.md"};function t(e,s,h,k,r,d){return n(),i("div",null,s[0]||(s[0]=[p(`<h1 id="pe集成hotpe模块" tabindex="-1">PE集成HotPE模块 <a class="header-anchor" href="#pe集成hotpe模块" aria-label="Permalink to “PE集成HotPE模块”">​</a></h1><blockquote><p>本章节将实现把HotPE模块加入到你的PE，从而实现HotPE模块的功能</p></blockquote><h2 id="新版hpm加载器实现-推荐" tabindex="-1">新版HPM加载器实现(推荐) <a class="header-anchor" href="#新版hpm加载器实现-推荐" aria-label="Permalink to “新版HPM加载器实现(推荐)”">​</a></h2><p>仓库地址：<a href="https://github.com/VirtualHotBar/HPM-cli/" target="_blank" rel="noreferrer">https://github.com/VirtualHotBar/HPM-cli/</a></p><p>HPM-cil为命令行工具，无图形界面，请参考以下命令行参数帮助实现HPM相关功能：</p><div class="language-BATH"><button title="Copy Code" class="copy"></button><span class="lang">BATH</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>HPM(HotPE Module) Manager</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Usage: hpm_cli.exe [OPTIONS] [HPMPath]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Arguments:</span></span>
<span class="line"><span>  [HPMPath]  Sets the input file to use</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Options:</span></span>
<span class="line"><span>  -i, --install &lt;PATH&gt;             Install HPM package</span></span>
<span class="line"><span>  -q, --quickload &lt;QuickPATH&gt;      Quickly load HPM package</span></span>
<span class="line"><span>      --installpath &lt;installPath&gt;  Set install path</span></span>
<span class="line"><span>  -h, --help                       Print help</span></span>
<span class="line"><span>  -V, --version                    Print version</span></span></code></pre></div><h2 id="旧版hpm加载工具-将弃用" tabindex="-1">旧版HPM加载工具(将弃用) <a class="header-anchor" href="#旧版hpm加载工具-将弃用" aria-label="Permalink to “旧版HPM加载工具(将弃用)”">​</a></h2><p><a href="https://p0.hotpe.top/HotPE%E6%A8%A1%E5%9D%97/HotPEModDeploy.exe" target="_blank" rel="noreferrer">HotPEModDeploy下载</a></p><p>请独立参考HotPEModDeployTool命令行帮助完成：</p><p>以下是HotPEModDeploy命令行的使用方法（/help内容）:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HotPEModDeployTool2.3命令行帮助</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---------------------------------------------</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HotPEModDeploy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [method] [path] [/lp:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;loadPath&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] [/h] [/c]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---------------------------------------------</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">【method】必须</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---------------------------------------------</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">method</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">quick]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---------------------------------------------</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default:以默认模式进行加载</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">quick:以快速模式进行加载，不必再重新加载直接执行脚本，首先需要通过默认模式自定义模块加载目录进行加载</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">【path】必须</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---------------------------------------------</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当method</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> default时，path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 模块文件或放模块文件的目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当method</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> quick时，path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 模块加载目录，为通过默认模式进行加载后的模块加载目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---------------------------------------------</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">【/lp:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;loadPath&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">】可选</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">当method</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> default时，此参数可选，默认为&quot;X:\\Program Files\\HotPEModules</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">当method = quick时，不应存在此参数</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">---------------------------------------------</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">*说明：冒号和引号均为英文，必须存在引号</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">【其它参数】可选</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/h:隐藏UI</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/help:帮助</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">*注意：所有参数区分大小写</span></span></code></pre></div>`,11)]))}const c=a(l,[["render",t]]);export{F as __pageData,c as default};
