import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface SavedState {
  readonly itemsLeft: readonly StatusBarItem[]
  readonly itemsRight: readonly StatusBarItem[]
}
