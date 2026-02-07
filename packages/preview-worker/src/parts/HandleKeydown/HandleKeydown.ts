import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchKeydownEvent from '../DispatchKeydownEvent/DispatchKeydownEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

export const handleKeydown = (state: PreviewState, hdId: string, key: string, code: string): PreviewState => {
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = hdId ? happyDomInstance.elementMap.get(hdId) : happyDomInstance.document
  if (!element) {
    return state
  }

  // Dispatch keydown event in happy-dom so event listeners fire
  DispatchKeydownEvent.dispatchKeydownEvent(element, happyDomInstance.window, key, code)

  // Re-serialize the (potentially mutated) DOM
  const elementMap = new Map<string, any>()
  const serialized = SerializeHappyDom.serialize(happyDomInstance.document, elementMap)

  // Update happy-dom state with new element map
  HappyDomState.set(state.uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

  const parsedDom = serialized.dom
  const { css } = serialized
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

  return {
    ...state,
    css,
    parsedDom,
    parsedNodesChildNodeCount,
  }
}
