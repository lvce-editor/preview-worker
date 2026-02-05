import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'

export const itemRightCreate = (state: Readonly<StatusBarState.StatusBarState>, newItem: Readonly<StatusBarItem>): StatusBarState.StatusBarState => {
  const { statusBarItemsRight } = state
  const newStatusBarItemsRight = [...statusBarItemsRight, newItem]
  return {
    ...state,
    statusBarItemsRight: newStatusBarItemsRight,
  }
}
