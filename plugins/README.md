# `plugins/` — OmniMux 核心业务插件套件

本目录存放预装在 OmniMux 桌面端中的 **22 个核心业务插件** 源码（含 `omnimux` 执行中枢、AI 角色工作室、参考视频复刻、视频剪辑工坊、工作流画布、插件市场及 BYOK 自备密钥支持）。

## 运行模式（官方网关 / 本地 Agent / BYOK 自带密钥）

插件中枢原生支持三种运行模式（`official` | `agent` | `key`）：
- **官方通道（`official`）**：连接 `omnimux.ai` 托管网关进行多模态角色与视频生成。
- **本地 Agent（`agent`）**：调用本机已安装的编程 Agent CLI 处理文本与分析任务。
- **自备密钥（`key` / BYOK）**：按用途（文本/分析/图像/视频/音频）直连用户自配的第三方供应商端点（如 fal、OpenAI、OpenRouter、SiliconFlow 或自定义端点）。

## 许可证与商业授权 (AGPLv3 + Section 7 Notice)

本目录全部自研插件适用本仓库根目录的 **[AGPLv3 许可证](../LICENSE)** 与 **[NOTICE 强制署名条款](../NOTICE)**：
- 个人使用、学术研究及遵守 AGPLv3 开源与署名义务的自托管完全免费。
- 严禁在未获取商业授权的情况下抹除 `OmniMux` 品牌标识进行白标转售（OEM），或将修改后的插件作为闭源商业 SaaS 服务对外收费运营。商业授权请查阅 [COMMERCIAL.md](../COMMERCIAL.md) 并联系 `hello@omnimux.ai`。
