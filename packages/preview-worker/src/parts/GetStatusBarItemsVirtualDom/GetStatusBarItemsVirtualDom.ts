import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as GetStatusBarItemVirtualDom from '../GetStatusBarItemVirtualDom/GetStatusBarItemVirtualDom.ts'

export const getStatusBarItemsVirtualDom = (items: readonly StatusBarItem[], className: string): readonly VirtualDomNode[] => {
  if (items.length === 0) {
    return []
  }
  return [
    {
      childCount: items.length,
      className,
      type: VirtualDomElements.Div,
    },
    ...items.flatMap(GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom),
  ]
}
