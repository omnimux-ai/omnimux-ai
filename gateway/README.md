# `gateway/` — OmniMux 服务端网关底座

本目录存放 **OmniMux 服务端网关（脱敏纯净版）** 源码。

## 定位与范围

- **包含内容**：基于 Go + React 的多模态模型接口转发（`/v1/*`）、异步视频与图像任务调度、基础账户与令牌管理控制台。
- **剔除内容（不随本目录发布）**：`omnimux.ai` 官网营销落地页、宣传视频与角色预设素材库、内部供应商采购底价账本（Pricing Ledger）以及生产环境 VPS 蓝绿部署脚本。

## 上游归属与许可证 (AGPLv3)

本模块基于 **[QuantumNous/new-api](https://github.com/QuantumNous/new-api)**（AGPL-3.0，原基于 [One API](https://github.com/songquanpeng/one-api) MIT）二次开发。

根据根目录 [LICENSE](../LICENSE)（AGPLv3）与 [NOTICE](../NOTICE)（AGPLv3 第 7 条附加条款）：
- 任何修改或部署本模块的用户，必须在界面显著位置保留作者署名 `Frontend design and development by New API contributors.`、原项目链接 <https://github.com/QuantumNous/new-api> 以及 `Powered by OmniMux`（<https://omnimux.ai>）。
- 通过网络对外提供服务（SaaS）时，必须向服务用户免费提供完整的修改版源码。
