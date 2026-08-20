import { expect, jest, test } from '@jest/globals'
import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import { handleEditorChanged } from '../src/parts/HandleEditorChanged/HandleEditorChanged.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('dispose removes the preview and stops rerenders after it is closed', async () => {
  const uid = 9004
  const disposeSandbox = jest.fn(async () => {})
  const state = {
    ...createDefaultState(),
    sandboxRpc: { dispose: disposeSandbox } as any,
    uid,
    uri: '/tmp/index.html',
  }
  PreviewStates.set(uid, state, state)

  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getUri': () => '/tmp/index.html',
    'Listener.unregister': () => {},
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await dispose(uid)
  await handleEditorChanged(77)

  expect(PreviewStates.getKeys()).not.toContain(uid)
  expect(disposeSandbox).toHaveBeenCalledTimes(1)
  expect(editorRpc.invocations).toEqual([
    ['Listener.unregister', 1, 9112],
    ['Editor.getUri', 77],
  ])
  expect(rendererRpc.invocations).toEqual([])
})

test('dispose keeps the editor change listener while another preview is open', async () => {
  const firstUid = 9005
  const secondUid = 9006
  const firstState = {
    ...createDefaultState(),
    sandboxRpc: { dispose: jest.fn(async () => {}) } as any,
    uid: firstUid,
  }
  const secondState = {
    ...createDefaultState(),
    sandboxRpc: { dispose: jest.fn(async () => {}) } as any,
    uid: secondUid,
  }
  PreviewStates.set(firstUid, firstState, firstState)
  PreviewStates.set(secondUid, secondState, secondState)

  using editorRpc = EditorWorker.registerMockRpc({
    'Listener.unregister': () => {},
  })

  await dispose(firstUid)

  expect(PreviewStates.getKeys()).not.toContain(firstUid)
  expect(PreviewStates.getKeys()).toContain(secondUid)
  expect(editorRpc.invocations).toEqual([])

  await dispose(secondUid)
})

test('an editor update in flight does not restore or rerender a disposed preview', async () => {
  const uid = 9007
  const state = {
    ...createDefaultState(),
    sandboxRpc: { dispose: jest.fn(async () => {}) } as any,
    uid,
    uri: '/tmp/index.html',
  }
  PreviewStates.set(uid, state, state)

  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': async () => {
      await dispose(uid)
      return '<h1>updated</h1>'
    },
    'Editor.getUri': () => '/tmp/index.html',
    'Listener.unregister': () => {},
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await handleEditorChanged(77)

  expect(PreviewStates.getKeys()).not.toContain(uid)
  expect(editorRpc.invocations).toEqual([
    ['Editor.getUri', 77],
    ['Editor.getText', 77],
    ['Listener.unregister', 1, 9112],
  ])
  expect(rendererRpc.invocations).toEqual([])
})
