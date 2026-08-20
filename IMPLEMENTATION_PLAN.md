# DSH Aside 下一版实施规格

> 这是一份可直接交给实现 Agent 执行的任务说明。请在当前 `dsh-aside` 仓库内完成实现、测试和真实 DSH Web 验收。

## 1. 目标

把当前旁注插件收敛成一个可靠、轻量、纯插件实现的旁注系统：

- 侧边栏只收纳当前主会话的旁注聊天。
- 旁注关系必须持久化，不再依赖浏览器 `localStorage` 作为事实来源。
- 点击侧边栏旁注时，打开旁注抽屉并定位到对应原文。
- 在能够稳定恢复精确文字范围时，原文高亮并可点击打开旁注。
- 旁注抽屉支持模型、Reasoning 等级和一组安全命令。
- 旁注默认保持 `read-only`，不得为了实现 UI 而削弱现有安全边界。
- 改善抽屉轮询、流式显示、滚动和动画细节。

本次允许删除旧实现和旧适配，不要求迁移旧的浏览器锚点数据。目标是得到一套干净、可维护的实现。

## 2. 硬约束

1. **不得修改 DeepSeek Harness 源码。**
   - 只能使用 stock DSH 的公开插件、slot、Remote、Session 和客户端运行时能力。
   - 不在 DSH 安装目录或其 `node_modules` 中打补丁。
   - 不复制或 fork DSH 的完整主输入框内部实现。

2. **保持独立插件安装方式。**
   - `dsh-aside` 仍由 `aside-host` 和 `client-ui-aside` 两个包组成。
   - 仍需支持 `dsh plugin add` 和 stock `dsh web`。

3. **删除旧状态，不做兼容层。**
   - 删除 `localStorage` 锚点账本以及相关迁移逻辑。
   - 不为旧的 `dsh-aside-anchors` 数据保留双读、回填或版本适配代码。

4. **不要静默依赖 DSH 私有实现。**
   - 优先使用包的公开 exports 和公开服务。
   - 如果某项能力只能通过 deep import、私有字段或不稳定 DOM class 实现，必须明确记录并设计可靠回退。

5. **不提交或推送 Git 变更。**
   - 完成后保留工作区 diff，交由评审者检查。

## 3. 本版明确删除的功能

从侧边栏彻底删除：

- Artifacts / 产出
- Sources / 来源
- 对主会话历史每 5 秒进行一次的产出/来源折叠轮询

同时删除不再使用的：

- `foldArtifacts`
- `foldSources`
- `SidebarArtifact`
- `SidebarSource`
- 对应 locale key、样式、导出和测试
- `AsideSidebar` 中仅为产出和来源存在的 `api` 依赖

删除后，侧边栏只负责旁注列表和旁注导航。

## 4. 不在本版范围内

- 重新设计产出和来源。
- 向旁注授予写权限。
- 在旁注中完整复制 stock DSH InputBar。
- 修改 DSH Markdown renderer 增加专用 decoration hook。
- 迁移当前浏览器中已有的旧锚点记录。
- 为旧插件版本保留兼容 API。

## 5. 目标交互

### 5.1 创建旁注

保持当前 draft 语义：

1. 用户选中文字，点击“就此提问”；或者点击 assistant 消息操作区的旁注按钮。
2. 只打开空白 draft，不创建 Session。
3. 用户第一次发送后，Host 创建真实子 Session，并持久化旁注关系。
4. 关闭未发送的 draft 不留下 Session 或锚点。

### 5.2 侧边栏

侧边栏只显示：

```text
旁注聊天  3

什么是 sandbox……
为什么这里需要 fork……
这个权限有什么作用……
```

每一项至少包含：

- 锚点文字摘要
- 最近更新时间，或可用于稳定排序的时间
- 当前打开状态
- 可访问的 tooltip / aria label

点击旁注条目时：

1. 打开对应的旁注抽屉。
2. 滚动到父会话中的对应 assistant 消息。
3. 短暂强调该消息。
4. 如果精确文字范围可以恢复，则进一步强调对应文字。
5. 精确定位失败时不得影响抽屉打开，必须回退为消息级定位。

