# OmniMux (`omnimux-ai/omnimux-ai`)

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL v3"></a>
  <a href="COMMERCIAL.md"><img src="https://img.shields.io/badge/Commercial-Dual%20Licensing-success.svg" alt="Commercial Dual Licensing"></a>
  <a href="https://omnimux.ai"><img src="https://img.shields.io/badge/Website-omnimux.ai-black.svg" alt="Website"></a>
  <a href="https://docs.omnimux.ai"><img src="https://img.shields.io/badge/Docs-docs.omnimux.ai-purple.svg" alt="Documentation"></a>
</p>

**OmniMux** 聚焦于 **AI 角色生成与参考视频复刻**（从文字或照片建立角色，结合参考视频制作角色视频）。

本仓库是 OmniMux 面向开发者与自托管用户的**统一代码总仓**，采用“内部独立研发、发版单向脱敏同步”的架构，将服务端网关底座、跨平台桌面端外壳与核心业务插件统一收敛在三个顶层目录中。

---

## 🗂️ 仓库三大模块 (`gateway/` · `desktop/` · `plugins/`)

| 目录 | 定位与职责 | 上游基础与致谢 |
| :--- | :--- | :--- |
| **[`gateway/`](./gateway/)** | **服务端网关底座**：负责多模态模型接口转发、异步媒体任务轮询、账户与额度结算基础框架（不含官网营销落地页与私有渠道账本）。 | 基于 **[QuantumNous/new-api](https://github.com/QuantumNous/new-api)**（AGPLv3）与 [One API](https://github.com/songquanpeng/one-api)（MIT）二次开发 |
| **[`desktop/`](./desktop/)** | **跨平台桌面启动器**：基于 Electron 的本地宿主外壳，打包构建时自动从同级 [`plugins/`](./plugins/) 目录预装全套业务插件。 | 基于 **[anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop)**（MIT）与 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) |
| **[`plugins/`](./plugins/)** | **核心业务插件套件**：桌面端预装的 22 个创作与工作流插件（含 AI 角色工作室、视频复刻、剪辑工坊、画布编排、插件市场与 BYOK 自备密钥支持）。 | 融合 [@cocofhu/skillhub](https://github.com/cocofhu/skillhub)、[Augani/openreel-video](https://github.com/Augani/openreel-video)、[liustack/dsh-viewer](https://github.com/liustack/dsh-viewer)、[Lum1104/dsh-browser](https://github.com/Lum1104/dsh-browser) 等开源组件 |

> **说明**：本总仓仅包含上述可公开编译的模块代码，不包含 `omnimux.ai` 托管云服务的私有运维编排、上游供应商底价台账及官网营销素材。官网生成服务费用与套餐权益以 `omnimux.ai` 实际结算为准。

---

## 📜 许可证与商业授权 (AGPLv3 + Section 7 Notice)

本仓库整体采用 **[GNU Affero General Public License v3.0 (AGPLv3)](./LICENSE)** 授权，并适用 **[NOTICE](./NOTICE)** 中的 **AGPLv3 第 7 条附加条款**：

1. **网络服务与修改源码公开（AGPLv3 第 13 条）**：如果您修改了本仓库中的代码并通过网络对外提供服务（SaaS）或分发软件包，您必须向全部用户免费提供完整的修改版源代码。
2. **强制保留品牌与原作者署名（AGPLv3 第 7 条）**：任何基于本仓库的衍生版本或部署实例，必须在用户界面的显著位置（页脚、关于页及法律声明）同时保留：
   - **OmniMux 官方署名与链接**：`Powered by OmniMux`（指向 <https://omnimux.ai>）
   - **上游 new-api 法定署名与链接**：`Frontend design and development by New API contributors.` 及指向 <https://github.com/QuantumNous/new-api> 的可见链接（详见 [NOTICE](./NOTICE)）
3. **商业闭源与去标授权（Commercial License）**：如果您希望在商业产品中移除 `OmniMux` 品牌标识（OEM 贴牌）或豁免自研插件与桌面端的 AGPLv3 开源义务，请查阅 **[COMMERCIAL.md](./COMMERCIAL.md)** 并联系 **[hello@omnimux.ai](mailto:hello@omnimux.ai)** 获取商业授权。对于涉及上游 `new-api` 的商业授权需求，请联系 `support@quantumnous.com`。
