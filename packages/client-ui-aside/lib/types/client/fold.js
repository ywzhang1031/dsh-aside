/**
 * Sidebar folds over raw history entries: produced-file paths and web-search
 * sources, both extracted from settled `tool/result` metadata — the same
 * durable facts the tool cards present, folded across the whole conversation
 * instead of one turn. Pure functions; the sidebar component supplies the
 * history entries and the refresh cadence.
 * @module @deepseek-ai/dsh-client-ui-aside/fold
 */
/** Whether a tool/result payload is a mutation (write/edit) outcome. */
function isMutationMeta(meta) {
    return typeof meta === 'object' && meta !== null
        && ('path' in meta || 'diffs' in meta || 'locations' in meta);
}
/** Collect one path from a location-ish value, deduplicating through the set. */
function collectPath(value, seen, out) {
    if (typeof value !== 'object' || value === null)
        return;
    const path = value.path;
    if (typeof path !== 'string' || path === '' || seen.has(path))
        return;
    seen.add(path);
    out.push({ path, name: path.split(/[/\\]/).pop() ?? path });
}
/** Fold every produced file path out of settled tool results. */
export function foldArtifacts(entries) {
    const seen = new Set();
    const out = [];
    for (const entry of entries) {
        const event = entry.event;
        if (event.type !== 'tool/result')
            continue;
        const data = event.data;
        if (data?.isError === true || data?.meta === undefined)
            continue;
        const meta = data.meta;
        if (!isMutationMeta(meta))
            continue;
        if (typeof meta.path === 'string')
            collectPath({ path: meta.path }, seen, out);
        const locations = Array.isArray(meta.locations) ? meta.locations : [];
        const diffs = Array.isArray(meta.diffs) ? meta.diffs : [];
        for (const location of locations)
            collectPath(location, seen, out);
        for (const diff of diffs)
            collectPath(diff, seen, out);
    }
    return out;
}
/** Whether a tool/result payload is a web-search outcome with sources. */
function isSearchMeta(meta) {
    return typeof meta === 'object' && meta !== null && 'sources' in meta;
}
/** Fold every web-search source out of settled tool results. */
export function foldSources(entries) {
    const seen = new Set();
    const out = [];
    for (const entry of entries) {
        const event = entry.event;
        if (event.type !== 'tool/result')
            continue;
        const data = event.data;
        if (data?.meta === undefined || !isSearchMeta(data.meta))
            continue;
        const sources = Array.isArray(data.meta.sources) ? data.meta.sources : [];
        for (const source of sources) {
            if (typeof source !== 'object' || source === null)
                continue;
            const record = source;
            const title = typeof record.title === 'string' ? record.title : '';
            const url = typeof record.url === 'string' ? record.url : '';
            if (url === '' || seen.has(url))
                continue;
            seen.add(url);
            const meta = [];
            if (typeof record.snippet === 'string' && record.snippet !== '')
                meta.push(record.snippet);
            if (typeof record.publishedAt === 'string' && record.publishedAt !== '')
                meta.push(`(${record.publishedAt})`);
            out.push({
                title: title === '' ? url : title,
                url,
                ...(meta.length > 0 ? { meta: meta.join(' — ') } : {}),
            });
        }
    }
    return out;
}
//# sourceMappingURL=fold.js.map