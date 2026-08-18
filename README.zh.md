# Aside · 旁注

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）打造的**只读旁注**：在助手回复中选中任意一段文字，就地在一条**只读的旁注对话**里追问细节——旁注从主对话的上下文 fork 而来，不污染主线程、不占用它的 token 预算、也没有任何修改文件的能力。

**纯插件：零源码修改、零预设文件、零部署配置。** 直接跑在 stock DSH 上——克隆、装两个包、重启即可。

## 为什么需要它

模型输出一大段回答后，你常常想就某个小知识点追问（"这里说的*平衡已完成轮次前缀*是什么意思？"），但又不想：

- 污染主对话的上下文窗口，
- 把边角问题混进主线程的历史，
- 或让这个追问拥有任何改文件的能力。

**旁注（aside）**正是为此而生：一条子会话，fork 入父会话的已完成轮次历史，由只读世界组装而成，通过消息上的 💬 按钮、侧栏「旁注聊天」或会话列表随时重入。

## 功能

- **选中即问**：在已完成的助手回复中选中文字（2–800 字符），浮出**就此提问**按钮；点击打开**空白**草稿抽屉——真正发送前不创建任何东西。
- **消息级入口**：每条终态助手消息的 stock 动作条上都有一个 💬 按钮（与 `ui-message-feedback` 同一个扩展点），携带该消息的精确 id。
- **上下文 fork**：旁注日志以父会话的平衡已完成轮次前缀作为 seed（与 `session.fork` RPC 相同的切法）——读到主对话完整状态，却不共享它的 token 预算。
- **Codex 式侧栏**：产出文件、网页搜索来源、当前对话的旁注聊天。
- **草稿语义**：关闭未发送的草稿不留任何痕迹——没有会话、没有锚点。

## 安全模型：只读三重保证

旁注是一个普通 Session，创建时固定在一套**无法从内部扩大**的约束之下：

1. **组合**——旁注代理由只读世界（`composeReadOnlyWorld`）组装：Shell、文件读取与检索、网页搜索/抓取、Skills、只读 persona。没有委派、没有 goal、没有编辑器、没有后台任务。（已在真实 stock web 组合上端到端验证：旁注的可见工具集**精确等于** `read, read_image, glob, grep, bash, web_search, web_fetch, skill, write, edit`——且每次 `write`/`edit` 调用都被拒绝。）
2. **`sandbox/mode: read-only`**——创建时播种进旁注会话日志；此后每次受限的 bash/fs 调用都折叠到 OS 级只读沙箱（seatbelt/landlock/bwrap）。写操作永远到不了文件系统。
3. **`approval/policy: never`**——与前者一同播种，连沙箱升级通道都确定性地解析为 `rejected`。

两个种子都是会话日志事件，重启回放后依然生效。旁注继承父会话的工作区（`cwd`）与模型路由。

### 诚实的边界

- **写操作是被拒而非被隐藏。** stock `tool-fs` 没有只读模式，模型*看得到* `write`/`edit`；每次调用都被确定性拒绝（策略 + OS 沙箱）。结果相同，表面略"脏"。
- **只读覆盖文件系统，不覆盖网络。** 旁注可以抓取网页、跑只读 shell；请把它当作问答界面，而非安全沙箱。
- **没有原文内联高亮。** stock `MarkdownText` 没有装饰钩子，被问文字不会在主对话原文中高亮。重入走 💬 按钮、侧栏与会话列表。
- **会话列表平级展示。** 旁注不带自定义 `origin`（stock 会话头只接受 `subagent`），因此以普通子会话形式平级展示，而非独立的嵌套种类。

## 安装（stock DSH）

