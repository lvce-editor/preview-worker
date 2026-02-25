import { isEqual } from 'lodash-es'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'

export const callAndUpdate = async (state: PreviewState, method: string, ...args: readonly any[]): Promise<PreviewState> => {
  const { parsedDom, parsedNodesChildNodeCount, sandboxRpc, uid } = state
  await sandboxRpc.invoke(method, uid, ...args)
  const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
  const nextParsedDom = serialized.dom
  const isEqualDom = isEqual(nextParsedDom, state.parsedDom)
  const newParsedDom = isEqual ? parsedDom : nextParsedDom
  const { css } = serialized
  const newParsedNodesChildNodeCount = isEqualDom ? parsedNodesChildNodeCount : GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)
  return {
    ...state,
    css,
    parsedDom: newParsedDom,
    parsedNodesChildNodeCount: newParsedNodesChildNodeCount,
  }
}
