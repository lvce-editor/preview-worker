import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const handleFileEdited = async (state: PreviewState): Promise<PreviewState> => {
  return updateContent(state, state.uri)
}
