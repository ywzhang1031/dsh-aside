import { z } from "zod";
//#region lib/types/typert-contract.js
/**
* Package-owned Remote descriptor shared by the Host registry contribution
* and the browser Remote stub.
* @module @ywzhang1031/dsh-aside-host/typert-contract
*/
const ASIDE_PACKAGE = "@ywzhang1031/dsh-aside-host";
const anchorSchema = z.object({
	messageId: z.string().nullable(),
	exact: z.string(),
	prefix: z.string(),
	suffix: z.string(),
	occurrence: z.number().nullable(),
	startOffset: z.number().nullable()
});
const recordSchema = z.object({
	schemaVersion: z.literal(1),
	parentSessionId: z.string(),
	subSessionId: z.string(),
	anchor: anchorSchema,
	createdAt: z.number(),
	updatedAt: z.number()
});
/** Create one read-only side conversation and persist its anchor relationship. */
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
			schema: z.object({
				parentSessionId: z.string(),
				anchor: anchorSchema
			})
		}
	}],
	result: {
		mode: "strict",
		typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateResult`,
		schema: z.object({ record: recordSchema })
	}
};
/** List every aside hanging off one parent conversation. */
const ASIDE_LIST_DESCRIPTOR = {
	id: `${ASIDE_PACKAGE}#aside/list`,
	service: "aside",
	namespace: "aside",
	method: "list",
	invocation: { kind: "direct" },
	parameters: [{
		name: "request",
		wire: "request",
		source: "json",
		codec: {
			mode: "strict",
			typeSymbol: `${ASIDE_PACKAGE}/types#AsideListRequest`,
			schema: z.object({ parentSessionId: z.string() })
		}
	}],
	result: {
		mode: "strict",
		typeSymbol: `${ASIDE_PACKAGE}/types#AsideListResult`,
		schema: z.object({ records: z.array(recordSchema) })
	}
};
//#endregion
export { ASIDE_LIST_DESCRIPTOR as n, ASIDE_PACKAGE as r, ASIDE_CREATE_DESCRIPTOR as t };
