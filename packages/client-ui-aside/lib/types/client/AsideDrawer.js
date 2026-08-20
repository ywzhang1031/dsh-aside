import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Side-conversation drawer over the frame-wide overlay slot: a compact
 * read-only chat panel. It opens as a DRAFT bound to one prose selection
 * (empty composer); the first send creates the forked aside, asks the
 * anchored source durably first, sends the question, and only then does the
 * selection become a highlightable anchor. One stable composer shows the
 * model/reasoning selection, fixed read-only posture, and command entry in
 * both draft and durable states; draft choices apply to the child before its
 * first prompt instead of mutating the parent.
 * History streams via adaptive polling (fast while generating, backing off
 * when idle, stopping when hidden/closed) with autoscroll.
 * @module dsh-client-ui-aside/AsideDrawer
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives';
import { anchorSummary, parseAnchor } from 'dsh-aside-host/types';
import css from './AsideDrawer.module.css';
/** The command whitelist allowed inside an aside (first version). */
export const ASIDE_COMMANDS = new Set(['model', 'compact', 'export', 'feedback']);
/** Commands deliberately blocked in an aside, reported with a clear error. */
const BLOCKED_COMMANDS = new Set(['permission', 'plan', 'goal']);
/** Strip the durable anchor marker line from a first user message for display. */
function cleanUserText(text) {
    return text.replace(/\[aside:[^\]]+\]/g, '').replace(/\n*---\n引用原文：\n[\s\S]*$/u, '').trim();
}
/** Extract the plain text of a content-block array. */
function textOf(blocks) {
    return (Array.isArray(blocks) ? blocks : [])
        .filter((block) => (typeof block === 'object' && block !== null && block.type === 'text'))
        .map(block => block.text ?? '')
        .join('\n')
        .trim();
}
/**
 * Project raw history events into display rows: discard the inherited parent
 * seed through this aside's own (last) durable anchor marker, then surface
 * user/assistant messages and tool-call heads. The last marker matters for a
 * nested aside because its inherited seed may contain an ancestor's marker.
 */
