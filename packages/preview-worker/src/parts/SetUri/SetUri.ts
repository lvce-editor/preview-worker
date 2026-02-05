import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const setUri = async (state: PreviewState, uri: string): Promise<PreviewState> => {
  return {
    ...state,
    uri,
  }
}
