import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'

export const loadScripts = async (
  state: PreviewState,
  content: string,
  css: PreviewState['css'],
  scripts: PreviewState['scripts'],
): Promise<PreviewState> => {
  const { height, sandboxRpc, uid, width } = state
  await sandboxRpc.invoke('SandBox.loadContent', uid, width, height, content, scripts)
  const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
  const finalParsedDom = serialized.dom
  const finalParsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(finalParsedDom)
  return {
    ...state,
    content,
    css,
    errorMessage: '',
    parsedDom: finalParsedDom,
    parsedNodesChildNodeCount: finalParsedNodesChildNodeCount,
    scripts,
  }
}
