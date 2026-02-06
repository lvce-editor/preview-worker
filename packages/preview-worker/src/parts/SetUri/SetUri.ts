import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const setUri = async (state: PreviewState, uri: string): Promise<PreviewState> => {
  const { content, css, errorMessage, parsedDom, parsedNodesChildNodeCount } = await updateContent(state, uri)

  return {
    ...state,
    content,
    css,
    errorMessage,
    parsedDom,
    parsedNodesChildNodeCount,
    uri,
  }
}
