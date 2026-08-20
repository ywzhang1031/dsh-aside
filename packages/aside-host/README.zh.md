# dsh-aside-host

[English](README.md) | 中文

只读旁注的 Host 网关。`AsideGateway` 注册 `aside` 服务，发布两个生成的 direct Remote——`aside/create` 与 `aside/list`——供 [`dsh-client-ui-aside`](../client-ui-aside/README.md) 界面消费。

**无需任何源码修改即可运行在 stock DSH 部署上**：网关用与官方组合相同的 stock 包与服务自行组装一切。

## 只读保证

`create` 会构建一个普通 Session，并固定在一套无法从内部扩大的约束之下：

- **自组装只读世界** — [`composeReadOnlyWorld`](src/index.ts) 把 stock 工具集挂进子代理作用域：`tool-bash`/`tool-pwsh`、`tool-fs`、`tool-fs-search`、`tool-web`（`fetch: true`）、`skill-filesystem` + `tool-skill`，以及一份只读 persona。
- **`sandbox/mode: read-only`** — 创建时播种进子会话日志；每次写尝试都被确定性拒绝，永远到不了文件系统。
- **`approval/policy: never`** — 与前者一同播种，确定性地关闭沙箱升级通道。

两个种子都是会话日志事件，重启回放后即可恢复。子会话继承父会话的工作区（`cwd`）与模型路由，并携带 `parentSession` 血缘。它**不写自定义 `origin`**：stock 会话头只接受 `subagent`，所以旁注是一个普通子会话。

## 上下文 fork

`create` 以父会话的平衡已完成轮次前缀作为 seed（与 `session.fork` RPC 相同的切法）。provider、model 与 Reasoning 等级随 seed 中的 `request/header` 事件继承。父会话尚无完成轮次时，旁注以空 seed 启动。

## 旁注关系的持久化

父链接是子会话的持久化 `parentSession` 头。完整锚点（message id、精确原文、prefix/suffix 消歧、offset）由 `encodeAnchor` 编码进子会话首条用户消息（`[aside:…]` 标记）。`aside.list` 通过列出持久化会话头、按 `parentSession` 过滤、再读取每个子会话首条消息来恢复父会话的所有旁注。

stock DSH `0.1.0-rc.7` 没有为仓库外插件提供给自定义会话事件标记 `ignorable` 的公开 API，因此专用索引事件会在重载时被持久化读取路径拒绝。锚点因此随可用的、已知事件类型持久化。这是记录在案的取舍，不是绕补丁。

## Remote 方法

| 方法 | 参数 | 结果 | 失败 |
|---|---|---|---|
| `aside/create` | `{ parentSessionId, anchor }` | `{ record: AsideRecord }` | `AsideError`（`parent-not-found`） |
| `aside/list` | `{ parentSessionId }` | `{ records: AsideRecord[] }` | （损坏子会话被跳过） |

`AsideRecord` 携带 `schemaVersion`、`parentSessionId`、`subSessionId`、`anchor`（`messageId`、`exact`、`prefix`、`suffix`、`occurrence`、`startOffset`）、`createdAt` 与 `updatedAt`。`create` 按完整锚点身份合并顺序重试与并发请求；只有 anchor 已通过 session flush 持久化后才返回成功。

线缆 payload 与结果类型位于 `./types`（含 `encodeAnchor`/`parseAnchor` 编解码），Typert 生成 `./typert` 与 `./remote` 暴露的 Host 与 Client Remote 产物。客户端界面通过 `ctx.remote.$mount` 自行挂载 `./remote` stub。

## Model Experience

无——本网关不发起任何模型调用：创建只 fork 父会话的已记录历史并播种策略事件；旁注自身的模型请求经由自组装只读世界的 agent loop 运行。

#### KV Cache 影响

无；本包从不组装模型输入。

## 已知限制与待办

- **写操作是被拒而非被隐藏** — stock `tool-fs` 没有 `readOnly` 配置，模型能看到 `write`/`edit` 工具定义；每次调用在执行期被确定性拒绝。
- **Host 只维护普通子会话** — companion client 在 durability barrier 之后使用公开的 Workspace archive 投影隐藏导航行；Host 不写自定义 `origin`，也不修改 DSH 源码。
- **父会话尚无完成轮次时不 fork 历史** — 旁注从空 seed 启动；Host 仍会在首问之前写入锚定原文。
- **`aside.list` 扫描会话头** — 它过滤元数据级的 `sessionPersistence.list()` 结果，再读取匹配的子会话；没有专用的按父索引（自定义事件类型不可用，见上）。
- **冷父会话不显式继承路由** — 只有父会话在线时才复制 provider/model；Reasoning 随 seed 继承，冷父会话的子会话回落到部署默认路由。
