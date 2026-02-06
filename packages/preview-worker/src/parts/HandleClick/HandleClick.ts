import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

export const handleClick = (state: PreviewState, hdId: string): PreviewState => {
  if (!hdId) {
    return state
  }
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return state
  }

  // Dispatch click event in happy-dom so event listeners fire
  const clickEvent = new happyDomInstance.window.MouseEvent('click', { bubbles: true })
  element.dispatchEvent(clickEvent)

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
  const {css} = serialized
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

  return {
    ...state,
    css,
    parsedDom,
    parsedNodesChildNodeCount,
  }
}
