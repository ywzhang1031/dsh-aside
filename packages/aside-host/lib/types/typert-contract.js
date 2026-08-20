/**
 * Package-owned Remote descriptor shared by the Host registry contribution
 * and the browser Remote stub.
 * @module @ywzhang1031/dsh-aside-host/typert-contract
 */
import { z } from 'zod';
export const ASIDE_PACKAGE = '@ywzhang1031/dsh-aside-host';
/** The single wire endpoint exposed by the Aside gateway. */
export const ASIDE_CREATE_DESCRIPTOR = {
    id: `${ASIDE_PACKAGE}#aside/create`,
    service: 'aside',
    namespace: 'aside',
    method: 'create',
    invocation: { kind: 'direct' },
    parameters: [{
            name: 'request',
            wire: 'request',
            source: 'json',
            codec: {
                mode: 'strict',
                typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateRequest`,
                schema: z.object({ parentSessionId: z.string() }),
            },
        }],
    result: {
        mode: 'strict',
        typeSymbol: `${ASIDE_PACKAGE}/types#AsideCreateResult`,
        schema: z.object({ sessionId: z.string() }),
    },
};
//# sourceMappingURL=typert-contract.js.map