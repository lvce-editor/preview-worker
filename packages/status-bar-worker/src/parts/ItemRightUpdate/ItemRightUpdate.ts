import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
import * as UpdateArray from '../UpdateArray/UpdateArray.ts'

export const itemRightUpdate = (state: Readonly<StatusBarState.StatusBarState>, newItem: Readonly<StatusBarItem>): StatusBarState.StatusBarState => {
  const { statusBarItemsRight } = state
  const newStatusBarItemsRight = UpdateArray.updateArray([...statusBarItemsRight], newItem)
  return {
    ...state,
    statusBarItemsRight: newStatusBarItemsRight,
  }
}
