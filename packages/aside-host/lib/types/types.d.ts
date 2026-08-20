/**
 * Wire vocabulary for the aside Remote domain: the payloads a browser
 * client sends and the results the gateway answers, kept JSON-serializable
 * and free of Host-only service types.
 * @module @ywzhang1031/dsh-aside-host/types
 */
/** Request: create one read-only side conversation under a parent session. */
export interface AsideCreateRequest {
    /** The main conversation this side conversation hangs off. */
    parentSessionId: string;
}
/** Result of a successful aside creation. */
export interface AsideCreateResult {
    /** The new side conversation's session id (open it in the drawer). */
    sessionId: string;
}
//# sourceMappingURL=types.d.ts.map