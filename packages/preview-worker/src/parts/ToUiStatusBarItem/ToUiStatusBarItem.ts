import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'

const getActualIcon = (extensionHostStatusBarItem: any): string => {
  if (extensionHostStatusBarItem.icon === 'branch') {
    return 'Branch'
  }
  return extensionHostStatusBarItem.icon || ''
}

export const toUiStatusBarItem = (extensionHostStatusBarItem: any): UiStatusBarItem => {
  return {
    command: extensionHostStatusBarItem.command || '',
    icon: getActualIcon(extensionHostStatusBarItem),
    name: extensionHostStatusBarItem.id || extensionHostStatusBarItem.name || '',
    text: extensionHostStatusBarItem.text || '',
    tooltip: extensionHostStatusBarItem.tooltip || '',
  }
}
