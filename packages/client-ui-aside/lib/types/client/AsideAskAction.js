import { jsx as _jsx } from "react/jsx-runtime";
/**
 * The per-message aside entry on the stock `conversation.chat.assistant-actions`
 * strip: one click opens a draft drawer anchored to that assistant message —
 * a stock-native entry point that carries the message's exact `messageId`
 * (the selection watcher cannot see one, because stock renderers publish no
 * message DOM identity). The message text is resolved from history so the
 * anchor has a label; clicking an already-asked message reopens its aside.
 * @module @deepseek-ai/dsh-client-ui-aside/AsideAskAction
 */
import { useCallback, useRef, useState } from 'react';
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './AsideAskAction.module.css';
/** Extract the plain text of a content-block array (same projection as the drawer). */
function textOf(blocks) {
    return (Array.isArray(blocks) ? blocks : [])
        .filter((block) => (typeof block === 'object' && block !== null && block.type === 'text'))
        .map(block => block.text ?? '')
        .join('\n')
        .trim();
}
/**
 * One click: resolve the current session, find the message's text in history,
 * then open a draft (or reopen the existing aside for an already-asked span).
 */
export function AsideAskAction({ messageId, api, sessions, anchors, drawer, t }) {
    const [busy, setBusy] = useState(false);
    const alive = useRef(true);
    const resolve = useCallback(async () => {
        const sessionId = sessions.list.getSnapshot().current;
        if (sessionId === undefined || sessionId === null || busy)
            return;
        setBusy(true);
        try {
            const history = await api.sessions.history({ sessionId: sessionId, maxMessages: 100 });
            if (!alive.current)
                return;
            if (!history.result.ok)
                throw new Error(history.result.error.message);
            let text = '';
            for (const entry of history.result.value.events) {
                const event = entry.event;
                if (event.type !== 'assistant/message')
                    continue;
                const data = event.data;
                if (data?.message?.id !== messageId)
                    continue;
                text = textOf(data.message.content);
                break;
            }
            if (text === '')
                throw new Error('message not found in history');
            const existing = anchors.find(sessionId, messageId, text);
            if (existing !== undefined) {
                drawer.openSub({
                    subSessionId: existing.subSessionId,
                    parentSessionId: existing.sessionId,
                    anchorText: existing.text,
                });
                return;
            }
            drawer.openDraft({ parentSessionId: sessionId, anchorText: text, messageId });
        }
        catch (error) {
            console.error('[aside] ask action failed:', error);
        }
        finally {
            if (alive.current)
                setBusy(false);
        }
    }, [alive, anchors, api, busy, drawer, messageId, sessions]);
    const label = t('askMessageLabel');
    return (_jsx(Tooltip, { label: label, side: "bottom", children: _jsx("button", { type: "button", className: css.action, "aria-label": label, disabled: busy, onClick: () => { void resolve(); }, children: "\uD83D\uDCAC" }) }));
}
//# sourceMappingURL=AsideAskAction.js.map