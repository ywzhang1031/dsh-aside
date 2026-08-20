# Aside · 旁注

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）打造的**只读旁注**：在助手回复中选中任意一段文字，就地在一条**只读的旁注对话**里追问细节——旁注从主对话的上下文 fork 而来，不污染主线程、不占用它的 token 预算、也没有任何修改文件的能力。

**纯插件：零源码修改、零预设文件、零部署配置。** 直接跑在 stock DSH 上——克隆、装两个包、重启即可。

## 为什么需要它

模型输出一大段回答后，你常常想就某个小知识点追问（"这里说的*平衡已完成轮次前缀*是什么意思？"），但又不想：

- 污染主对话的上下文窗口，
- 把边角问题混进主线程的历史，
- 或让这个追问拥有任何改文件的能力。

**旁注（aside）**正是为此而生：一条子会话，fork 入父会话的已完成轮次历史，由只读世界组装而成，通过高亮原文、消息上的 💬 按钮或侧栏「旁注聊天」随时重入。

## 功能

- **选中即问**：在已完成的助手回复中选中文字（2–800 字符），浮出**就此提问**按钮；点击打开**空白**草稿抽屉——真正发送前不创建任何东西。
- **消息级入口**：每条终态助手消息的 stock 动作条上都有一个 💬 按钮（与 `ui-message-feedback` 同一个扩展点），携带该消息的精确 id。
- **上下文 fork**：旁注日志以父会话的平衡已完成轮次前缀作为 seed（与 `session.fork` RPC 相同的切法）——读到主对话完整状态，却不共享它的 token 预算。provider、model 与 Reasoning 等级一并继承。
- **仅旁注侧栏**：右栏只列出当前对话的旁注聊天（锚点摘要 + 打开状态），点击重开旁注、将精确原文滚动到视口中心并短暂强化高亮。没有产出、没有来源、没有 5 秒轮询。
- **隐藏子会话**：旁注在完成持久化后通过 stock Workspace archive 投影从左侧分组、未分组、平铺列表与搜索中隐藏；日志与 Workspace 归属仍完整保留，历史旁注会在主对话再次加载时自动补隐藏。
- **持久化旁注索引**：旁注关系存放在 Host（子会话 `parentSession` 头 + 编码进子会话首条消息的锚点）——不依赖 `localStorage`，刷新与 Host 重启后都能恢复。
- **原文精确高亮**：可恢复精确片段时，父消息高亮原文（CSS Custom Highlight API，不包裹 `<mark>`），点击高亮重开旁注；无法恢复时降级为消息级标记。
- **统一 Composer**：草稿与已创建旁注始终显示同一套底部模型/Reasoning、固定只读、命令和发送控件；草稿预选读取父会话目录，只在首问前应用到子会话，不修改主对话。
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
- **抽屉不提供权限切换。** 旁注里没有 `/permission`，命令白名单排除 `/permission`、`/plan`、`/goal`，也没有跳到 stock 完整会话页的入口；旁注始终保持创建时播种的只读姿态。
- **精确高亮尽力而为。** Markdown 源码与渲染文本不一致、重复片段、或浏览器不支持 Custom Highlight API 时，降级为消息级标记；旁注始终可从侧栏与 💬 按钮进入。
- **隐藏借用 stock archive 投影。** DSH `0.1.0-rc.7` 尚无通用的 auxiliary-session visibility；插件使用公开的 `workspace.archiveSession` 隐藏旁注导航行，不删除日志或 Workspace accounting。

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
2. 草稿抽屉打开，引用卡显示选中片段，底部立即显示继承自父会话的模型/Reasoning、固定只读与命令控件。此刻不创建任何东西。
3. 可先调整草稿模型，再输入问题并发送——Host 创建 fork 出的旁注，持久化锚点，客户端把草稿模型应用到子会话后发送首问；主对话不受影响。
4. 从高亮原文、侧栏「旁注聊天」或消息 💬 按钮重入；侧栏点击精确聚焦并强化高亮原文，旁注不会出现在左侧会话列表。
5. 在抽屉里继续切换旁注的模型/Reasoning，或输入 `/` 选择白名单命令。

