/** Browser Remote contribution for the Aside endpoints. @module dsh-aside-host/remote */

import type {
  RemoteResult,
  TypertRemoteContribution,
} from '@deepseek-ai/dsh-typert-protocol'
import type { AsideCreateRequest, AsideCreateResult, AsideListRequest, AsideListResult } from './types.ts'
import { ASIDE_CREATE_DESCRIPTOR, ASIDE_LIST_DESCRIPTOR, ASIDE_PACKAGE } from './typert-contract.ts'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespace$6173696465 {
    create: (request: AsideCreateRequest) => Promise<RemoteResult<AsideCreateResult>>
    list: (request: AsideListRequest) => Promise<RemoteResult<AsideListResult>>
  }
  interface TypertRemoteMap {
    'aside/create': (request: AsideCreateRequest) => Promise<RemoteResult<AsideCreateResult>>
    'aside/list': (request: AsideListRequest) => Promise<RemoteResult<AsideListResult>>
  }
  interface TypertRemoteNamespaceMap {
    aside: TypertRemoteNamespace$6173696465
  }
}

export const TYPERT_REMOTE: TypertRemoteContribution = {
  package: ASIDE_PACKAGE,
  descriptors: [ASIDE_CREATE_DESCRIPTOR, ASIDE_LIST_DESCRIPTOR],
}

export default TYPERT_REMOTE
