import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as ElementTags from '../ElementTags/ElementTags.ts'
import { getVirtualDomTag } from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as WaitForClickState from '../WaitForClickState/WaitForClickState.ts'

interface WaitForMutationOptions {
  readonly selector?: string
  readonly timeout?: number
}

const defaultTimeout = 5000
const pollInterval = 16

const hasClass = (className: unknown, expectedClass: string): boolean => {
  if (typeof className !== 'string') {
    return false
  }
  return className.split(' ').includes(expectedClass)
}

const isTagSelector = (selector: string): boolean => {
  const lowerCaseSelector = selector.toLowerCase()
  return (
    (Object.values(ElementTags) as readonly string[]).includes(lowerCaseSelector) || lowerCaseSelector === 'html' || lowerCaseSelector === 'style'
  )
}

const hasMatchingSelector = (dom: readonly any[], selector: string): boolean => {
  if (selector.startsWith('#')) {
    const id = selector.slice(1)
    return dom.some((node) => node && typeof node === 'object' && node.id === id)
  }
  if (selector.startsWith('.')) {
    const className = selector.slice(1)
    return dom.some((node) => node && typeof node === 'object' && hasClass(node.className, className))
  }
  if (isTagSelector(selector)) {
    const tag = getVirtualDomTag(selector.toLowerCase())
    return dom.some((node) => node && typeof node === 'object' && node.type === tag)
  }
  throw new Error(`Unsupported selector "${selector}". Supported selectors: #id, .class, tag`)
}

const waitForSelector = async (state: PreviewState, selector: string, timeout: number): Promise<void> => {
  const { sandboxRpc, uid } = state
  const start = Date.now()
  while (Date.now() - start <= timeout) {
    const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
    const dom = serialized?.dom ?? []
    if (hasMatchingSelector(dom, selector)) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }
  throw new Error(`Timed out waiting for selector "${selector}" after ${timeout}ms`)
}

export const waitForMutation = async (state: PreviewState, options?: WaitForMutationOptions): Promise<PreviewState> => {
  const selector = options?.selector
  if (selector) {
    const timeout = options?.timeout ?? defaultTimeout
    await waitForSelector(state, selector, timeout)
    return state
  }

  const { uid } = state
  const { promise, resolve } = Promise.withResolvers<void>()
  WaitForClickState.register('mutation', uid, resolve)
  await promise
  return state
}
