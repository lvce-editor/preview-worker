import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export const getIndex = (items: readonly StatusBarItem[], item: Readonly<StatusBarItem>): number => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === item.name) {
      return i
    }
  }
  return -1
}
