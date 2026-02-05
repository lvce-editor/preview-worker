import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const setUri = async (state: PreviewState, uri: string): Promise<PreviewState> => {
  const { content, errorMessage, parsedDom } = await updateContent(state, uri)

  return {
    ...state,
    content,
    errorMessage,
    parsedDom,
    uri,
  }
}
