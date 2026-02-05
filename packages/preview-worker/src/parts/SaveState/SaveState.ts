import type { PreviewState } from '../PreviewState/PreviewState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: PreviewState): SavedState => {
  const { statusBarItemsLeft, statusBarItemsRight } = state
  return {
    itemsLeft: statusBarItemsLeft,
    itemsRight: statusBarItemsRight,
  }
}
