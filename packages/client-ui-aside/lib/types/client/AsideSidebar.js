import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Codex-style frame sidebar: a standing right rail with three sections —
 * produced files, web-search sources, and the aside chats anchored into the
 * current main conversation. Artifacts open through the Host path opener;
 * sources open in a new tab; aside entries reopen their side conversation in
 * the drawer (the same target as an inline anchor click).
 * @module @deepseek-ai/dsh-client-ui-aside/AsideSidebar
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { foldArtifacts, foldSources } from "./fold.js";
import css from './AsideSidebar.module.css';
const REFRESH_MS = 5000;
export function AsideSidebar({ anchors, sessions, api, onOpenAside, t }) {
    const sessionId = useSyncExternalStore(listener => sessions.subscribe(listener), () => sessions.getCurrent());
    const anchorVersion = useSyncExternalStore(listener => anchors.subscribe(listener), () => anchors.getVersion());
    const [artifacts, setArtifacts] = useState([]);
    const [sources, setSources] = useState([]);
    const [open, setOpen] = useState(() => new Set(['asides']));
    const asideEntries = useMemo(() => sessionId === null ? [] : [...anchors.list(sessionId)], [anchors, sessionId, anchorVersion]);
    // Fold the current main conversation's produced files and search sources,
    // refreshing on a light cadence while the session stays selected.
    useEffect(() => {
        if (sessionId === null) {
            setArtifacts([]);
            setSources([]);
            return;
        }
        let disposed = false;
        const refresh = async () => {
            try {
                const response = await api.sessions.history({ sessionId: sessionId, maxMessages: 200 });
                if (disposed || !response.result.ok)
                    return;
                setArtifacts(foldArtifacts(response.result.value.events));
                setSources(foldSources(response.result.value.events));
            }
            catch {
                // Transient read failure: keep the last folds; the next tick retries.
            }
        };
        void refresh();
        const timer = setInterval(() => { void refresh(); }, REFRESH_MS);
        return () => {
            disposed = true;
            clearInterval(timer);
        };
    }, [sessionId, api]);
    const toggle = (key) => {
        setOpen((current) => {
            const next = new Set(current);
            if (next.has(key))
                next.delete(key);
            else
                next.add(key);
            return next;
        });
    };
    const openArtifact = (path) => {
        // Loopback-only privileged RPC; failures stay silent like the tool rows.
        void api
            .host?.openPath?.({ path })
            .catch(() => { });
    };
    const openSource = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    return (_jsxs("nav", { className: css.sidebar, "aria-label": t('sidebarLabel'), children: [_jsxs("section", { className: css.section, children: [_jsxs("button", { type: "button", className: css.sectionHead, "aria-expanded": open.has('asides'), onClick: () => { toggle('asides'); }, children: [_jsx("span", { children: t('asidesTitle') }), _jsx("span", { className: css.count, children: asideEntries.length })] }), open.has('asides') && (_jsxs("ul", { className: css.list, children: [asideEntries.length === 0 && _jsx("li", { className: css.empty, children: t('asidesEmpty') }), asideEntries.map(anchor => (_jsx("li", { children: _jsx("button", { type: "button", className: css.asideEntry, title: anchor.text, onClick: () => { onOpenAside(anchor); }, children: _jsx("span", { className: css.asideText, children: anchor.text.replace(/\s+/g, ' ').slice(0, 60) }) }) }, anchor.subSessionId)))] }))] }), _jsxs("section", { className: css.section, children: [_jsxs("button", { type: "button", className: css.sectionHead, "aria-expanded": open.has('artifacts'), onClick: () => { toggle('artifacts'); }, children: [_jsx("span", { children: t('artifactsTitle') }), _jsx("span", { className: css.count, children: artifacts.length })] }), open.has('artifacts') && (_jsxs("ul", { className: css.list, children: [artifacts.length === 0 && _jsx("li", { className: css.empty, children: t('artifactsEmpty') }), artifacts.map(artifact => (_jsx("li", { children: _jsxs("button", { type: "button", className: css.artifactEntry, title: artifact.path, onClick: () => { openArtifact(artifact.path); }, children: ["\uD83D\uDCC4 ", artifact.name] }) }, artifact.path)))] }))] }), _jsxs("section", { className: css.section, children: [_jsxs("button", { type: "button", className: css.sectionHead, "aria-expanded": open.has('sources'), onClick: () => { toggle('sources'); }, children: [_jsx("span", { children: t('sourcesTitle') }), _jsx("span", { className: css.count, children: sources.length })] }), open.has('sources') && (_jsxs("ul", { className: css.list, children: [sources.length === 0 && _jsx("li", { className: css.empty, children: t('sourcesEmpty') }), sources.map(source => (_jsx("li", { children: _jsx("a", { className: css.sourceEntry, href: source.url, title: source.meta ?? source.url, target: "_blank", rel: "noopener noreferrer", onClick: (event) => {
                                        event.preventDefault();
                                        openSource(source.url);
                                    }, children: source.title }) }, source.url)))] }))] })] }));
}
//# sourceMappingURL=AsideSidebar.js.map