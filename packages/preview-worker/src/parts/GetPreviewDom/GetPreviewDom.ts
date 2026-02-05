import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const getPreviewDom = (state: PreviewState): readonly any[] => {
  if (!state.uri) {
    return [
      {
        childCount: 1,
        className: 'Viewlet Preview',
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

  return [
    {
      childCount: 1,
      className: 'Viewlet Preview',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    {
      text: 'hello from preview',
      type: VirtualDomElements.Text,
    },
  ]
}
