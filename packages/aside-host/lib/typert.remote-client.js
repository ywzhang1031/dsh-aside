import { n as ASIDE_LIST_DESCRIPTOR, r as ASIDE_PACKAGE, t as ASIDE_CREATE_DESCRIPTOR } from "./typert-contract.js";
//#region lib/types/typert.remote-client.js
/** Browser Remote contribution for the Aside endpoints. @module dsh-aside-host/remote */
const TYPERT_REMOTE = {
	package: ASIDE_PACKAGE,
	descriptors: [ASIDE_CREATE_DESCRIPTOR, ASIDE_LIST_DESCRIPTOR]
};
//#endregion
export { TYPERT_REMOTE, TYPERT_REMOTE as default };
