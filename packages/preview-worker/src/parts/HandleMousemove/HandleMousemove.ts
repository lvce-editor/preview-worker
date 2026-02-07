import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMousemoveEvent from '../DispatchMousemoveEvent/DispatchMousemoveEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

export const handleMousemove = (state: PreviewState, hdId: string, clientX: number, clientY: number): PreviewState => {
  // console.log('mousemove,', hdId, clientX, clientY)
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

  // console.log({ element })
  // Dispatch mousemove event in happy-dom so event listeners fire
  DispatchMousemoveEvent.dispatchMousemoveEvent(element, happyDomInstance.window, clientX, clientY)

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
