# `plugins/` — OmniMux 电商视频创作与工作流插件套件

本目录存放预装在 OmniMux 桌面端中的 **22 个核心业务插件** 源码，支撑跨境卖家从**找参考、拆解结构、制作商品套图与带货视频、本地剪辑到账号发布管理**的完整桌面工作区。

## 核心模块概览

- **创作与复刻**：`omnimux`（执行中枢与模型路由）、`omnimux-video`（带货视频生成与爆款复刻）、`omnimux-avatar`（AI 角色生成与多视角设定图）、`omnimux-studio` / `omnimux-apps`（成片应用工作台）。
- **画布与剪辑**：`omnimux-workflow`（可视化节点画布工作流）、`omnimux-clip`（本地时间轴视频剪辑、镜头拆分与字幕烧录）。
- **电商工作区**：`omnimux-inspiration`（爆款灵感采集与脚本拆解）、`omnimux-assets`（角色/场景/风格资产库）、`omnimux-products`（商品库）、`omnimux-accounts` 与 `omnimux-publish`（平台账号连接与发布管理）、`omnimux-browser`（浏览器采集扩展）、`omnimux-market`（技能与插件市场）。

## 三种运行模式（官方网关 / 本地 Agent / BYOK 自带密钥）

插件中枢原生支持按用途（文本 / 分析 / 图像 / 视频 / 音频）灵活绑定通道：
- **官方通道（`official`）**：连接 `omnimux.ai` 托管网关调用 Seedance、GPT Image、Nano Banana、Suno、Gemini 等调校模型。
- **本地 Agent（`agent`）**：调用本机已安装的编程 Agent CLI 处理文本与脚本分析任务。
- **自备密钥（`key` / BYOK）**：直连用户自配的第三方供应商端点（支持 fal、OpenAI、OpenRouter、SiliconFlow 或自定义端点）。

## 许可证与商业授权 (AGPLv3 + Section 7 Notice)

本目录全部自研插件适用本仓库根目录的 **[AGPLv3 许可证](../LICENSE)** 与 **[NOTICE 强制署名条款](../NOTICE)**：
- 个人使用、学术研究及遵守 AGPLv3 开源与署名义务的自托管完全免费。
- 严禁在未获取商业授权的情况下抹除 `OmniMux` 品牌标识进行白标转售（OEM），或将修改后的插件作为闭源商业 SaaS 服务对外收费运营。商业授权请查阅 [COMMERCIAL.md](../COMMERCIAL.md) 并联系 `hello@omnimux.ai`。