## 兼容性

- 针对 DeepSeek Harness `0.1.0-rc.7`（npm `latest`，`npm i -g @deepseek-ai/dsh`）构建。注意：个别 `@deepseek-ai/*` 包的 `latest` dist-tag 仍指向很旧的 `0.0.1-rc.x`——请始终安装 CLI（`@deepseek-ai/dsh`，它的 `latest` 是正确的），让它拉取正确的依赖。
- 所有 `@deepseek-ai/*` 运行时依赖都是 **peer dependency**，由你的 DSH 安装解析——插件不会下载自己的副本，因此不会与 DSH 自身的工具实例产生版本错位。
- 浏览器半区需要 stock 的 `conversation.chat.assistant-actions` 动作条槽（`ui-message-feedback` 时代起就有）与 `shell.overlay` 框架槽。
- 未来 DSH 发布新版本可能改动 API；请针对每个新 DSH 版本重新验证（peer 解析失败时 `dsh plugin add` 会大声报错，aside 工具集 e2e 是兼容性金丝雀）。

## 开发

**本仓库完全自构建——不需要 DeepSeek Harness monorepo。** `pnpm install && pnpm build` 会编译两个包（TypeScript → `lib/types`，tsdown → `lib/*.js`）；Host 自己维护并类型检查 Typert contract，不依赖 DSH monorepo 的项目注册。`pnpm test` 运行 92 个测试，覆盖 host 网关（create/list/并发幂等/持久化失败恢复/只读组合）、Workspace 隐藏投影、quote 选择器、消息 DOM 注册表、精确定位/高亮层，以及浏览器端 repository/抽屉/草稿模型/命令/选区/消息级动作/apply 生命周期。

```sh
pnpm install
pnpm build          # tsc -b + tsdown，两个包一起
pnpm test           # 92 个测试，零 DSH 安装依赖
npm run pack        # → dist/*.tgz
pnpm smoke          # 用隔离 DSH_HOME 在 stock DSH 中安装 tarball 并冷启动
pnpm verify         # test + build + pack + stock DSH smoke
```

### 在运行的 DSH 上迭代

最快的循环——把插件目录一次性链接进 profile，之后只需重建 + 重启：

```sh
# 一次性：以目录链接方式安装插件仓库（无需打包）
dsh plugin add /path/to/dsh-aside/packages/aside-host
dsh plugin add /path/to/dsh-aside/packages/client-ui-aside
dsh web

# 每次改动：在本仓库重建，然后重启 dsh web
pnpm build
# （浏览器半区的改动免重启热更——webserver 会轮询 lib/client.js）
```

对外分发走安装章节的流程：`npm run pack` → `dsh plugin add ./dist/*.tgz`。

### 兼容性金丝雀

`pnpm smoke` 会创建临时 `DSH_HOME`，让 stock DSH 自动生成全新的 web profile，再按发布方式安装两个 tarball、检查组合结果、随机端口启动 Web UI，并确认浏览器入口包含本插件。CI 在 Node 24 + `@deepseek-ai/dsh@0.1.0-rc.7` 上运行完整 `pnpm verify`；无需另一个 monorepo checkout。

## 限制与待办

- **抽屉流式更新是自适应轮询而非实时订阅。** 生成中 700ms，空闲退避到 2.5s，页面隐藏/关闭时停止；页面恢复可见时立即刷新。
- **自定义持久化事件类型在 0.1.0-rc.7 上不可用**（仓库外插件无法给自定义事件标记 `ignorable`），因此锚点随子会话首条消息持久化，而非独立的索引事件。
- **精确高亮尽力而为。** Markdown 源码与渲染文本不一致、重复片段、或不支持 Custom Highlight API 时降级为消息级标记。
- 父会话尚无完成轮次时不 fork 历史；旁注空启动，只能看到客户端附上的锚定原文。
- **旁注不会完整打开。** `workspace.archiveSession` 没有公开的反向 API；严格侧栏内使用可以保持清晰层级和稳定只读语义。

## License

MIT © [ywzhang1031](https://github.com/ywzhang1031)
