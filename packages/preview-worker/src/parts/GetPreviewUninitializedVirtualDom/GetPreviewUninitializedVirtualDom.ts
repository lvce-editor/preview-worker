import { mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const getPreviewUninitializedVirtualDom = (): readonly any[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Preview),
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeydown,
      onKeyUp: DomEventListenerFunctions.HandleKeyup,
      onMouseDown: DomEventListenerFunctions.HandleMousedown,
      onMouseMove: DomEventListenerFunctions.HandleMousemove,
      onMouseUp: DomEventListenerFunctions.HandleMouseup,
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Html,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Body,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    {
      text: 'Edit the file on the left to get started.',
      type: VirtualDomElements.Text,
    },
  ]
}
