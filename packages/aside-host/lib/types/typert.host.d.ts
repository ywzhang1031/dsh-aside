/** Host Typert contribution for the Aside Remote endpoints. @module @ywzhang1031/dsh-aside-host/typert */
export declare const TYPERT: {
    package: string;
    face: string;
    schemas: never[];
    invocations: ({
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
                    anchor: import("zod").ZodObject<{
                        messageId: import("zod").ZodNullable<import("zod").ZodString>;
                        exact: import("zod").ZodString;
                        prefix: import("zod").ZodString;
                        suffix: import("zod").ZodString;
                        occurrence: import("zod").ZodNullable<import("zod").ZodNumber>;
                        startOffset: import("zod").ZodNullable<import("zod").ZodNumber>;
                    }, import("zod/v4/core").$strip>;
                }, import("zod/v4/core").$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: import("zod").ZodObject<{
                record: import("zod").ZodObject<{
                    schemaVersion: import("zod").ZodLiteral<1>;
                    parentSessionId: import("zod").ZodString;
                    subSessionId: import("zod").ZodString;
                    anchor: import("zod").ZodObject<{
                        messageId: import("zod").ZodNullable<import("zod").ZodString>;
                        exact: import("zod").ZodString;
                        prefix: import("zod").ZodString;
                        suffix: import("zod").ZodString;
                        occurrence: import("zod").ZodNullable<import("zod").ZodNumber>;
                        startOffset: import("zod").ZodNullable<import("zod").ZodNumber>;
                    }, import("zod/v4/core").$strip>;
                    createdAt: import("zod").ZodNumber;
                    updatedAt: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
        };
    } | {
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
                records: import("zod").ZodArray<import("zod").ZodObject<{
                    schemaVersion: import("zod").ZodLiteral<1>;
                    parentSessionId: import("zod").ZodString;
                    subSessionId: import("zod").ZodString;
                    anchor: import("zod").ZodObject<{
                        messageId: import("zod").ZodNullable<import("zod").ZodString>;
                        exact: import("zod").ZodString;
                        prefix: import("zod").ZodString;
                        suffix: import("zod").ZodString;
                        occurrence: import("zod").ZodNullable<import("zod").ZodNumber>;
                        startOffset: import("zod").ZodNullable<import("zod").ZodNumber>;
                    }, import("zod/v4/core").$strip>;
                    createdAt: import("zod").ZodNumber;
                    updatedAt: import("zod").ZodNumber;
                }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>;
        };
    })[];
    model: {
        services: never[];
        events: never[];
        objects: never[];
    };
};
//# sourceMappingURL=typert.host.d.ts.map