需要一个 stock [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 安装（web profile）。无需任何源码修改。

### 第 0 步——用 npm 安装 DSH 本体（一次性，不需要 monorepo）

```sh
npm install -g @deepseek-ai/dsh        # latest = 0.1.0-rc.7——本插件构建所针对的版本
dsh --help                             # 确认可用（`dsh plugin add` 还需要 PATH 里有 pnpm）
```

仅此而已——不用克隆 DeepSeek Harness，不用构建任何东西。`dsh` 命令会在 `~/.dsh` 下自管 profile。

### 方式 A——tarball（推荐，无需 npm 发布）

```sh
# 1. 克隆本仓库并打包两个包
git clone https://github.com/ywzhang1031/dsh-aside.git
cd dsh-aside
npm run pack          # → dist/*.tgz

# 2. 安装进你的 DSH profile（顺序重要：先 host 后 client）
dsh plugin add ./dist/ywzhang1031-dsh-aside-host-0.1.0.tgz
dsh plugin add ./dist/ywzhang1031-dsh-client-ui-aside-0.1.0.tgz

# 3. 启动 DSH——两行自动接入组合
dsh web
```

每个包都声明了 `dsh.bundle.patch`，`dsh plugin add` 会自动把它的行接入 web 组合的层栈。不需要 overlay 文件，不需要手动配置。

### 方式 B——overlay

如果你更喜欢显式 patch 文件：

```sh
dsh plugin add ./dist/ywzhang1031-dsh-aside-host-0.1.0.tgz
dsh plugin add ./dist/ywzhang1031-dsh-client-ui-aside-0.1.0.tgz
dsh web --patch /path/to/dsh-aside/examples/aside.yml
```

### 方式 C——npm（发布后可用）

```sh
dsh plugin add @ywzhang1031/dsh-aside-host
dsh plugin add @ywzhang1031/dsh-client-ui-aside
dsh web
```

## 使用

1. 在已完成的助手回复中选中文字——浮出**就此提问**按钮；或点击该消息的 💬 按钮。
2. 空白草稿抽屉打开，标题为选中片段。此刻不创建任何东西。
3. 输入问题并发送——Host 创建 fork 出的旁注（继承父会话的工作区与模型路由），把锚定原文附在问题上，并记录锚点。
4. 从侧栏「旁注聊天」（当前对话的所有被问片段）、消息 💬 按钮（重开已问消息的旁注）或会话列表重入。

## 兼容性

- 针对 DeepSeek Harness `0.1.0-rc.7`（npm `latest`，`npm i -g @deepseek-ai/dsh`）构建。注意：个别 `@deepseek-ai/*` 包的 `latest` dist-tag 仍指向很旧的 `0.0.1-rc.x`——请始终安装 CLI（`@deepseek-ai/dsh`，它的 `latest` 是正确的），让它拉取正确的依赖。
- 所有 `@deepseek-ai/*` 运行时依赖都是 **peer dependency**，由你的 DSH 安装解析——插件不会下载自己的副本，因此不会与 DSH 自身的工具实例产生版本错位。
- 浏览器半区需要 stock 的 `conversation.chat.assistant-actions` 动作条槽（`ui-message-feedback` 时代起就有）与 `shell.overlay` 框架槽。
- 未来 DSH 发布新版本可能改动 API；请针对每个新 DSH 版本重新验证（peer 解析失败时 `dsh plugin add` 会大声报错，aside 工具集 e2e 是兼容性金丝雀）。

## 开发

本仓库自带**构建产物**（`lib/`，含 Typert 生成的 Remote 文件），消费端无需构建。源码迭代在 DSH monorepo checkout 内进行（插件依赖 monorepo 的构建工具链）：

```sh
# 1. 克隆 deepseek-harness、安装、先构建一次（见其 README）
# 2. 在 monorepo 内开发 aside 两包：
ln -s /path/to/dsh-aside/packages/aside-host  /path/to/deepseek-harness/packages/aside/aside-host
ln -s /path/to/dsh-aside/packages/client-ui-aside /path/to/deepseek-harness/packages/aside/client-ui-aside
# 3. 在 monorepo 内跑包测试：
npx vitest run --config vitest.config.ts packages/aside
# 4. 重建 lib/ 并把产物提交回本仓库：
npx tsdown --env.DSH_BUILD_FACE host            # host 包
(cd packages/aside/client-ui-aside && npx tsdown)  # client bundle
```

测试套件：本仓库 42 个单测——host 网关（血缘、fork seed、只读/never 种子、分类失败）、浏览器端单测（选区、锚点、抽屉、消息级动作、插件 apply 生命周期）——外加 2 个真实组合 e2e（boot 官方 base+web bundle 并断言 aside 的精确工具集；在 DSH monorepo 开发环境内运行，见开发一节）。

## 限制与待办

- 锚点存放在浏览器 `localStorage`——清空存储会隐藏旁注列表，但永远不会删除旁注本身。
- 抽屉与侧栏打开期间靠轻轮询刷新历史（无实时流订阅）。
- 父会话尚无完成轮次时不 fork 历史；旁注空启动，只能看到客户端附上的锚定原文。
- 原文内联高亮待 stock `MarkdownText` 提供装饰钩子后再做。

## License

MIT © [ywzhang1031](https://github.com/ywzhang1031)
