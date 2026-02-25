import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'

export const rerender = async (state: PreviewState): Promise<PreviewState> => {
  if (state.loadJavaScript) {
    const { sandboxRpc, uid } = state
    const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
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

  // Create a new copy of parsedDom array to trigger diff
  const parsedDom = [...state.parsedDom]

  // Return a new state object with the copied parsedDom
  // This will cause DiffItems.isEqual to return false since parsedDom reference changed
  return {
    ...state,
    parsedDom,
  }
}

export const triggerRerender = async (state: PreviewState): Promise<PreviewState> => {
  await RendererWorker.invoke('Preview.rerender')
  return state
}
