import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export const getMatchingItem = (
  itemsLeft: readonly StatusBarItem[],
  itemsRight: readonly StatusBarItem[],
  name: string,
): StatusBarItem | undefined => {
  for (const item of itemsLeft) {
    if (item.name === name) {
      return item
    }
  }
  for (const item of itemsRight) {
    if (item.name === name) {
      return item
    }
  }
  return undefined
}
