/** Package-owned invariant companion. @module @deepseek-ai/dsh-client-ui-aside/invariant */
const PACKAGE_NAME = '@deepseek-ai/dsh-client-ui-aside';
/** Cordis companion plugin name. */
export const name = 'aside-ui-invariant';
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants'];
/** No runtime invariant: anchors are client-side presentation state. */
const install = () => { };
/** Register this package's invariant companion. */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
/* jscpd:ignore-end */
//# sourceMappingURL=invariant.js.map