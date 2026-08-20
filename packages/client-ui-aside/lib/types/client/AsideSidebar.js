import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Frame sidebar: a standing right rail listing the aside chats anchored into
 * the current main conversation. Each entry opens its side conversation in
 * the drawer and locates the parent message. The list comes from the Host
 * repository cache (no localStorage, no history polling); switching the
 * parent session triggers one `aside.list` refresh.
 * @module dsh-client-ui-aside/AsideSidebar
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { asideText } from "./repository.js";
import css from './AsideSidebar.module.css';
/** Compact locale-aware timestamp for one sidebar row. */
export function formatAsideTime(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(timestamp));
}
export function AsideSidebar({ repository, drawer, sessions, onOpenAside, t }) {
    const sessionId = useSyncExternalStore(listener => sessions.subscribe(listener), () => sessions.getCurrent());
    const version = useSyncExternalStore(listener => repository.subscribe(listener), () => repository.getVersion());
    const drawerVersion = useSyncExternalStore(listener => drawer.subscribe(listener), () => drawer.getVersion());
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (sessionId === null) {
            repository.clear();
            setLoading(false);
            return;
        }
        let disposed = false;
        setLoading(true);
        void repository.refresh(sessionId).finally(() => {
            if (!disposed)
                setLoading(false);
        });
        return () => {
            disposed = true;
        };
    }, [sessionId, repository]);
    const entries = useMemo(() => {
        void version;
        return [...repository.list()].sort((left, right) => right.updatedAt - left.updatedAt);
    }, [repository, version]);
    void drawerVersion;
    const activeSubSessionId = drawer.get().subSessionId;
    return (_jsx("nav", { className: css.sidebar, "aria-label": t('sidebarLabel'), children: _jsxs("section", { className: css.section, children: [_jsxs("button", { type: "button", className: css.sectionHead, "aria-expanded": open, onClick: () => { setOpen(current => !current); }, children: [_jsx("span", { children: t('asidesTitle') }), _jsx("span", { className: css.count, children: entries.length })] }), open && (_jsxs("ul", { className: css.list, children: [loading && entries.length === 0 && _jsx("li", { className: css.empty, children: t('asidesLoading') }), !loading && entries.length === 0 && _jsx("li", { className: css.empty, children: t('asidesEmpty') }), entries.map(record => (_jsx("li", { children: _jsxs("button", { type: "button", className: `${css.asideEntry}${record.subSessionId === activeSubSessionId ? ` ${css.active}` : ''}`, title: record.anchor.exact, "aria-label": `${t('openAside')}: ${asideText(record)}`, "aria-current": record.subSessionId === activeSubSessionId ? 'true' : undefined, onClick: () => { onOpenAside(record); }, children: [_jsx("span", { className: css.asideText, children: asideText(record) }), _jsx("time", { className: css.asideTime, dateTime: new Date(record.updatedAt).toISOString(), title: new Date(record.updatedAt).toLocaleString(), children: t('updatedAt', { time: formatAsideTime(record.updatedAt) }) })] }) }, record.subSessionId)))] }))] }) }));
}
//# sourceMappingURL=AsideSidebar.js.map