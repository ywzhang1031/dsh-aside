/** Host Typert contribution for the Aside Remote endpoints. @module @ywzhang1031/dsh-aside-host/typert */

import { ASIDE_CREATE_DESCRIPTOR, ASIDE_LIST_DESCRIPTOR, ASIDE_PACKAGE } from './typert-contract.ts'

export const TYPERT = {
  package: ASIDE_PACKAGE,
  face: 'host',
  schemas: [],
  invocations: [ASIDE_CREATE_DESCRIPTOR, ASIDE_LIST_DESCRIPTOR],
  model: {
    services: [],
    events: [],
    objects: [],
  },
}
