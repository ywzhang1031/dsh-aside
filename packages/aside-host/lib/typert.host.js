import { n as ASIDE_LIST_DESCRIPTOR, r as ASIDE_PACKAGE, t as ASIDE_CREATE_DESCRIPTOR } from "./typert-contract.js";
//#region lib/types/typert.host.js
/** Host Typert contribution for the Aside Remote endpoints. @module dsh-aside-host/typert */
const TYPERT = {
	package: ASIDE_PACKAGE,
	face: "host",
	schemas: [],
	invocations: [ASIDE_CREATE_DESCRIPTOR, ASIDE_LIST_DESCRIPTOR],
	model: {
		services: [],
		events: [],
		objects: []
	}
};
//#endregion
export { TYPERT };
