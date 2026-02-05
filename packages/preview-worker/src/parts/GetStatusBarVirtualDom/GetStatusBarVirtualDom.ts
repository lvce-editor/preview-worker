import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const getPreviewDom = (): readonly any[] => {
  return [
    {
      type: VirtualDomElements.H1,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'hello from preview',
    },
  ]
}
