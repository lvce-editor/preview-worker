import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const setUri = (state: PreviewState, uri: string): PreviewState => {
  return {
    ...state,
    uri,
  }
}
