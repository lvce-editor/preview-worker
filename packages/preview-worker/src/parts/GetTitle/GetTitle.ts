import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const getTitle = (state: PreviewState): string => {
  const { title } = state
  return title
}
