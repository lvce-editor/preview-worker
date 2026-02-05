import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const handleFileEdited = async (state: PreviewState): Promise<PreviewState> => {
  const { content, errorMessage, parsedDom, parsedNodesChildNodeCount } = await updateContent(state, state.uri)

  return {
    ...state,
    content,
    errorMessage,
    parsedDom,
    parsedNodesChildNodeCount,
  }
}
