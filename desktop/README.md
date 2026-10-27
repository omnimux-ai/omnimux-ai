# `desktop/` — OmniMux 跨平台桌面端外壳

本目录存放 **OmniMux Desktop 桌面端启动器外壳** 源码（正式发版时由内部开发仓单向同步至此）。

## 定位与预装关系

- **桌面端外壳 + 隔壁 [`../plugins/`](../plugins/) = 完整桌面客户端**。
- 本目录提供 Electron 跨平台宿主启动器、本地运行环境管理与安装包构建脚本；构建桌面端时，打包流程会自动读取同级 [`../plugins/`](../plugins/) 目录并将全套 OmniMux 业务插件预装进安装包中。

## 上游归属与许可证

- 底层桌面宿主基于 **[anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop)**（MIT License，Copyright © 2026 Anywhere Labs）与 **[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)** 构建。
- 随本总仓整体分发时适用根目录 [LICENSE](../LICENSE)（AGPLv3）与 [NOTICE](../NOTICE) 附加署名条款；如需移除 OmniMux 品牌进行商业 OEM 贴牌分发，请查阅 [COMMERCIAL.md](../COMMERCIAL.md)。