### 5.3 点击原文

当精确锚点成功恢复时：

- 在父消息中以低干扰样式高亮相应文字。
- 点击高亮文字打开已有旁注。
- 高亮不得改变 Markdown 布局。
- 高亮丢失后应能在受控的 DOM 更新中恢复。
- 无法恢复时使用消息级旁注标记和侧边栏导航作为回退。

### 5.4 抽屉输入区

目标布局：

```text
[ Model · Reasoning ]              [Read-only] [完整打开]

对当前原文继续提问……
[/ 命令]                                          [发送]
```

本版加入：

- 当前模型
- Reasoning 等级
- `Read-only` 权限状态
- 轻量命令入口
- “在完整对话中打开”

旁注创建时继承父会话的 provider、model 和 Reasoning 等级；之后允许旁注单独切换模型和 Reasoning。

第一版命令白名单：

- `/model`
- `/compact`
- `/export`
- `/feedback`

暂不在抽屉中开放：

- `/permission`
- `/plan`
- `/goal`

不要复制 stock InputBar。应通过公开 Session、model directory、command 或 action API 实现紧凑控制；开始编码前先确认当前 DSH 版本实际公开的接口。

## 6. 持久化设计要求

### 6.1 事实来源

Host/Session 的持久化数据是唯一事实来源。客户端内存只作为当前页面缓存。

可以使用以下任一纯插件方案，但必须先验证 public API：

1. 在子 Session durable meta 中保存锚点，并由 `aside.list(parentSessionId)` 查询；或
2. 在父 Session 的 durable log 中追加插件自有的 `aside/created` 事件，再由 Host 查询和折叠。

优先选择：

- append-only
- 能经重启 replay
- 不需要扫描所有会话
- 不依赖 DSH 源码改动
- 可以按 `parentSessionId` 稳定查询

如果两种方案都无法只靠公开 API 实现，先记录证据和最小阻塞点，不要偷偷改 DSH 源码。

### 6.2 建议记录结构

名称可以按项目风格调整，但语义必须保留：

```ts
interface AsideRecord {
  schemaVersion: 1
  parentSessionId: string
  subSessionId: string
  anchor: {
    messageId: string | null
    exact: string
    prefix: string
    suffix: string
    occurrence: number | null
    startOffset: number | null
  }
  createdAt: number
  updatedAt: number
}
```

说明：

- `exact` 是选择的原文。
- `prefix` / `suffix` 用于同文重复时消歧。
- `occurrence` 和 `startOffset` 是回退信息，不应单独作为唯一定位依据。
- 点击整条 assistant 消息创建旁注时，可以把完整消息摘要作为 `exact`，并标记为消息级锚点。

### 6.3 Remote 合约

至少提供：

```ts
aside.create({
  parentSessionId,
  anchor,
  // 其他创建所需数据
}) -> AsideRecord

aside.list({
  parentSessionId,
}) -> AsideRecord[]
```

要求：

- `create` 负责创建子 Session 和持久化关系，客户端不能在创建后再写入一个仅本地的第二份事实。
- 尽量具备幂等键或重复提交保护，防止双击产生两个相同旁注。
- `list` 必须能在页面刷新和 Host 重启后恢复记录。
- 子 Session 不存在或已损坏时，返回可识别状态，客户端不要崩溃。

## 7. 原文定位设计

### 7.1 消息级定位：必须可靠交付

利用现有 `conversation.chat.assistant-actions` slot：

- `AsideAskAction` 挂载时，将 `messageId` 和插件自己的 DOM ref 注册到 `MessageDomRegistry`。
- 卸载时注销。
- 侧边栏点击通过 registry 定位对应消息，并调用 `scrollIntoView({ block: 'center' })`。
- 使用插件自己的节点引用，不要把某个 DSH class name 当作唯一依据。
- 如果需要获取消息容器，使用局部、可验证的 DOM 关系，并为失败情况保留 action 节点定位。

