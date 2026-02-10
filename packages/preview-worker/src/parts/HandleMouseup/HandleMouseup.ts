import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'

export const handleMouseup = async (state: PreviewState, hdId: string): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleMouseup', uid, hdId)
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
