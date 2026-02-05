import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const getPreviewDom = (): readonly any[] => {
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
