import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { ClassNames, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'

const getTextVirtualDom = (element: StatusBarItemElement): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'StatusBarItemLabel',
      type: VirtualDomElements.Span,
    },
    text(element.value),
  ]
}

const getIconVirtualDom = (element: StatusBarItemElement): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, element.value),
      type: VirtualDomElements.Div,
    },
  ]
}

export const getStatusBarItemElementVirtualDom = (element: StatusBarItemElement): readonly VirtualDomNode[] => {
  if (element.type === 'text') {
    return getTextVirtualDom(element)
  }
  if (element.type === 'icon') {
    return getIconVirtualDom(element)
  }
  return []
}