如果消息暂时没有挂载：

- 先尝试 stock session 导航/加载能力。
- 等待一次受限的 render tick 后重试。
- 最终回退为打开抽屉，不得无限观察或无限重试。

### 7.2 为文本选择解析 `messageId`

当前 selection watcher 得到的是 `messageId: null`，需要改进。建议按以下顺序解析：

1. 通过已注册的 message DOM sentinel 判断 selection range 属于哪条消息。
2. 如果 DOM 归属无法确认，读取当前 Session history，对 normalized `exact` 做唯一匹配。
3. 多条消息均匹配时，用 prefix/suffix、DOM 相对位置或 occurrence 消歧。
4. 仍无法确定则允许 `messageId: null`，但保留 quote selector，侧边栏仍可工作。

不要因为无法解析 `messageId` 而阻止用户创建旁注。

### 7.3 精确文本高亮：增强能力

推荐使用 CSS Custom Highlight API，并做 feature detection：

- 在目标消息 DOM 中通过 `TreeWalker` 和 quote selector 还原 `Range`。
- 使用 `CSS.highlights` 绘制，不用 `<mark>` 包裹 React 管理的文本节点。
- DOM 更新时只观察 conversation 范围。
- `MutationObserver` 回调使用 `requestAnimationFrame` 合并，不在每次 mutation 中立即全量扫描。
- 抽屉关闭不必移除持久高亮；切换 Session 时清理旧 Range。
- 浏览器不支持 Custom Highlight 时，回退为消息级样式。

CSS Highlight 本身不是普通点击目标。点击识别可通过：

- `caretPositionFromPoint`，或 Safari/WebKit 回退 `caretRangeFromPoint`
- 将点击坐标解析为 text node + offset
- 判断该点是否落在已恢复的 anchor Range 内
- 命中后调用 `openExisting`

如果浏览器不支持点击位置解析，高亮仍可显示，但打开旁注继续通过消息操作区和侧边栏完成。

### 7.4 文本定位失败策略

必须按以下顺序降级：

```text
精确文字定位
  -> 对应 assistant 消息定位
  -> 只打开旁注抽屉
```

任何定位失败都不能导致旁注消失或无法打开。

## 8. 模型、Reasoning 与命令

实现前检查当前安装的 DSH public APIs，不要凭类型名称猜测。

要求：

- 创建时明确继承父会话的 provider、model 和 Reasoning effort。
- 抽屉 header 显示当前真实选择，而不是静态标签。
- 通过 Session 对应的 public model directory/action 修改选择。
- model 和 Reasoning 更新必须只作用于子 Session。
- 命令使用子 Session 的公开 command 入口。
- 命令菜单只列本版白名单，未知命令在抽屉中给出明确错误。
- “完整打开”使用 stock session navigation/selection action，进入真实子 Session 页面。

如果 stock 完整页面已经提供模型和命令能力，应复用其 Session 状态，不要再维护一套旁注私有配置。

## 9. 权限与安全验证

本版抽屉不提供权限切换，默认并尽量保持：

```text
sandbox/mode: read-only
approval/policy: never
```

必须实际验证以下路径：

- 抽屉中的命令无法调用 `/permission`。
- 旁注工具的 `write` / `edit` 实际失败。
- shell 无法在工作区写文件。
- Host 重启后权限事件 replay 仍为 read-only/never。
- “完整打开”后，stock `/permission` 或权限控件是否能够扩大权限。

最后一点必须诚实处理：

- 如果通过公开插件能力可以阻止完整页面扩大权限，则实现并增加测试。
- 如果无法在不修改 DSH 源码的前提下阻止，则不要伪造“不可改变”的保证；把产品文案改成准确的“默认 read-only”，记录完整页面的权限边界，并在最终报告中明确指出。
- 不允许为了维持文案而 patch DSH 源码。

## 10. 轮询、流式更新与滚动

### 10.1 侧边栏

