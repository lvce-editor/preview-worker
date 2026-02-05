import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'
import * as ToUiStatusBarItem from '../ToUiStatusBarItem/ToUiStatusBarItem.ts'

export const toUiStatusBarItems = (statusBarItems: readonly any[] | null | undefined): UiStatusBarItem[] => {
  if (!statusBarItems) {
    return []
  }
  return statusBarItems.map(ToUiStatusBarItem.toUiStatusBarItem)
}
