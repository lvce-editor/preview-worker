import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const handleFileEdited = async (state: PreviewState): Promise<PreviewState> => {
  const { content, css, errorMessage, parsedDom, parsedNodesChildNodeCount, scripts, styleSheets } = await updateContent(state, state.uri)

  let finalParsedDom = parsedDom
  let finalCss = [...css]
  let finalParsedNodesChildNodeCount = parsedNodesChildNodeCount

  if (scripts.length > 0) {
    const { sandboxRpc, uid } = state
    await sandboxRpc.invoke('SandBox.initialize', uid, content, scripts)
    const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
    finalParsedDom = serialized.dom
    finalCss = [...serialized.css]
    for (const cssContent of css) {
      if (!finalCss.includes(cssContent)) {
        finalCss.push(cssContent)
      }
    }
    finalParsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(finalParsedDom)
  }

  return {
    ...state,
    content,
    css: finalCss,
    errorMessage,
    parsedDom: finalParsedDom,
    parsedNodesChildNodeCount: finalParsedNodesChildNodeCount,
    scripts,
    styleSheets,
  }
}
