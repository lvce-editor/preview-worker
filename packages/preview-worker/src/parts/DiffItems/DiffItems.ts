import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const isEqual = (oldState: PreviewState, newState: PreviewState): boolean => {
  return (
    oldState.warningCount === newState.warningCount &&
    oldState.initial === newState.initial &&
    oldState.content === newState.content &&
    oldState.parsedDom === newState.parsedDom
  )
}