export function projectHistory(entries) {
    let ownAnchorIndex = -1;
    for (let index = entries.length - 1; index >= 0; index -= 1) {
        const event = entries[index]?.event;
        if (event?.type !== 'user/message')
            continue;
        const data = event.data;
        if (parseAnchor(textOf(data?.content)) !== undefined) {
            ownAnchorIndex = index;
            break;
        }
    }
    const rows = [];
    for (const entry of entries.slice(ownAnchorIndex + 1)) {
        const event = entry.event;
        if (event.type === 'user/message') {
            const data = event.data;
            const text = cleanUserText(textOf(data?.content));
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
/** Whether the history tail looks like a turn is still generating. */
function isGenerating(entries) {
    const last = entries[entries.length - 1];
    if (last === undefined)
        return false;
    switch (last.event.type) {
        case 'turn/start':
        case 'step/start':
        case 'assistant/chunk':
        case 'tool/call':
            return true;
        default:
            return false;
    }
}
const FAST_MS = 700;
const SLOW_MS = 2500;
export function AsideDrawer({ store, api, onFirstSend, t }) {
    const state = useSyncExternalStore(listener => store.subscribe(listener), () => store.get());
    const subSessionId = state.subSessionId;
    const [rows, setRows] = useState([]);
    const [value, setValue] = useState('');
    const [sending, setSending] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [closing, setClosing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [directory, setDirectory] = useState(null);
    const [directorySessionId, setDirectorySessionId] = useState(null);
    const [notice, setNotice] = useState(null);
    const inputRef = useRef(null);
    const modelRef = useRef(null);
    const messagesRef = useRef(null);
    const closeTimerRef = useRef(undefined);
    const atBottomRef = useRef(true);
    // Match the main composer: an IME confirmation must never become a send,
    // including Safari's closing keydown after compositionend.
    const composingRef = useRef(false);
    const [atBottom, setAtBottom] = useState(true);
    const onCompositionStart = () => {
        composingRef.current = true;
    };
    const onCompositionEnd = () => {
        setTimeout(() => {
            composingRef.current = false;
        }, 10);
    };
    // Focus the composer when the drawer opens; never prefill.
    useEffect(() => {
        if (subSessionId === null && !state.draft)
            return;
        if (closeTimerRef.current !== undefined)
            clearTimeout(closeTimerRef.current);
        closeTimerRef.current = undefined;
        setClosing(false);
        setValue('');
        setNotice(null);
        inputRef.current?.focus();
    }, [subSessionId, state.draft]);
    // Adaptive polling of the aside history while the drawer stays open.
    useEffect(() => {
        if (subSessionId === null) {
            setRows([]);
            setLoaded(false);
            setGenerating(false);
            return;
        }
        let disposed = false;
        let timer;
        let inflight = false;
        const controller = new AbortController();
        const schedule = (ms) => {
            if (disposed)
                return;
            if (timer !== undefined)
                clearTimeout(timer);
            if (typeof document !== 'undefined' && document.hidden)
                return;
            timer = setTimeout(() => { void refresh(); }, ms);
        };
        const refresh = async () => {
            if (disposed || inflight)
                return;
            inflight = true;
            try {
                const response = await api.sessions.history({ sessionId: subSessionId, maxMessages: 100 }, controller.signal);
                if (disposed)
                    return;
                if (response.result.ok) {
                    const generatingNow = isGenerating(response.result.value.events);
                    setRows(projectHistory(response.result.value.events));
                    setLoaded(true);
                    setGenerating(generatingNow);
                    schedule(generatingNow ? FAST_MS : SLOW_MS);
                }
                else {
                    schedule(SLOW_MS);
                }
            }
            catch {
                if (!disposed)
                    schedule(SLOW_MS);
            }
            finally {
                inflight = false;
            }
        };
        const onVisibilityChange = () => {
            if (disposed || document.hidden)
                return;
            if (timer !== undefined)
                clearTimeout(timer);
            timer = undefined;
            void refresh();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        void refresh();
        return () => {
            disposed = true;
            if (timer !== undefined)
                clearTimeout(timer);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            controller.abort();
        };
    }, [subSessionId, api]);
    // A draft has no child session yet, so use the parent directory as a
    // read-only template. Local choices are not applied until first send.
    const modelSessionId = subSessionId ?? (state.draft ? state.parentSessionId : null);
    // Load the model directory for the draft parent or durable aside.
    const loadDirectory = useCallback(async (signal) => {
        if (modelSessionId === null)
            return;
        try {
            const response = await api.sessions.models({ sessionId: modelSessionId }, signal);
            if (response.result.ok) {
                setDirectory(response.result.value);
                setDirectorySessionId(modelSessionId);
            }
        }
        catch {
            // Directory load failure leaves the control bar with the prior value.
        }
    }, [modelSessionId, api]);
    useEffect(() => {
        if (modelSessionId === null) {
            setDirectory(null);
            setDirectorySessionId(null);
            return;
        }
        // Preserve the prior selection's width while the new target loads, but
        // mark it stale so it cannot be changed or applied accidentally.
        setDirectorySessionId(null);
        const controller = new AbortController();
        void loadDirectory(controller.signal);
        return () => { controller.abort(); };
    }, [modelSessionId, loadDirectory]);
    // Autoscroll: follow the tail only while the user is near the bottom.
    const onScroll = useCallback(() => {
        const el = messagesRef.current;
        if (el === null)
            return;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        atBottomRef.current = nearBottom;
        setAtBottom(nearBottom);
    }, []);
    useEffect(() => {
        const el = messagesRef.current;
        if (el === null || !atBottomRef.current)
            return;
        el.scrollTop = el.scrollHeight;
    }, [rows, subSessionId]);
    const scrollToBottom = useCallback(() => {
        const el = messagesRef.current;
        if (el !== null)
            el.scrollTop = el.scrollHeight;
        atBottomRef.current = true;
        setAtBottom(true);
    }, []);
    const selectModel = async (providerModel) => {
        if (directory === null)
            return;
        const separator = providerModel.indexOf('\u0000');
        const provider = separator === -1 ? providerModel : providerModel.slice(0, separator);
        const model = separator === -1 ? '' : providerModel.slice(separator + 1);
        if (state.draft || subSessionId === null) {
            const definition = directory.groups
                .find(group => group.id === provider)?.models
                .find(item => item.id === model);
            setDirectory({
                ...directory,
                current: {
                    provider,
                    model,
                    ...definition?.reasoning?.defaultEffort === undefined
                        ? {}
                        : { reasoningEffort: definition.reasoning.defaultEffort },
                },
            });
            return;
        }
        try {
            const response = await api.sessions.selectModel({ sessionId: subSessionId, provider, model });
            if (!response.result.ok) {
                setNotice(t('commandError', { message: response.result.error.message }));
                return;
            }
            void loadDirectory();
        }
        catch (error) {
            setNotice(t('commandError', { message: error instanceof Error ? error.message : String(error) }));
        }
    };
    const selectReasoning = async (effort) => {
        if (directory === null)
            return;
        const { provider, model } = directory.current;
        if (state.draft || subSessionId === null) {
            setDirectory({
                ...directory,
                current: { provider, model, ...effort === '' ? {} : { reasoningEffort: effort } },
            });
            return;
        }
        try {
            const response = await api.sessions.selectModel({
                sessionId: subSessionId,
                provider,
                model,
                ...effort === '' ? {} : { reasoningEffort: effort },
            });
            if (!response.result.ok) {
                setNotice(t('commandError', { message: response.result.error.message }));
                return;
            }
            void loadDirectory();
        }
        catch (error) {
            setNotice(t('commandError', { message: error instanceof Error ? error.message : String(error) }));
        }
    };
    const send = async () => {
        if (sending || value.trim() === '')
            return;
        const trimmed = value.trim();
        const isDraft = state.draft || subSessionId === null;
        // Command policy applies to EVERY message, including the first one — a
        // slash command can never create an aside, and blocked/unknown commands
        // are rejected before anything is sent.
        if (trimmed.startsWith('/')) {
            const name = trimmed.slice(1).split(/\s+/)[0] ?? '';
            if (BLOCKED_COMMANDS.has(name)) {
                setNotice(t('commandNotAllowed', { command: `/${name}` }));
                return;
            }
            if (!ASIDE_COMMANDS.has(name)) {
                setNotice(t('unknownCommand', { command: `/${name}` }));
                return;
            }
            if (isDraft) {
                setNotice(t('draftNoCommand'));
                return;
            }
        }
        setSending(true);
        try {
            if (isDraft) {
                const selected = directory === null || directorySessionId !== modelSessionId ? undefined : {
                    provider: directory.current.provider,
                    model: directory.current.model,
                    ...directory.current.reasoningEffort === undefined
                        ? {}
                        : { reasoningEffort: directory.current.reasoningEffort },
                };
                const ok = await onFirstSend(trimmed, selected);
                if (ok)
                    setValue('');
                return;
            }
            const response = await api.sessions.prompt({
                sessionId: subSessionId,
                mode: 'queue',
                content: [{ type: 'text', text: trimmed }],
            });
            if (!response.result.ok) {
                setNotice(response.result.error.code === 'unknown-command'
                    ? t('unknownCommand', { command: trimmed })
                    : t('commandError', { message: response.result.error.message }));
                return;
            }
            setValue('');
        }
        catch (error) {
            setNotice(t('commandError', { message: error instanceof Error ? error.message : String(error) }));
        }
        finally {
            setSending(false);
        }
    };
    const title = useMemo(() => {
        const compact = state.anchor === null ? '' : anchorSummary(state.anchor.exact, 40);
        return compact;
    }, [state.anchor]);
    const currentEffort = directory?.current.reasoningEffort;
    const currentModelKey = directory === null ? '' : `${directory.current.provider}\u0000${directory.current.model}`;
    const currentModelDefinition = directory === null ? undefined : directory.groups
        .find(group => group.id === directory.current.provider)?.models
        .find(model => model.id === directory.current.model);
    const reasoningEfforts = currentModelDefinition?.reasoning?.efforts ?? [];
    const drawerIsDraft = state.draft || subSessionId === null;
    const commandMatch = /^\/([^\s]*)$/.exec(value.trimStart());
    const commandOptions = commandMatch === null
        ? []
        : [...ASIDE_COMMANDS].filter(command => command.startsWith(commandMatch[1] ?? ''));
    const chooseCommand = (command) => {
        if (drawerIsDraft) {
            setValue('');
            if (command === 'model') {
                setNotice(t('draftModelCommand'));
                modelRef.current?.focus();
            }
            else {
                setNotice(t('draftNoCommand'));
            }
            return;
        }
        setValue(`/${command} `);
        inputRef.current?.focus();
    };
    const closeDrawer = () => {
        if (closing)
            return;
        const reduced = typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            store.close();
            return;
        }
        setClosing(true);
        closeTimerRef.current = setTimeout(() => {
            closeTimerRef.current = undefined;
            store.close();
            setClosing(false);
        }, 160);
    };
    useEffect(() => () => {
        if (closeTimerRef.current !== undefined)
            clearTimeout(closeTimerRef.current);
    }, []);
    if (subSessionId === null && !state.draft)
        return null;
    return (_jsxs("aside", { className: `${css.drawer}${closing ? ` ${css.closing}` : ''}`, role: "dialog", "aria-label": t('title'), children: [_jsxs("header", { className: css.header, children: [_jsxs("div", { className: css.titleRow, children: [_jsx("span", { className: css.kindLabel, children: t('title') }), _jsx("h2", { className: css.title, title: state.anchor?.exact, children: title })] }), _jsx("p", { className: css.hint, children: t('readonlyHint') }), _jsx("button", { type: "button", className: css.close, "aria-label": t('close'), onClick: closeDrawer, children: "\u00D7" })] }), state.error !== null && _jsx("p", { className: css.error, role: "alert", children: t('error', { message: state.error }) }), notice !== null && _jsx("p", { className: css.notice, role: "status", children: notice }), _jsxs("div", { ref: messagesRef, className: css.messages, onScroll: onScroll, children: [state.draft && (_jsxs("div", { className: css.draftCard, children: [_jsx("span", { className: css.draftLabel, children: t('sourceLabel') }), _jsx("blockquote", { className: css.draftQuote, children: state.anchor?.exact }), _jsx("p", { className: css.status, children: t('draftHint') })] })), !state.draft && !loaded && rows.length === 0 && _jsx("p", { className: css.status, children: t('loading') }), !state.draft && loaded && rows.length === 0 && _jsx("p", { className: css.status, children: t('empty') }), rows.map((row, index) => (_jsx("div", { className: css.row, "data-row-kind": row.kind, children: row.kind === 'tool' ? (_jsxs("span", { className: css.toolRow, children: ["\uD83D\uDD0D ", row.name] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: css.role, children: row.kind === 'user' ? t('userRole') : t('assistantRole') }), row.kind === 'assistant'
                                    ? _jsx(MarkdownText, { text: row.text })
                                    : _jsx("p", { className: css.userText, children: row.text })] })) }, index)))] }), !atBottom && rows.length > 0 && (_jsx("button", { type: "button", className: css.backToBottom, onClick: scrollToBottom, children: t('backToBottom') })), _jsxs("div", { className: css.composer, children: [commandOptions.length > 0 && (_jsx("div", { className: css.commandMenu, role: "listbox", "aria-label": t('commandHint'), children: commandOptions.map(command => (_jsxs("button", { type: "button", className: css.commandItem, role: "option", "aria-selected": "false", onClick: () => { chooseCommand(command); }, children: ["/", command] }, command))) })), _jsx("textarea", { ref: inputRef, className: css.input, value: value, placeholder: t('commandPlaceholder'), onChange: (event) => { setValue(event.currentTarget.value); }, onKeyDown: (event) => {
                            // Shift+Enter remains the native newline even when it closes an IME composition.
                            if (event.key === 'Enter' && event.shiftKey)
                                return;
                            // keyCode 229 is the legacy IME signal used when isComposing is absent.
                            // oxlint-disable-next-line typescript/no-deprecated
                            const composing = composingRef.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;
                            if (event.key === 'Escape') {
                                if (composing)
                                    return;
                                event.preventDefault();
                                closeDrawer();
                                return;
                            }
                            if (event.key !== 'Enter' || composing)
                                return;
                            event.preventDefault();
                            if (event.repeat)
                                return;
                            void send();
                        }, onCompositionStart: onCompositionStart, onCompositionEnd: onCompositionEnd }), _jsxs("div", { className: css.composerToolbar, children: [_jsxs("div", { className: css.toolbarStart, children: [_jsx("button", { type: "button", className: css.commandTrigger, "aria-label": t('commandHint'), title: t('commandHint'), onClick: () => {
                                            setValue('/');
                                            inputRef.current?.focus();
                                        }, children: _jsx("span", { "aria-hidden": "true", children: "\uFF0B" }) }), _jsxs("span", { className: css.readonlyBadge, title: t('readonlyHint'), children: ["\uD83D\uDD12 ", t('readOnlyLabel')] }), generating && _jsxs("span", { className: css.generating, role: "status", children: [_jsx("span", { className: css.activityDot }), t('generating')] })] }), _jsxs("div", { className: css.toolbarEnd, children: [_jsx("label", { className: css.compactControl, title: t('modelLabel'), children: _jsxs("select", { ref: modelRef, className: css.select, value: currentModelKey, "aria-label": t('modelLabel'), disabled: directory === null || directorySessionId !== modelSessionId || sending || generating, onChange: event => { void selectModel(event.currentTarget.value); }, children: [currentModelKey !== '' && _jsx("option", { value: currentModelKey, children: currentModelDefinition?.name ?? directory?.current.model ?? currentModelKey }), directory?.groups.flatMap(group => group.models.map(model => ({
                                                    key: `${group.id}\u0000${model.id}`,
                                                    label: `${group.name} · ${model.name}`,
                                                }))).filter(option => option.key !== currentModelKey).map(option => (_jsx("option", { value: option.key, children: option.label }, option.key)))] }) }), _jsx("label", { className: css.compactControl, title: t('reasoningLabel'), children: _jsxs("select", { className: css.select, value: currentEffort ?? '', "aria-label": t('reasoningLabel'), disabled: directory === null || directorySessionId !== modelSessionId || sending || generating, onChange: event => { void selectReasoning(event.currentTarget.value); }, children: [_jsx("option", { value: "", children: t('defaultReasoning') }), reasoningEfforts.map(effort => (_jsx("option", { value: effort.id, children: effort.name }, effort.id)))] }) }), _jsx("button", { type: "button", className: css.send, "aria-label": sending ? t('sending') : t('send'), title: sending ? t('sending') : t('send'), disabled: sending || value.trim() === '', onClick: () => { void send(); }, children: sending ? '…' : '↑' })] })] })] })] }));
}
//# sourceMappingURL=AsideDrawer.js.map