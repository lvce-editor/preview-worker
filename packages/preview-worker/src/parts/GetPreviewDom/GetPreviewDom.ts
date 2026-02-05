import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

const getEmptyPreviewDom = (): readonly any[] => {
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

export const getPreviewDom = (state: PreviewState): readonly any[] => {
  if (!state.uri) {
    return getEmptyPreviewDom()
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
