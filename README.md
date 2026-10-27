# OmniMux

**发现、复刻和裂变电商爆款视频** · Find, recreate & scale viral shoppable videos

OmniMux 桌面端帮助 TikTok 跨境卖家，用 AI 创作、复刻并发布带货视频。

[官网](https://omnimux.ai) · [文档](https://docs.omnimux.ai) · [许可证](./LICENSE) · [商业授权](./COMMERCIAL.md)

> **状态：源码尚未发布。** 本仓库是 OmniMux 计划中的统一源码仓库，目前只有目录结构与许可文件。各模块的源码会在对应版本正式发布时放入，届时本页会同步更新。

---

## 产品能做什么

围绕「对标 → 拆解 → 制作 → 发布 → 复盘」这条创作链路：

| 能力 | 状态 |
| :--- | :--- |
| 拆解参考视频的开场钩子、卖点与购买引导 | 可用 |
| 用你的商品或 AI 角色复刻参考视频 | 可用 |
| 生成 AI 角色与多角度设定图 | 可用 |
| 灵感社区 | 可用 |
| 发布到 TikTok | 测试中。官方直连默认关闭，开启后默认仅自己可见 |
| 发布到 Instagram、Facebook、YouTube 等海外平台 | 测试中，经第三方代理服务 |
| 账号数据同步与复盘 | 测试中 |

生成需要登录 [omnimux.ai](https://omnimux.ai) 并消耗积分。可选体验包、订阅套餐，也可充值后按次付费，以官网当前价目和钱包权益为准。

---

## 仓库结构

| 目录 | 内容 | 主要上游 |
| :--- | :--- | :--- |
| [`gateway/`](./gateway/) | 服务端网关：模型接口转发、异步生成任务、账户与积分结算 | [QuantumNous/new-api](https://github.com/QuantumNous/new-api) |
| [`desktop/`](./desktop/) | macOS 与 Windows 桌面客户端外壳 | [anywhere-labs/deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) |
| [`plugins/`](./plugins/) | 桌面端功能插件 | 见 [NOTICE](./NOTICE) |

---

## 许可证

本仓库中 OmniMux 自行编写的代码采用 **[AGPL-3.0](./LICENSE)**，并附加 [NOTICE](./NOTICE) 中的 AGPLv3 第 7 条署名要求。

- **可以**：个人、团队或企业免费使用、修改、自行部署，包括商业用途。
- **必须**：修改后通过网络提供服务或分发时，向你的用户公开对应的完整源码；在界面中保留 OmniMux 与 new-api 的署名和链接。
- **第三方代码**：各上游项目的代码保留其原有许可证，不因放入本仓库而改变。详见 [NOTICE](./NOTICE)。

不想公开修改，或想移除 OmniMux 品牌：桌面端与插件中 OmniMux 自行编写的部分，见 [COMMERCIAL.md](./COMMERCIAL.md)。网关部分的版权归 new-api 作者，相关授权需联系 [support@quantumnous.com](mailto:support@quantumnous.com)。

2026-10-28 之前发布到 npm 的插件版本，继续按其发布时的许可证授权（Sustainable Source 1.0 或 MIT）。

网关公开时包含落地页在内的完整前端，与线上运行版本一致。
