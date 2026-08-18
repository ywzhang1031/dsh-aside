//#region lib/types/invariant.js
/** Package-owned invariant companion. @module @deepseek-ai/dsh-client-ui-aside/invariant */
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-aside";
/** Cordis companion plugin name. */
const name = "aside-ui-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/** No runtime invariant: anchors are client-side presentation state. */
const install = () => {};
/** Register this package's invariant companion. */
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
