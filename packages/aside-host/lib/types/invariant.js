/** Package-owned invariant companion. @module @deepseek-ai/dsh-aside-host/invariant */
const PACKAGE_NAME = '@deepseek-ai/dsh-aside-host';
/** Cordis companion plugin name. */
export const name = 'aside-host-invariant';
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants'];
/** No runtime invariant: the gateway only reads registries and creates sessions. */
const install = () => { };
/** Register this package's invariant companion. */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
/* jscpd:ignore-end */
//# sourceMappingURL=invariant.js.map