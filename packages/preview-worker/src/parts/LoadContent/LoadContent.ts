import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

export const loadContent = async (state: PreviewState): Promise<PreviewState> => {
  const { assetDir, errorCount, platform, warningCount } = state
  const statusBarItemsPreference = await StatusBarPreferences.itemsVisible()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems(statusBarItemsPreference, assetDir, platform, errorCount, warningCount)
  return {
    ...state,
    errorCount: 0,
    initial: false,
    statusBarItemsLeft: [...statusBarItems],
    statusBarItemsRight: [],
    warningCount: 0,
  }
}
