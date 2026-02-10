import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const setErrorMessage = (state: PreviewState, errorMessage: string): PreviewState => {
  return {
    ...state,
    errorMessage,
  }
}