- 删除产出/来源后，侧边栏不得继续每 5 秒读取主会话 history。
- 当前页面新建旁注时直接更新客户端缓存。
- 切换父 Session 时调用一次 `aside.list`。
- 如果 DSH 有公开的 Session/Remote 事件订阅，使用事件处理其他页面创建的旁注；没有时不需要添加高频轮询。

### 10.2 抽屉

优先接入子 Session 的公开事件流或可订阅 snapshot：

- 用户消息立即乐观显示。
- assistant 内容增量更新。
- tool 状态稳定更新，不重复闪烁。
- drawer 关闭或切换子 Session 时取消订阅。

如果当前公开 API 无法订阅子 Session，保留自适应轮询回退：

- 生成中：600–800ms。
- 空闲：逐步退避到 2–5s。
- 页面 hidden 或抽屉关闭：停止。
- 每个请求可取消，旧请求不能覆盖新 Session 状态。
- 不允许同一 Session 出现重叠请求。
- 初次加载可显示 skeleton，后台刷新不得反复显示 loading。

### 10.3 自动滚动

- 用户距离底部小于一个合理阈值时，流式内容自动跟随。
- 用户主动向上滚动后，不抢夺滚动位置。
- 新内容到达但未自动跟随时，显示“回到底部”入口。
- 切换旁注时重置滚动判断。

## 11. 动画与可访问性

- 抽屉打开/关闭建议 180–220ms，使用 transform + opacity。
- 避免通过 width 持续动画造成主会话布局抖动。
- 新消息只做轻量淡入，不对每个 token 添加动画。
- 定位原文时做一次短暂强调，随后恢复持久的低对比度高亮。
- 所有动画支持 `prefers-reduced-motion: reduce`。
- 模型选择、命令菜单、关闭、完整打开和侧边栏条目提供键盘操作和 aria label。
- Escape 关闭临时菜单；是否关闭 drawer 需避免与 stock DSH 快捷键冲突。

## 12. 建议实施阶段

### Phase 0：基线与 API 调研

- 记录 `git status`。
- 运行当前 `pnpm test` 和 `pnpm build`。
- 核对当前 DSH 版本中可用的 Session persistence、事件、model directory、command 和 navigation 公共 API。
- 把选定 API 和拒绝使用的私有 API 简短记录在实现注释或最终报告中。

### Phase 1：删除产出和来源

- 精简 `AsideSidebar`。
- 删除 `fold.ts` 及相关导出和测试，前提是确认没有其他消费者。
- 删除主会话 5 秒轮询。
- 更新 README 中的 Features、Usage 和 Limitations。

### Phase 2：持久化旁注索引

- 扩展 Host types 和 Typert Remote。
- 实现 durable `create/list`。
- 删除 `AnchorStore` localStorage 实现。
- 客户端增加 remote-backed repository/cache。
- 保持 first-send creation 语义。

### Phase 3：消息定位

- 实现 `MessageDomRegistry`。
- `AsideAskAction` 注册和注销消息位置。
- 侧边栏点击执行“打开 + 定位 + 短暂强调”。
- 为未挂载、找不到消息和冷 Session 增加有限回退。

### Phase 4：精确原文高亮与点击

- 保存 quote selector。
- 恢复 Range。
- 接入 CSS Custom Highlight。
- 实现点击位置命中。
- 加入 DOM rerender 恢复和降级路径。

### Phase 5：抽屉控制栏

- 模型和 Reasoning 选择。
- 命令白名单。
- Read-only 状态。
- 完整页面打开。
- 验证状态与 stock Session 共享，而不是双写。

### Phase 6：事件、轮询和动画

- 优先用事件订阅替换固定轮询。
- 必要时实现自适应轮询回退。
- 修复自动滚动行为。
- 完成抽屉、消息和定位动画。
- 增加 reduced-motion 和键盘可访问性。

### Phase 7：文档与真实验收

- 更新根 README 和两个 package README。
- 更新测试数量和已知边界，不能保留已失真的功能描述。
- 打包、smoke，并使用真实 stock `dsh web` 验收。

