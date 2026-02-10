import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEmptyPreviewDom } from '../GetEmptyPreviewDom/GetEmptyPreviewDom.ts'

const getErrorMessageNodes = (errorMessage: string): readonly any[] => {
  if (errorMessage) {
    return [
      {
        childCount: 1,
        className: 'PreviewErrorMessage',
        type: VirtualDomElements.Div,
      },
      {
        text: errorMessage,
        type: VirtualDomElements.Text,
      },
    ]
  }
  return [
    {
      childCount: 0,
      className: 'PreviewErrorMessage',
      type: VirtualDomElements.Div,
    },
  ]
}

export const getPreviewDom = (state: PreviewState): readonly any[] => {
  const { errorMessage, parsedDom, parsedNodesChildNodeCount, uri } = state

  if (!uri) {
    return getEmptyPreviewDom()
  }

  const errorMessageNodes = getErrorMessageNodes(errorMessage)

  // If parsedDom is available, render it as children of the wrapper
  if (parsedDom && parsedDom.length > 0) {
    return [
      {
        childCount: 2,
        className: 'Viewlet Preview',
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
      ...errorMessageNodes,
      {
        childCount: parsedNodesChildNodeCount,
        className: 'PreviewContents',
        type: VirtualDomElements.Div,
      },
      ...parsedDom,
    ]
  }

  return [
    {
      childCount: 2,
      className: 'Viewlet Preview',
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
    ...errorMessageNodes,
    {
      childCount: 1,
      className: 'PreviewContents',
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
