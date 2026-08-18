/** Copy dictionaries for the aside drawer, sidebar, and floating action. */

/** Simplified Chinese dictionary and key source of truth. */
export const zh = {
  title: '旁注',
  readonlyBadge: '只读',
  readonlyHint: '继承主对话上下文；仅聊天、Shell 分析、文件读取、网页搜索与抓取 — 无法修改任何文件',
  askLabel: '💬 就此提问',
  askMessageLabel: '就此消息提问旁注',
  draftHint: '输入你的问题并发送，才会创建旁注。',
  loading: '正在读取对话…',
  empty: '还没有消息。发送第一条提问开始。',
  placeholder: '追问这个知识点…',
  send: '发送',
  sending: '发送中…',
  close: '关闭',
  error: '旁注创建失败：{{message}}',
  userRole: '你',
  assistantRole: '助手',
  sidebarLabel: '旁注侧栏',
  asidesTitle: '旁注聊天',
  asidesEmpty: '选中文字提问后，旁注会出现在这里。',
  artifactsTitle: '产出',
  artifactsEmpty: '本对话还没有产出文件。',
  sourcesTitle: '来源',
  sourcesEmpty: '本对话还没有网页搜索来源。',
} satisfies Record<string, string>

/** English dictionary checked against the Chinese key set. */
export const en = {
  title: 'Side conversation',
  readonlyBadge: 'Read-only',
  readonlyHint: 'Forked from the main conversation; chat, shell analysis, file reads, and web search/fetch only — files cannot be modified',
  askLabel: '💬 Ask about this',
  askMessageLabel: 'Ask about this message in an aside',
  draftHint: 'Type a question and send it — only then is the aside created.',
  loading: 'Reading the conversation…',
  empty: 'No messages yet. Send the first question to start.',
  placeholder: 'Ask about this topic…',
  send: 'Send',
  sending: 'Sending…',
  close: 'Close',
  error: 'Failed to create the side conversation: {{message}}',
  userRole: 'You',
  assistantRole: 'Assistant',
  sidebarLabel: 'Aside sidebar',
  asidesTitle: 'Aside chats',
  asidesEmpty: 'Asides appear here after you ask about selected text.',
  artifactsTitle: 'Artifacts',
  artifactsEmpty: 'No produced files in this conversation yet.',
  sourcesTitle: 'Sources',
  sourcesEmpty: 'No web-search sources in this conversation yet.',
} satisfies Record<keyof typeof zh, string>

export type AsideLocaleKey = keyof typeof zh
