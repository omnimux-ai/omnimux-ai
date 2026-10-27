# plugins/

OmniMux 桌面端的功能插件。

> **源码尚未放入。** 将在桌面端正式发布时放入。

## 桌面端预装的插件

| 插件 | 作用 | 状态 |
| :--- | :--- | :--- |
| `omnimux` | 执行中枢：模型调用、生成任务、运行模式 | 正式 |
| `omnimux-video` | 带货视频生成与参考视频复刻 | 正式 |
| `omnimux-workflow` | 节点式工作流 | 正式 |
| `omnimux-clip` | 本地视频剪辑 | 正式 |
| `omnimux-inspiration` | 灵感收集与拆解 | 正式 |
| `omnimux-assets` | 素材管理 | 正式 |
| `omnimux-products` | 商品资料管理 | 正式 |
| `omnimux-market` | 技能与插件市场 | 正式 |
| `omnimux-accounts` | 平台账号连接 | 测试中 |
| `omnimux-publish` | 内容发布 | 测试中 |
| `omnimux-analytics` | 账号数据同步 | 测试中 |
| `omnimux-forms` | 表单交互 | 测试中 |

插件通过 npm 发布，桌面端安装包从 npm 获取并预装。本目录另含尚未进入桌面端的实验性插件。

## 运行模式

每类任务（文本、分析、图像、视频、音频）可以分别选择：

- **官方服务**：通过 omnimux.ai 生成，消耗积分。
- **本地 Agent**：调用本机已安装的编程 Agent 处理文本与分析。
- **自备密钥**：使用你自己的 fal、OpenAI、OpenRouter、SiliconFlow 或自定义服务密钥。

## 许可

OmniMux 自行编写的插件代码采用 AGPL-3.0-only，附 AGPLv3 第 7 条署名要求。源码仓 [omnimux-ai/omnimux-dsh](https://github.com/omnimux-ai/omnimux-dsh) 已于 2026-10-28 改为此许可，各插件包随附 LICENSE 与 NOTICE。从上游 fork 或引入的代码保留原许可证，相关插件目录内附有上游 LICENSE 与说明，汇总见 [NOTICE](../NOTICE)。

2026-10-28 之前发布到 npm 的版本，按其发布时声明的许可证授权（OmniMux Sustainable Source License 1.0，上游派生包为 MIT）。
