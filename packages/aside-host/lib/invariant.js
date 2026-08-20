//#region lib/types/invariant.js
/** Package-owned invariant companion. @module @ywzhang1031/dsh-aside-host/invariant */
const PACKAGE_NAME = "@ywzhang1031/dsh-aside-host";
/** Cordis companion plugin name. */
const name = "aside-host-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/** No runtime invariant: the gateway only reads registries and creates sessions. */
const install = () => {};
/** Register this package's invariant companion. */
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
