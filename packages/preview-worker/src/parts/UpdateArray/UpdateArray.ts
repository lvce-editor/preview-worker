import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'

export const updateArray = (items: readonly StatusBarItem[], newItem: Readonly<StatusBarItem>): StatusBarItem[] => {
  const index = getIndex(items, newItem)
  const before = items.slice(0, index)
  const after = items.slice(index + 1)
  return [...before, newItem, ...after]
}
