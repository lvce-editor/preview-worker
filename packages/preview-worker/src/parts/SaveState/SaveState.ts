import type { SavedState } from '../SavedState/SavedState.ts'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const saveState = (state: PreviewState): SavedState => {
  const { statusBarItemsLeft, statusBarItemsRight } = state
  return {
    itemsLeft: statusBarItemsLeft,
    itemsRight: statusBarItemsRight,
  }
}
