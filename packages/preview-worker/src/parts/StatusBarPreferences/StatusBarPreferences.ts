import * as Preferences from '../Preferences/Preferences.ts'

export const itemsVisible = async (): Promise<boolean> => {
  const statusBarItemsPreference = (await Preferences.get('statusBar.itemsVisible')) ?? true
  return statusBarItemsPreference
}
