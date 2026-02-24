import { expect, test } from '@jest/globals'
import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleEditorChanged } from '../src/parts/HandleEditorChanged/HandleEditorChanged.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('handleEditorChanged should update preview css when linked stylesheet editor changes', async () => {
  const uid = 9001
  const previousState = {
    ...createDefaultState(),
    content: '<link rel="stylesheet" href="./app.css"><div id="target">x</div>',
    css: ['#target { color: rgb(255, 0, 0); }'],
    uid,
    uri: '/tmp/index.html',
  }
  PreviewStates.set(uid, previousState, previousState)

  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': (editorUid: number) => {
      if (editorUid === 77) {
        return '#target { color: rgb(0, 0, 255); }'
      }
      throw new Error('unexpected editor uid')
    },
    'Editor.getUri': (editorUid: number) => {
      if (editorUid === 77) {
        return '/tmp/app.css'
      }
      throw new Error('unexpected editor uid')
    },
  })

  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await handleEditorChanged(77)

  const { newState } = PreviewStates.get(uid)
  expect(newState.css).toEqual(['#target { color: rgb(0, 0, 255); }'])
  expect(newState.content).toBe(previousState.content)
  expect(editorRpc.invocations).toEqual([
    ['Editor.getUri', 77],
    ['Editor.getText', 77],
  ])
  expect(rendererRpc.invocations).toEqual([['Preview.rerender']])
})
