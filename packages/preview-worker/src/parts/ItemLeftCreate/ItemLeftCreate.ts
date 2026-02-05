import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const itemLeftCreate = (state: StatusBarState, name: string, text: string, tooltip: string, ariaLabel: string): StatusBarState => {
  const { statusBarItemsLeft } = state
  const newItem: StatusBarItem = {
    ariaLabel,
    elements: [{ type: 'text', value: text }],
    name,
    tooltip,
  }
  const newStatusBarItemsLeft = [...statusBarItemsLeft, newItem]
  return {
    ...state,
    statusBarItemsLeft: newStatusBarItemsLeft,
  }
}
