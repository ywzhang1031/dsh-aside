# @ywzhang1031/dsh-aside-host

[English](README.md) | 中文

只读旁注的 Host 网关。`AsideGateway` 注册 `aside` 服务，发布一个生成的 direct Remote——`aside/create`——供 [`@ywzhang1031/dsh-client-ui-aside`](../client-ui-aside/README.md) 界面消费。

**无需任何源码修改即可运行在 stock DSH 部署上**：网关用与官方组合相同的 stock 包与服务自行组装一切。

## 只读保证

`create` 会构建一个普通 Session，并固定在一套无法从内部扩大的约束之下：

- **自组装只读世界** — [`composeReadOnlyWorld`](src/index.ts) 把 stock 工具集挂进子代理作用域：`tool-bash`/`tool-pwsh`、`tool-fs`、`tool-fs-search`、`tool-web`（`fetch: true`）、`skill-filesystem` + `tool-skill`，以及一份只读 persona。不组装任何委派或长任务机制。
- **`sandbox/mode: read-only`** — 创建时播种进子会话日志，此后每次受限的 bash/fs 调用都折叠到 OS 级只读沙箱。stock `tool-fs` 仍会注册 `write`/`edit`（隐藏写工具的 `readOnly` 配置不是 stock 选项）；每次写尝试都被确定性拒绝——策略拒绝加 OS 沙箱——永远到不了文件系统。
- **`approval/policy: never`** — 与前者一同播种，确定性地关闭沙箱升级通道。

两个种子都是会话日志事件，因此重启后回放即可恢复。子会话继承父会话的工作区（`cwd`）与模型路由，并携带 `parentSession` 血缘供导航界面使用。它**不写自定义 `origin`**：stock 会话头只接受 `subagent`，所以旁注是一个普通子会话（会话列表可达，平级展示而非嵌套）。

## 上下文 fork

`create` 以父会话的平衡已完成轮次前缀作为 seed（与 `session.fork` RPC 相同的切法），旁注因此读到主对话的完整状态而不共享 token 预算。父会话尚无完成轮次时，旁注以空 seed 启动。

## Remote 方法

| 方法 | 参数 | 结果 | 失败 |
|---|---|---|---|
| `aside/create` | `{ parentSessionId }` | `{ sessionId }` | `AsideError`（`parent-not-found`） |

线缆 payload 与结果类型位于 `./types`，Typert 生成 `./typert` 与 `./remote` 暴露的 Host 与 Client Remote 产物。客户端界面通过 `ctx.remote.$mount` 自行挂载 `./remote` stub——除 overlay 行外不需要任何组合改动。

## Model Experience

无——本网关不发起任何模型调用：创建只 fork 父会话的已记录历史并播种策略事件；旁注自身的模型请求经由自组装只读世界的 agent loop 运行。

#### KV Cache 影响

无；本包从不组装模型输入。

## 已知限制与待办

- **写操作是被拒而非被隐藏** — stock `tool-fs` 没有 `readOnly` 配置，模型能看到 `write`/`edit` 工具定义；每次调用在执行期被确定性拒绝（策略 + OS 沙箱）。若未来 stock 版本提供只读 fs 组合，本包可以直接采用。
- **会话列表平级展示** — 没有自定义 `origin`，导航界面把旁注列为父会话血缘下的普通子会话，而非独立的嵌套种类。
- **父会话尚无完成轮次时不 fork 历史** — 旁注空启动；客户端仍会把锚定原文附在首问上，但模型看不到周围对话。
- **父会话存在性先查活注册表** — 冷父会话经可选持久化后端读取；两处都找不到时以 `parent-not-found` 分类失败。
- **冷父会话不继承路由** — 只有父会话在线时才复制 provider/model；冷父会话的子会话回落到部署默认路由。
