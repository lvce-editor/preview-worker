import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getPreviewDom } from '../src/parts/GetPreviewDom/GetPreviewDom.ts'
import { getPreviewUninitializedVirtualDom } from '../src/parts/GetPreviewUninitializedVirtualDom/GetPreviewUninitializedVirtualDom.ts'
import { renderEventListeners } from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('both preview wrappers attach the registered wheel forwarding handler', () => {
  const state = {
    ...createDefaultState(),
    parsedDom: [{ childCount: 0, type: VirtualDomElements.Canvas }],
    parsedNodesChildNodeCount: 1,
    uri: 'memfs:///index.html',
  }
  const wrappers = [getPreviewDom(state)[0], getPreviewUninitializedVirtualDom()[0]]
  const handler = renderEventListeners().find((listener) => listener.name === DomEventListenerFunctions.HandleWheel)
  expect(handler).toBeDefined()
  for (const wrapper of wrappers) {
    expect(wrapper.onWheel).toBe(handler?.name)
  }
})
