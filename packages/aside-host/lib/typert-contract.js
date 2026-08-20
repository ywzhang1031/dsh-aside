import { z } from "zod";
//#region lib/types/typert-contract.js
/**
* Package-owned Remote descriptor shared by the Host registry contribution
* and the browser Remote stub.
* @module @ywzhang1031/dsh-aside-host/typert-contract
*/
const ASIDE_PACKAGE = "@ywzhang1031/dsh-aside-host";
/** The single wire endpoint exposed by the Aside gateway. */
const ASIDE_CREATE_DESCRIPTOR = {
	id: `${ASIDE_PACKAGE}#aside/create`,
	service: "aside",
	namespace: "aside",
	method: "create",
	invocation: { kind: "direct" },
	parameters: [{
		name: "request",
		wire: "request",
		source: "json",
		codec: {
			mode: "strict",
			typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateRequest`,
			schema: z.object({ parentSessionId: z.string() })
		}
	}],
	result: {
		mode: "strict",
		typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateResult`,
		schema: z.object({ sessionId: z.string() })
	}
};
//#endregion
export { ASIDE_PACKAGE as n, ASIDE_CREATE_DESCRIPTOR as t };
