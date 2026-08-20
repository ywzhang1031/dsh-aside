/**
 * Package-owned Remote descriptor shared by the Host registry contribution
 * and the browser Remote stub.
 * @module @ywzhang1031/dsh-aside-host/typert-contract
 */
import { z } from 'zod';
export declare const ASIDE_PACKAGE = "@ywzhang1031/dsh-aside-host";
/** The single wire endpoint exposed by the Aside gateway. */
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
            }, z.core.$strip>;
        };
    }[];
    result: {
        mode: "strict";
        typeSymbol: string;
        schema: z.ZodObject<{
            sessionId: z.ZodString;
        }, z.core.$strip>;
    };
};
//# sourceMappingURL=typert-contract.d.ts.map