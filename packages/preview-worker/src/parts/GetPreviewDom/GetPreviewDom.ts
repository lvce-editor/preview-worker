import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { getEmptyPreviewDom } from '../GetEmptyPreviewDom/GetEmptyPreviewDom.ts'

export const getPreviewDom = (state: PreviewState): readonly any[] => {
  if (!state.uri) {
    return getEmptyPreviewDom()
  }

  // If parsedDom is available, render it as children of the wrapper
  if (state.parsedDom && state.parsedDom.length > 0) {
    return [
      {
        childCount: state.parsedNodesChildNodeCount,
        className: 'Viewlet Preview',
        type: VirtualDomElements.Div,
      },
      ...state.parsedDom,
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
