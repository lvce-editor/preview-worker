import { mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getEmptyPreviewDom = (): readonly any[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Preview),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    {
      text: 'No URI has been specified',
      type: VirtualDomElements.Text,
    },
  ]
}
