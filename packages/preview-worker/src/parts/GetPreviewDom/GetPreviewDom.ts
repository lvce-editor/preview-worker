import { AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEmptyPreviewDom } from '../GetEmptyPreviewDom/GetEmptyPreviewDom.ts'
import { getPreviewUninitializedVirtualDom } from '../GetPreviewUninitializedVirtualDom/GetPreviewUninitializedVirtualDom.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const previewNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.Viewlet, ClassNames.Preview),
  onChange: DomEventListenerFunctions.HandleChange,
  onClick: DomEventListenerFunctions.HandleClick,
  onInput: DomEventListenerFunctions.HandleInput,
  onKeyDown: DomEventListenerFunctions.HandleKeydown,
  onKeyUp: DomEventListenerFunctions.HandleKeyup,
  onMouseDown: DomEventListenerFunctions.HandleMousedown,
  onMouseMove: DomEventListenerFunctions.HandleMousemove,
  onMouseUp: DomEventListenerFunctions.HandleMouseup,
  onPointerDown: DomEventListenerFunctions.HandlePointerdown,
  role: AriaRoles.Document,
  tabIndex: TabIndex.Focusable,
  type: VirtualDomElements.Div,
}

export const getPreviewDom = (state: PreviewState): readonly any[] => {
  const { parsedDom, parsedNodesChildNodeCount, uri } = state

  if (!uri) {
    return getEmptyPreviewDom()
  }

  // If parsedDom is available, render it as children of the wrapper
  if (parsedDom && parsedDom.length > 0) {
    return [
      previewNode,
      {
        childCount: parsedNodesChildNodeCount,
        className: ClassNames.Html,
        type: VirtualDomElements.Div,
      },
      ...parsedDom,
    ]
  }

  return getPreviewUninitializedVirtualDom()
}
