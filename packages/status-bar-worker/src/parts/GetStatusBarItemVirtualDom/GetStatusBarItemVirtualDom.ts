import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getStatusBarItemElementVirtualDom } from '../GetStatusBarItemElementVirtualDom/GetStatusBarItemElementVirtualDom.ts'

export const getStatusBarItemVirtualDom = (statusBarItem: StatusBarItem): readonly VirtualDomNode[] => {
  const { ariaLabel, elements, name, tooltip } = statusBarItem
  const elementNodes = elements.flatMap(getStatusBarItemElementVirtualDom)
  const buttonNode: VirtualDomNode = {
    ariaLabel,
    childCount: elements.length,
    className: ClassNames.StatusBarItem,
    name,
    role: AriaRoles.Button,
    tabIndex: -1,
    title: tooltip,
    type: VirtualDomElements.Button,
  }
  return [buttonNode, ...elementNodes]
}
