/**
 * The per-message aside entry on the stock `conversation.chat.assistant-actions`
 * strip: one click opens a draft drawer anchored to that assistant message —
 * a stock-native entry point that carries the message's exact `messageId`
 * (the selection watcher cannot see one, because stock renderers publish no
 * message DOM identity). The message text is resolved from history so the
 * anchor has a label; clicking an already-asked message reopens its aside.
 * @module @ywzhang1031/dsh-client-ui-aside/AsideAskAction
 */
import type { IApiClient, MessageId } from '@deepseek-ai/dsh-client-connection/client';
import type { AsideLocaleKey } from './locales.ts';
import type { AnchorStore } from './anchors.ts';
import type { DrawerStore } from './drawer-store.ts';
/** The narrow sessions-service face the action reads the current session from. */
export interface AsideAskSessions {
    list: {
        subscribe(listener: () => void): () => void;
        getSnapshot(): {
            current?: string | null;
        };
    };
}
/**
 * The stock owner identity of one finalized assistant message (structurally
 * identical to ui-conversation's `AssistantActionOwnerProps`, which stock
 * does not re-export through its client entry).
 */
export interface AsideAskOwnerProps {
    /** Stable identity carried from the `assistant/message` event. */
    messageId: MessageId;
}
export interface AsideAskActionProps extends AsideAskOwnerProps {
    /** Stock owner identity of the finalized assistant message. */
    messageId: MessageId;
    /** Shared connection API client (history). */
    api: IApiClient;
    /** Runtime sessions service (current session). */
    sessions: AsideAskSessions;
    /** The plugin-owned anchor ledger. */
    anchors: AnchorStore;
    /** The plugin-owned drawer open-state store. */
    drawer: DrawerStore;
    /** Locale binder for this surface's dictionary. */
    t: (key: AsideLocaleKey, vars?: Record<string, string>) => string;
}
/**
 * One click: resolve the current session, find the message's text in history,
 * then open a draft (or reopen the existing aside for an already-asked span).
 */
export declare function AsideAskAction({ messageId, api, sessions, anchors, drawer, t }: AsideAskActionProps): import("react").JSX.Element;
//# sourceMappingURL=AsideAskAction.d.ts.map