## 13. 测试要求

至少覆盖以下场景。

### Host

- 创建旁注时写入完整 anchor record。
- 按父 Session 查询。
- Host 重启或 cold persistence 后仍能查询。
- 相同幂等请求不重复创建。
- parent 不存在、child 损坏时的错误分类。
- provider、model、Reasoning 继承。
- read-only 和 never 的持久化 replay。

### Client state

- 不访问 `localStorage` 锚点 key。
- Session 切换时只展示当前父 Session 的旁注。
- first send 成功后加入列表。
- create/prompt 失败时不会产生错误的本地锚点。
- sidebar 不再轮询主会话 history。

### 定位

- `messageId` 已知时滚动到正确消息。
- 重复文本通过 prefix/suffix 消歧。
- normalized whitespace 匹配。
- Markdown 跨 text node 的选区。
- 精确 Range 找不到时回退消息级定位。
- 消息也找不到时仍能打开抽屉。
- 点击高亮文字打开正确旁注。
- 多个旁注、相邻旁注和重复旁注不会串线。

### 抽屉

- 模型和 Reasoning 只修改子 Session。
- 命令白名单生效。
- `/permission` 在抽屉中不可用。
- 完整页面导航指向正确子 Session。
- 关闭、切换时订阅和 timer 被清理。
- 用户向上滚动时不被强制拉回底部。

### UI

- 产出和来源完全消失。
- 空旁注列表、单个旁注、长文本和大量旁注布局正常。
- 中文和英文 locale 正常。
- reduced-motion 下没有非必要动画。
- 键盘和 screen reader 基本可用。

## 14. 验证命令

至少执行：

```sh
pnpm test
pnpm build
pnpm run pack
pnpm smoke
pnpm verify
```

然后在真实 DSH 环境中验证：

```sh
dsh plugin add /absolute/path/to/dsh-aside/packages/aside-host
dsh plugin add /absolute/path/to/dsh-aside/packages/client-ui-aside
dsh web
```

真实浏览器验收必须包括：

1. 创建至少两个来自不同 assistant 消息的旁注。
2. 刷新页面，确认侧边栏仍能恢复。
3. 清理浏览器旧 `dsh-aside-anchors` 后，确认不受影响。
4. 点击侧边栏条目，确认抽屉打开并跳回原消息。
5. 点击可恢复的原文高亮，确认打开正确旁注。
6. 制造精确文字恢复失败，确认消息级回退生效。
7. 切换旁注模型和 Reasoning，确认主会话不变。
8. 执行安全命令并验证未知/禁止命令处理。
9. 尝试写文件和扩大权限，记录真实结果。
10. 验证流式输出、向上滚动、回到底部和抽屉动画。

## 15. 完成定义

只有同时满足以下条件才算完成：

- 产出和来源代码、UI、轮询、文档均已删除。
- 旁注可以经刷新和 Host 重启恢复。
- `localStorage` 不再是锚点事实来源。
- 侧边栏点击能够可靠打开旁注并至少定位到原消息。
- 精确原文点击在支持条件满足时可用，失败时有稳定回退。
- 模型、Reasoning、命令和完整页面入口完成。
- 权限边界经过真实攻击式验证，README 描述与实际行为一致。
- 固定粗粒度轮询被事件订阅或自适应轮询替代。
- 单元测试、构建、打包、smoke 和真实 `dsh web` 验收通过。
- 没有修改 DSH 源码或其安装目录。

## 16. 最终交付格式

实现完成后，请输出：

1. 功能结果摘要。
2. 关键设计选择，尤其是持久化、消息定位、事件订阅和权限边界。
3. 修改文件清单。
4. 删除文件清单。
5. 所有验证命令及结果。
6. 真实浏览器验收结果。
7. 仍存在的限制或依赖的 DSH 公共 API。
8. `git status --short` 和 `git diff --stat`。

不要只说明“应该可用”；必须提供测试和真实 DSH Web 证据，之后停下等待代码评审。
