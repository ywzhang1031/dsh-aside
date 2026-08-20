/**
 * The per-message aside entry on the stock `conversation.chat.assistant-actions`
 * strip: one click opens a draft drawer anchored to that assistant message.
 * The action also registers its DOM (turn-tail row + sentinel) with the
 * {@link MessageDomRegistry} so the sidebar can scroll back to this message.
 * The message text is resolved from history; clicking an already-asked
 * message reopens its aside.
 * @module @ywzhang1031/dsh-client-ui-aside/AsideAskAction
 */
import type { IApiClient, MessageId } from '@deepseek-ai/dsh-client-connection/client';
import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types';
import type { AsideLocaleKey } from './locales.ts';
import type { AsideRepository } from './repository.ts';
import type { DrawerStore } from './drawer-store.ts';
import { MessageDomRegistry } from './message-dom-registry.ts';
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
    messageId: MessageId;
}
export interface AsideAskActionProps extends AsideAskOwnerProps {
    messageId: MessageId;
    /** Shared connection API client (history). */
    api: IApiClient;
    /** Runtime sessions service (current session). */
    sessions: AsideAskSessions;
    /** The plugin-owned Host-backed aside cache. */
    repository: AsideRepository;
    /** The plugin-owned drawer open-state store. */
    drawer: DrawerStore;
    /** The plugin-owned message DOM registry. */
    registry: MessageDomRegistry;
    /** Locale binder for this surface's dictionary. */
    t: (key: AsideLocaleKey, vars?: Record<string, string>) => string;
}
/**
 * Build a whole-message anchor against rendered text. The closing answer is
 * normally the last occurrence because Think may quote it first.
 */
export declare function messageAnchor(messageId: string, exact: string, rendered?: string): AsideAnchor;
/**
 * One click: resolve the current session, find the message's text in history,
 * then open a draft (or reopen the existing aside for an already-asked span).
 */
export declare function AsideAskAction({ messageId, api, sessions, repository, drawer, registry, t }: AsideAskActionProps): import("react").JSX.Element;
//# sourceMappingURL=AsideAskAction.d.ts.map