/**
 * Package-owned Remote descriptor shared by the Host registry contribution
 * and the browser Remote stub.
 * @module dsh-aside-host/typert-contract
 */
import { z } from 'zod';
export declare const ASIDE_PACKAGE = "dsh-aside-host";
/** Create one read-only side conversation and persist its anchor relationship. */
export declare const ASIDE_CREATE_DESCRIPTOR: {
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
            schema: z.ZodObject<{
                parentSessionId: z.ZodString;
                anchor: z.ZodObject<{
                    messageId: z.ZodNullable<z.ZodString>;
                    exact: z.ZodString;
                    prefix: z.ZodString;
                    suffix: z.ZodString;
                    occurrence: z.ZodNullable<z.ZodNumber>;
                    startOffset: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        };
    }[];
    result: {
        mode: "strict";
        typeSymbol: string;
        schema: z.ZodObject<{
            record: z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                parentSessionId: z.ZodString;
                subSessionId: z.ZodString;
                anchor: z.ZodObject<{
                    messageId: z.ZodNullable<z.ZodString>;
                    exact: z.ZodString;
                    prefix: z.ZodString;
                    suffix: z.ZodString;
                    occurrence: z.ZodNullable<z.ZodNumber>;
                    startOffset: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strip>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>;
    };
};
/** List every aside hanging off one parent conversation. */
export declare const ASIDE_LIST_DESCRIPTOR: {
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
            schema: z.ZodObject<{
                parentSessionId: z.ZodString;
            }, z.core.$strip>;
        };
    }[];
    result: {
        mode: "strict";
        typeSymbol: string;
        schema: z.ZodObject<{
            records: z.ZodArray<z.ZodObject<{
                schemaVersion: z.ZodLiteral<1>;
                parentSessionId: z.ZodString;
                subSessionId: z.ZodString;
                anchor: z.ZodObject<{
                    messageId: z.ZodNullable<z.ZodString>;
                    exact: z.ZodString;
                    prefix: z.ZodString;
                    suffix: z.ZodString;
                    occurrence: z.ZodNullable<z.ZodNumber>;
                    startOffset: z.ZodNullable<z.ZodNumber>;
                }, z.core.$strip>;
                createdAt: z.ZodNumber;
                updatedAt: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    };
};
//# sourceMappingURL=typert-contract.d.ts.map