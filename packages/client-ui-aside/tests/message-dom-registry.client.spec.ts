// @vitest-environment jsdom
/**
 * Message DOM registry tests: register/unregister lifecycle, lookup, and the
 * chat-anchor-row resolver (best-effort over the stock row attribute).
 */

import { describe, expect, it } from 'vitest'
import { MessageDomRegistry, chatAnchorRow, findMessageRowBefore } from '../src/client/message-dom-registry.ts'

describe('chatAnchorRow', () => {
  it('resolves the nearest chat-anchor row above a node', () => {
    const row = document.createElement('div')
    row.dataset.chatAnchorKey = 'assistant-step-1'
    const child = document.createElement('p')
    row.appendChild(child)
    document.body.appendChild(row)
    expect(chatAnchorRow(child)).toBe(row)
    expect(chatAnchorRow(document.body)).toBeNull()
    document.body.innerHTML = ''
  })

  it('finds the nearest matching message row before its registered turn tail', () => {
    const old = document.createElement('div')
    old.dataset.chatAnchorKey = '14:assistant-step1:1'
    old.textContent = 'same exact text'
    const oldTail = document.createElement('div')
    oldTail.dataset.chatAnchorKey = '9:turn-tail1'
    const current = document.createElement('div')
    current.dataset.chatAnchorKey = '14:assistant-step2:1'
    current.textContent = 'prefix same exact text suffix'
    const currentTail = document.createElement('div')
    currentTail.dataset.chatAnchorKey = '9:turn-tail2'
    document.body.append(old, oldTail, current, currentTail)

    expect(findMessageRowBefore(currentTail, 'same exact text')).toBe(current)
    expect(findMessageRowBefore(currentTail, 'missing')).toBeNull()
    document.body.innerHTML = ''
  })
})

describe('MessageDomRegistry', () => {
  it('registers and unregisters a message entry', () => {
    const registry = new MessageDomRegistry()
    const sentinel = document.createElement('button')
    const turnTail = document.createElement('div')
    const unregister = registry.register('m-1', { sentinel, turnTail })
    expect(registry.get('m-1')).toEqual({ sentinel, turnTail })
    expect(registry.size).toBe(1)
    unregister()
    expect(registry.get('m-1')).toBeUndefined()
    expect(registry.size).toBe(0)
  })

  it('only unregisters the exact entry it registered', () => {
    const registry = new MessageDomRegistry()
    const first = { sentinel: document.createElement('button'), turnTail: document.createElement('div') }
    const unregister = registry.register('m-1', first)
    registry.register('m-1', { sentinel: document.createElement('button'), turnTail: document.createElement('div') })
    unregister()
    expect(registry.get('m-1')).toBeDefined()
  })
})
