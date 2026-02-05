import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
import * as UpdateArray from '../UpdateArray/UpdateArray.ts'

export const itemLeftUpdate = (state: Readonly<StatusBarState.StatusBarState>, newItem: Readonly<StatusBarItem>): StatusBarState.StatusBarState => {
  return {
    ...state,
    statusBarItemsLeft: UpdateArray.updateArray([...state.statusBarItemsLeft], newItem),
  }
}
