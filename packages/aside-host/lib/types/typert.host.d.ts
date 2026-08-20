/** Host Typert contribution for the Aside Remote endpoint. @module @ywzhang1031/dsh-aside-host/typert */
export declare const TYPERT: {
    package: string;
    face: string;
    schemas: never[];
    invocations: {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: import("zod").ZodObject<{
                    parentSessionId: import("zod").ZodString;
                }, import("zod/v4/core").$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: import("zod").ZodObject<{
                sessionId: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
        };
    }[];
    model: {
        services: never[];
        events: never[];
        objects: never[];
    };
};
//# sourceMappingURL=typert.host.d.ts.map