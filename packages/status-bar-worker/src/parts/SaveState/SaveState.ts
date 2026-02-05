import type { SavedState } from '../SavedState/SavedState.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const saveState = (state: StatusBarState): SavedState => {
  const { statusBarItemsLeft, statusBarItemsRight } = state
  return {
    itemsLeft: statusBarItemsLeft,
    itemsRight: statusBarItemsRight,
  }
}
