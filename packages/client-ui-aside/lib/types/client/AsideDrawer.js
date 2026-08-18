import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Side-conversation drawer over the frame-wide overlay slot: a compact
 * read-only chat panel. It opens as a DRAFT bound to one prose selection
 * (empty composer); the first send creates the forked aside, asks the
 * question with the anchored source attached, and only then does the
 * selection become a highlightable anchor. Closing an unanswered draft
 * leaves nothing behind. Existing asides reopen for follow-up questions.
 * @module @deepseek-ai/dsh-client-ui-aside/AsideDrawer
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './AsideDrawer.module.css';
/**
 * Project raw history events into display rows: user/assistant surface
 * messages and tool-call heads; every other event type is invisible.
 * `assistant/message` carries its message nested under `data.message`
 * (the canonical event shape), while `user/message` is the message itself.
 */
export function projectHistory(entries) {
    const rows = [];
    const textOf = (blocks) => ((Array.isArray(blocks) ? blocks : [])
        .filter((block) => (typeof block === 'object' && block !== null && block.type === 'text'))
        .map(block => block.text ?? '')
        .join('\n')
        .trim());
    for (const entry of entries) {
        const event = entry.event;
        if (event.type === 'user/message') {
            const data = event.data;
            const text = textOf(data?.content);
            if (text === '')
                continue;
            rows.push({ kind: 'user', text });
        }
        else if (event.type === 'assistant/message') {
            const data = event.data;
            const text = textOf(data?.message?.content);
            if (text === '')
                continue;
            rows.push({ kind: 'assistant', text });
        }
        else if (event.type === 'tool/call') {
            const data = event.data;
            if (data?.name !== undefined)
                rows.push({ kind: 'tool', name: data.name });
        }
    }
    return rows;
}
const POLL_MS = 800;
export function AsideDrawer({ store, api, onFirstSend, t }) {
    const state = useSyncExternalStore(listener => store.subscribe(listener), () => store.get());
    const subSessionId = state.subSessionId;
    const [rows, setRows] = useState([]);
    const [value, setValue] = useState('');
    const [sending, setSending] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const inputRef = useRef(null);
    // Focus the composer when the drawer opens; never prefill (the draft is
    // deliberately empty — the selected span attaches only when asked).
    useEffect(() => {
        if (subSessionId === null && !state.draft)
            return;
        setValue('');
        inputRef.current?.focus();
    }, [subSessionId, state.draft]);
    // Load + lightly poll the aside history while the drawer stays open.
    useEffect(() => {
        if (subSessionId === null) {
            setRows([]);
            setLoaded(false);
            return;
        }
        let disposed = false;
        const refresh = async () => {
            try {
                const response = await api.sessions.history({
                    sessionId: subSessionId,
                    maxMessages: 100,
                });
                if (disposed)
                    return;
                if (response.result.ok) {
                    setRows(projectHistory(response.result.value.events));
                }
            }
            catch {
                // Transient read failure: keep the last rows; the next tick retries.
            }
            finally {
                if (!disposed)
                    setLoaded(true);
            }
        };
        void refresh();
        const timer = setInterval(() => { void refresh(); }, POLL_MS);
        return () => {
            disposed = true;
            clearInterval(timer);
        };
    }, [subSessionId, api]);
    const send = async () => {
        if (sending || value.trim() === '')
            return;
        setSending(true);
        try {
            if (state.draft || subSessionId === null) {
                const ok = await onFirstSend(value);
                if (ok)
                    setValue('');
                return;
            }
            const response = await api.sessions.prompt({
                sessionId: subSessionId,
                mode: 'queue',
                content: [{ type: 'text', text: value }],
            });
            if (!response.result.ok) {
                store.setError(response.result.error.message);
                return;
            }
            setValue('');
            // Immediate refresh so the admitted message appears without the tick.
            const history = await api.sessions.history({ sessionId: subSessionId, maxMessages: 100 });
            if (history.result.ok)
                setRows(projectHistory(history.result.value.events));
        }
        catch (error) {
            store.setError(error instanceof Error ? error.message : String(error));
        }
        finally {
            setSending(false);
        }
    };
    const title = useMemo(() => {
        const compact = state.anchorText.replace(/\s+/g, ' ').trim();
        return compact.length > 40 ? `${compact.slice(0, 40)}…` : compact;
    }, [state.anchorText]);
    if (subSessionId === null && !state.draft)
        return null;
    return (_jsxs("aside", { className: css.drawer, role: "dialog", "aria-label": t('title'), children: [_jsxs("header", { className: css.header, children: [_jsxs("div", { className: css.titleRow, children: [_jsx("h2", { className: css.title, title: state.anchorText, children: title }), _jsx("span", { className: css.readonlyBadge, children: t('readonlyBadge') })] }), _jsx("p", { className: css.hint, children: t('readonlyHint') }), _jsx("button", { type: "button", className: css.close, "aria-label": t('close'), onClick: () => { store.close(); }, children: "\u00D7" })] }), state.error !== null && _jsx("p", { className: css.error, role: "alert", children: t('error', { message: state.error }) }), _jsxs("div", { className: css.messages, children: [state.draft && _jsx("p", { className: css.status, children: t('draftHint') }), !state.draft && !loaded && rows.length === 0 && _jsx("p", { className: css.status, children: t('loading') }), !state.draft && loaded && rows.length === 0 && _jsx("p", { className: css.status, children: t('empty') }), rows.map((row, index) => (_jsx("div", { className: css.row, "data-row-kind": row.kind, children: row.kind === 'tool' ? (_jsxs("span", { className: css.toolRow, children: ["\uD83D\uDD0D ", row.name] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: css.role, children: row.kind === 'user' ? t('userRole') : t('assistantRole') }), row.kind === 'assistant'
                                    ? _jsx(MarkdownText, { text: row.text })
                                    : _jsx("p", { className: css.userText, children: row.text })] })) }, index)))] }), _jsxs("div", { className: css.composer, children: [_jsx("textarea", { ref: inputRef, className: css.input, value: value, placeholder: t('placeholder'), onChange: (event) => { setValue(event.currentTarget.value); }, onKeyDown: (event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                void send();
                            }
                        } }), _jsx("button", { type: "button", className: css.send, disabled: sending || value.trim() === '', onClick: () => { void send(); }, children: sending ? t('sending') : t('send') })] })] }));
}
//# sourceMappingURL=AsideDrawer.js.map