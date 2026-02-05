import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const isEqual = (oldState: PreviewState, newState: PreviewState): boolean => {
  return oldState.statusBarItemsLeft === newState.statusBarItemsLeft && oldState.statusBarItemsRight === newState.statusBarItemsRight
}
