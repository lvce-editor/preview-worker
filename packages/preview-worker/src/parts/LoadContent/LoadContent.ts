import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const loadContent = async (state: PreviewState): Promise<PreviewState> => {
  return {
    ...state,
    errorCount: 0,
    initial: false,
    warningCount: 0,
  }
}
