<div align="center">

# dsh-aside · 旁注

把追问留在原文旁边：为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 提供可持久化、只读的侧边对话。

[English](README.en.md) · [安装](#安装) · [使用](#使用) · [卸载](#卸载) · [参与开发](#参与开发)

[![CI](https://github.com/ywzhang1031/dsh-aside/actions/workflows/ci.yml/badge.svg)](https://github.com/ywzhang1031/dsh-aside/actions/workflows/ci.yml)
[![GitHub stars](https://img.shields.io/github/stars/ywzhang1031/dsh-aside?style=flat)](https://github.com/ywzhang1031/dsh-aside/stargazers)
[![npm version](https://img.shields.io/npm/v/dsh-aside)](https://www.npmjs.com/package/dsh-aside)
[![npm downloads](https://img.shields.io/npm/dm/dsh-aside)](https://www.npmjs.com/package/dsh-aside)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.1.0--rc.7-4b5563)](https://github.com/deepseek-ai/deepseek-harness)

</div>

## 为什么做旁注

我经常在一段很长的回答里遇到某个忘了、不懂，或者想继续推导的知识点、概念与公式。

直接在主对话里追问，边线问题很容易越问越远，回头时已经忘了最初要完成什么；另开一条对话，又会丢失当时的上下文。有些侧边对话虽然能暂时分流，但不持久，隔天再打开时，也很难想起自己当初究竟卡在哪里。

**旁注**把一条追问绑定到主对话中的具体文字，并以独立的只读会话持久保存。下一次打开主对话，仍然可以从原文高亮、消息按钮或右侧栏回到当时的问题。

它更像写在书页边上的批注：当下不打断主线，日后还能知道自己为什么问，在原来的语境里温故而知新。

## 预览

![当前主对话的旁注侧栏](docs/images/aside-sidebar.jpg)

| 创建旁注草稿 | 继续多轮旁注 |
| --- | --- |
| ![带引用原文、模型与只读状态的旁注草稿](docs/images/aside-draft.jpg) | ![持久化的多轮旁注对话](docs/images/aside-conversation.jpg) |

## 能做什么

- **锚定具体原文**：选中助手回复中的文字，或点击消息上的 💬 按钮，就地发起追问。
- **保持主线干净**：旁注 fork 主对话已经完成的上下文，但不把边线问题写回主线程。
- **持久化恢复**：锚点和旁注关系保存在 DSH 会话日志中，不依赖 `localStorage`；刷新和重启后仍可恢复。
- **侧栏内使用**：旁注只出现在所属主对话的右侧栏，不会挤进左侧会话列表。
- **统一输入体验**：草稿和已有旁注都可以选择模型、Reasoning 等级及白名单命令。
- **固定只读**：旁注创建时写入 `sandbox/mode: read-only` 与 `approval/policy: never`，不能在抽屉中扩大权限。

## 安装

已有 DeepSeek Harness `0.1.0-rc.7` 时，只需一行：

```sh
dsh plugin --profile web add dsh-aside
```

随后重启 `dsh web`。如果尚未安装 DSH：

```sh
npm install -g @deepseek-ai/dsh@0.1.0-rc.7 pnpm@11.7.0
```

公开入口包会自动安装并组合 Host 与 Web UI 两个内部运行包；用户无需克隆仓库、构建源码或关心加载顺序。

## 使用

1. 在已完成的助手回复里选中文字，点击 **就此提问**；也可以点击该消息的 💬 按钮。
2. 在草稿抽屉里确认引用原文，按需选择模型与 Reasoning，然后发送问题。真正发送前不会创建旁注。
3. 继续在抽屉中多轮追问；旁注始终保持只读。
4. 以后从高亮原文、💬 按钮或右侧 **旁注聊天** 列表重新进入。若原消息尚未加载，插件会自动补载更早历史再定位原文。

## 卸载

直接使用官方卸载命令：

```sh
dsh plugin --profile web remove dsh-aside
```

在仓库内开发时，也可以使用跨平台辅助脚本；它兼容此前的双包本地安装：

```sh
pnpm plugin:uninstall -- --profile web
```

完成后重启 `dsh web`。卸载只会从 profile 中移除插件 bundle，**不会删除已经存在的主对话或旁注会话日志**。

## 安全与兼容性

- 只读限制覆盖文件系统，但不等同于无网络能力的安全沙箱：旁注仍可执行只读 Shell、读取文件并抓取网页。
- stock `tool-fs` 仍会向模型展示 `write` / `edit`，但调用会被只读沙箱与拒绝审批策略阻断。
- 精确高亮依赖可恢复的渲染文本；遇到重复片段、Markdown 渲染差异或浏览器不支持 Custom Highlight API 时，会降级为消息级定位。
- 旁注子会话通过 DSH 公开的 archive 投影从左侧导航隐藏，日志与 Workspace 归属不会被删除。
- 当前只验证 DSH `0.1.0-rc.7`；升级 DSH 前建议先运行本仓库的 `pnpm verify`。

## 参与开发

```sh
pnpm install
pnpm test       # 94 tests
pnpm build
pnpm run pack
pnpm smoke      # 隔离 DSH_HOME：安装、冷启动、卸载
pnpm verify     # test + build + pack + smoke
```

Host、Web UI、生成产物与发布 manifest 都由本仓库维护，不需要 DeepSeek Harness monorepo。实现细节见 [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)。欢迎提交 Issue 与 Pull Request；功能声明应与可验证代码保持一致。

## License

[MIT](LICENSE) © [ywzhang1031](https://github.com/ywzhang1031)
