import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'

const getLinkedStyleSheetCss = (state: PreviewState): readonly string[] => {
  const linkedCss: string[] = []
  let cssIndex = 0
  for (const styleSheet of state.styleSheets) {
    if (styleSheet.type === 'style') {
      if (state.loadStyleElements && styleSheet.content) {
        cssIndex++
      }
      continue
    }
    if (!state.loadExternalStyleSheets || !styleSheet.href) {
      continue
    }
    const cssContent = state.css[cssIndex]
    if (cssContent) {
      linkedCss.push(cssContent)
      cssIndex++
    }
  }
  return linkedCss
}

export const rerender = async (state: PreviewState): Promise<PreviewState> => {
  const { loadJavaScript, sandboxRpc, scripts, uid } = state
  if (!loadJavaScript || scripts.length === 0) {
    return state
  }
  const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
  const parsedDom = serialized.dom
  const css = [...serialized.css]
  for (const linkedCss of getLinkedStyleSheetCss(state)) {
    if (!css.includes(linkedCss)) {
      css.push(linkedCss)
    }
  }
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)
  return {
    ...state,
    css,
    parsedDom,
    parsedNodesChildNodeCount,
  }
}
