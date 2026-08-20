# @ywzhang1031/dsh-client-ui-aside

[English](README.md) | 中文

只读旁注的浏览器界面。在已完成的助手回复中选中一段文字，点击浮动的**就此提问**按钮（或消息动作条上的 💬 按钮），一个带原文引用卡与统一 Composer 的草稿抽屉会绑定到该选区打开——此时还没有任何持久化内容。草稿立即预览父会话模型/Reasoning，并可在不修改父会话的情况下预选；发送后 Host 创建 fork 出的旁注并跨过锚点持久化 barrier，客户端将预选应用到子会话，再发送首问。关闭未发送的草稿不留任何痕迹。

**无需任何源码修改即可运行在 stock DSH 部署上**：插件通过 `ctx.remote.$mount` 自行挂载生成的 Remote stub，从运行时 sessions 服务读取当前会话，并把消息级入口贡献给 stock 的 `conversation.chat.assistant-actions` 动作条。

插件拥有以下模块：

- **`AsideRepository`** — 基于 Host 的缓存，镜像 `aside.list`/`aside.create`。Host 是唯一事实来源；这只是内存镜像（无 `localStorage`，无第二份本地事实）。
- **`DrawerStore`** — 抽屉打开状态机：草稿只在首次发送成功后才挂到真实旁注上。
- **`SelectionWatcher`** — 文档级监听器，把选区解析成 quote-selector 锚点并浮出提问按钮。
- **`MessageDomRegistry`** — 把 stock `messageId` 映射到 turn-tail 行，作为虚拟化/无法恢复精确片段时的定位降级。
- **`AsideHighlighter`** + **`quote`** — 用 TreeWalker + quote 选择器恢复每条旁注的精确 Range，并用 CSS Custom Highlight API 绘制；点击高亮重开旁注，侧栏点击精确居中并短暂强化该 Range。
- **`AsideVisibility`** — 通过公开的 Workspace archive 投影隐藏已确认的旁注子会话；保留日志与 Workspace accounting，并合并并发归档请求。
- **`AsideDrawer`** — overlay 槽面板；草稿与已创建会话共用底部模型/Reasoning、固定只读、命令和发送控件，并带可见性恢复轮询 + 自动滚动。
- **`AsideSidebar`** — 常驻右栏，只列当前对话的旁注聊天（无产出、无来源），显示当前打开状态与更新时间。
- **`AsideAskAction`** — stock 助手消息动作条上的消息级入口，携带精确 `messageId`。

持久权威——旁注会话、fork 血缘、只读姿态与锚点关系——都在 Host（`@ywzhang1031/dsh-aside-host`）一侧。

## stock-only 取舍

- **没有消息级 DOM 身份发布。** stock 把 assistant-actions 动作条渲染在消息文本的兄弟节点中，因此选区归属走历史匹配；消息级按钮提供精确到消息的锚定。
- **消息定位用 `data-chat-anchor-key`** 作为尽力而为的本地 DOM 提示，动作节点为回退——绝不把 CSS 类名当作唯一依据。
- **精确高亮可降级。** 无法恢复渲染片段或不支持 CSS Custom Highlight API 时降级为消息级标记，再退回侧栏/动作入口。
- **旁注仅存在于主对话层级。** 已持久化 child 通过 `workspace.archiveSession` 从左侧分组、平铺与搜索隐藏；历史记录在父对话加载时补隐藏。

## Model Experience

无直接贡献——本浏览器端界面不注册模型工具、提示词段落或 provider 路由；草稿读取父会话 `session.models` 但不修改父会话，首问前及后续切换只对旁注子会话提交 `session.selectModel`，消息与白名单斜杠命令提交 `session.prompt`。旁注的每个模型请求都由自组装的只读世界负责。

#### KV Cache 影响

无；本包从不组装模型输入。

## 已知限制与待办

- **自适应轮询而非实时订阅** — 抽屉在生成中以 700ms 轮询，空闲退避到 2.5s（隐藏/关闭时停止，恢复可见时立即刷新）。
- **精确高亮尽力而为** — Markdown 源码与渲染文本不一致、重复片段、或不支持 Custom Highlight API 时降级为消息级标记。
- **旁注索引从子会话首条消息恢复** — stock 0.1.0-rc.7 上无法使用自定义持久化事件类型（仓库外插件不能标记 `ignorable`）。
