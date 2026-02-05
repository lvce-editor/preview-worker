import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetStatusBarItemsVirtualDom from '../GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.ts'

const getChildCount = (leftCount: number, rightCount: number): number => {
  let count = 0
  if (leftCount > 0) {
    count++
  }
  if (rightCount > 0) {
    count++
  }
  return count
}

export const getStatusBarVirtualDom = (
  statusBarItemsLeft: readonly StatusBarItem[],
  statusBarItemsRight: readonly StatusBarItem[],
): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: getChildCount(statusBarItemsLeft.length, statusBarItemsRight.length),
      className: 'StatusBar',
      onClick: DomEventListenerFunctions.HandleClick,
      role: AriaRoles.Status,
      type: VirtualDomElements.Div,
    },
    ...GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsLeft, ClassNames.StatusBarItemsLeft),
    ...GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsRight, ClassNames.StatusBarItemsRight),
  ]
  return dom
}
