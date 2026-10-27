# OmniMux — 发现、复刻和裂变电商爆款视频

<p align="center">
  <strong>Find, recreate & scale viral shoppable videos</strong><br>
  <sub>OmniMux 桌面端帮助 TikTok Shop、Instagram 与 YouTube 跨境卖家，用 AI 创作、复刻并发布带货视频，提高转化。</sub>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL v3"></a>
  <a href="COMMERCIAL.md"><img src="https://img.shields.io/badge/Commercial-Dual%20Licensing-success.svg" alt="Commercial Dual Licensing"></a>
  <a href="https://omnimux.ai"><img src="https://img.shields.io/badge/Website-omnimux.ai-black.svg" alt="Website"></a>
  <a href="https://docs.omnimux.ai"><img src="https://img.shields.io/badge/Docs-docs.omnimux.ai-purple.svg" alt="Documentation"></a>
</p>

---

## ✨ 产品定位：从商品创意到带货视频

把商品和创意交给桌面端 Agent，围绕 **对标 → 拆解 → 制作 → 发布 → 复盘** 跑通跨境电商带货内容工作流：

- **对标与拆解（Discover & Break down）**：通过浏览器扩展将刷到的参考视频与图文一键收进灵感库，拆解开场钩子、产品卖点与购买引导，整理成可复用的分镜脚本与提示词结构。
- **Agent 对话与画布制作（Create with Agent & Canvas）**：通过对话让 OmniMux Agent 规划并生成内容，或在可视化画布中连接图片、视频、配音与剪辑节点搭建可复用工作流；覆盖**商品套图上新、商品生视频、爆款视频复刻、图文带货轮播、AI 角色与多角度设定图、本地视频剪辑与字幕烧录**。
- **多端协同入口（Surfaces）**：
  - **OmniMux 桌面端（macOS & Windows）**：集成画布、资产库、灵感库与全部创作工具的本地工作台，支持连接官方托管网关、调用本机编程 Agent 或配置自备密钥（BYOK）。
  - **CLI 与编程 Agent 接入**：在 Codex、Claude Code 等常用 Agent 中直接调用视频、图片与分析能力。
  - **浏览器扩展**：浏览网页时一键采集参考素材，无缝同步回桌面端拆解与复刻。

> **能力与边界说明**：本仓库是 OmniMux 面向开发者与自托管用户的统一代码总仓（采用“内部独立研发、发版单向脱敏同步”架构）。页面中的流程示意数据不代表实时抓取承诺；社媒账号连接与发布能力以实际交付模块与各平台规则为准；`omnimux.ai` 官网可选体验包、订阅套餐或按次充值积分以线上实际价目与钱包权益为准。

---

## 🗂️ 仓库三大模块 (`gateway/` · `desktop/` · `plugins/`)

| 目录 | 定位与职责 | 上游基础与致谢 |
| :--- | :--- | :--- |
| **[`gateway/`](./gateway/)** | **服务端网关底座**：负责多模态模型接口转发（视频/图像/音频/文本）、参考视频拆解与复刻任务调度、社媒连接接口及账户额度结算基础框架（已剔除官网营销落地页与私有渠道采购底价账本）。 | 基于 **[QuantumNous/new-api](https://github.com/QuantumNous/new-api)**（AGPLv3）与 [One API](https://github.com/songquanpeng/one-api)（MIT）二次开发 |
| **[`desktop/`](./desktop/)** | **跨平台桌面启动器**：支持 macOS 与 Windows 的 Electron 本地宿主外壳；打包构建时自动从同级 [`plugins/`](./plugins/) 目录预装全套业务插件。 | 基于 **[anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop)**（MIT）与 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) |
| **[`plugins/`](./plugins/)** | **核心业务插件套件**：桌面端预装的 22 个电商创作与工作流插件（含 `omnimux` 执行中枢、爆款视频复刻、AI 角色工作室、视频剪辑工坊、可视化画布、灵感与资产库、浏览器扩展伴侣、插件市场及 BYOK 自备密钥支持）。 | 融合 [@cocofhu/skillhub](https://github.com/cocofhu/skillhub)、[Augani/openreel-video](https://github.com/Augani/openreel-video)、[liustack/dsh-viewer](https://github.com/liustack/dsh-viewer)、[Lum1104/dsh-browser](https://github.com/Lum1104/dsh-browser) 等开源组件 |

---

## 📜 许可证与商业授权 (AGPLv3 + Section 7 Notice)

本仓库整体采用 **[GNU Affero General Public License v3.0 (AGPLv3)](./LICENSE)** 授权，并适用 **[NOTICE](./NOTICE)** 中的 **AGPLv3 第 7 条附加条款**：

1. **网络服务与修改源码公开（AGPLv3 第 13 条）**：如果您修改了本仓库中的代码并通过网络对外提供服务（SaaS）或分发软件包，您必须向全部用户免费提供完整的修改版源代码。
2. **强制保留品牌与原作者署名（AGPLv3 第 7 条）**：任何基于本仓库的衍生版本或部署实例，必须在用户界面的显著位置（页脚、关于页及法律声明）同时保留：
   - **OmniMux 官方署名与链接**：`Powered by OmniMux`（指向 <https://omnimux.ai>）
   - **上游 new-api 法定署名与链接**：`Frontend design and development by New API contributors.` 及指向 <https://github.com/QuantumNous/new-api> 的可见链接（详见 [NOTICE](./NOTICE)）
3. **商业闭源与去标授权（Commercial License）**：如果您希望在商业产品中移除 `OmniMux` 品牌标识（OEM 贴牌）或豁免自研插件与桌面端的 AGPLv3 开源义务，请查阅 **[COMMERCIAL.md](./COMMERCIAL.md)** 并联系 **[hello@omnimux.ai](mailto:hello@omnimux.ai)** 获取商业授权。对于涉及上游 `new-api` 的商业授权需求，请联系 `support@quantumnous.com`。
