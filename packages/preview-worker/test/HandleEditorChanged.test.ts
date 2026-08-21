import { expect, test } from '@jest/globals'
import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleEditorChanged } from '../src/parts/HandleEditorChanged/HandleEditorChanged.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('handleEditorChanged should not rerender when no preview is open', async () => {
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getKeys': () => [],
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await handleEditorChanged()

  expect(editorRpc.invocations).toEqual([])
  expect(rendererRpc.invocations).toEqual([])
})

test('handleEditorChanged should update preview css when linked stylesheet editor changes', async () => {
  const uid = 9001
  const previousState = {
    ...createDefaultState(),
    content: '<link rel="stylesheet" href="./app.css"><div id="target">x</div>',
    css: ['#target { color: rgb(255, 0, 0); }'],
    styleSheets: [{ href: './app.css', type: 'link' }] as const,
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

test('handleEditorChanged should match linked stylesheet when editor uri uses file scheme', async () => {
  const uid = 9002
  const previousState = {
    ...createDefaultState(),
    content: '<link rel="stylesheet" href="./app.css"><div id="target">x</div>',
    css: ['#target { color: rgb(255, 0, 0); }'],
    styleSheets: [{ href: './app.css', type: 'link' }] as const,
    uid,
    uri: '/tmp/index.html',
  }
  PreviewStates.set(uid, previousState, previousState)

  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': (editorUid: number) => {
      if (editorUid === 78) {
        return '#target { color: rgb(0, 255, 0); }'
      }
      throw new Error('unexpected editor uid')
    },
    'Editor.getUri': (editorUid: number) => {
      if (editorUid === 78) {
        return 'file:///tmp/app.css'
      }
      throw new Error('unexpected editor uid')
    },
  })

  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await handleEditorChanged(78)

  const { newState } = PreviewStates.get(uid)
  expect(newState.css).toEqual(['#target { color: rgb(0, 255, 0); }'])
  expect(editorRpc.invocations).toEqual([
    ['Editor.getUri', 78],
    ['Editor.getText', 78],
  ])
  expect(rendererRpc.invocations).toEqual([['Preview.rerender']])
})

test('handleEditorChanged should reinitialize scripts and use their serialized dom', async () => {
  const uid = 9003
  const content = '<canvas id="tree" width="320" height="180"></canvas><script>drawTree(10)</script>'
  const serializedDom = [
    { childCount: 1, type: 4 },
    { childCount: 0, id: 'tree', type: 17 },
  ]
  const sandboxInvocations: readonly any[][] = []
  const sandboxRpc = {
    invoke: async (...parameters: readonly any[]): Promise<any> => {
      ;(sandboxInvocations as any[]).push(parameters)
      if (parameters[0] === 'SandBox.getSerializedDom') {
        return {
          css: [],
          dom: serializedDom,
        }
      }
      return undefined
    },
  }
  const previousState = {
    ...createDefaultState(),
    content: '<canvas id="tree" width="320" height="180"></canvas><script>drawTree(7)</script>',
    height: 480,
    sandboxRpc: sandboxRpc as any,
    scripts: ['drawTree(7)'],
    uid,
    uri: '/tmp/index.html',
    width: 640,
  }
  PreviewStates.set(uid, previousState, previousState)

  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => content,
    'Editor.getUri': () => '/tmp/index.html',
  })

  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await handleEditorChanged(79)

  const { newState } = PreviewStates.get(uid)
  expect(newState.content).toBe(content)
  expect(newState.scripts).toEqual(['drawTree(10)'])
  expect(newState.parsedDom).toBe(serializedDom)
  expect(sandboxInvocations).toEqual([
    ['SandBox.loadContent', uid, 640, 480, content, ['drawTree(10)']],
    ['SandBox.getSerializedDom', uid],
  ])
  expect(editorRpc.invocations).toEqual([
    ['Editor.getUri', 79],
    ['Editor.getText', 79],
  ])
  expect(rendererRpc.invocations).toEqual([['Preview.rerender']])
})

test('handleEditorChanged should reinitialize scripts when a linked script editor changes', async () => {
  const uid = 9004
  const content = '<output id="status"></output><script src="./app.js"></script>'
  const serializedDom = [
    { childCount: 1, type: 4 },
    { childCount: 0, id: 'status', text: '1023 branches', type: 20 },
  ]
  const sandboxInvocations: readonly any[][] = []
  const sandboxRpc = {
    invoke: async (...parameters: readonly any[]): Promise<any> => {
      ;(sandboxInvocations as any[]).push(parameters)
      if (parameters[0] === 'SandBox.getSerializedDom') {
        return {
          css: [],
          dom: serializedDom,
        }
      }
      return undefined
    },
  }
  const previousState = {
    ...createDefaultState(),
    content,
    height: 480,
    sandboxRpc: sandboxRpc as any,
    scripts: ["document.getElementById('status').textContent = '127 branches'"],
    uid,
    uri: '/tmp/index.html',
    width: 640,
  }
  PreviewStates.set(uid, previousState, previousState)

  const updatedScript = "document.getElementById('status').textContent = '1023 branches'"
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => updatedScript,
    'Editor.getUri': () => 'file:///tmp/app.js',
  })

  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })

  await handleEditorChanged(80)

  const { newState } = PreviewStates.get(uid)
  expect(newState.content).toBe(content)
  expect(newState.scripts).toEqual([updatedScript])
  expect(newState.parsedDom).toBe(serializedDom)
  expect(sandboxInvocations).toEqual([
    ['SandBox.loadContent', uid, 640, 480, content, [updatedScript]],
    ['SandBox.getSerializedDom', uid],
  ])
  expect(editorRpc.invocations).toEqual([
    ['Editor.getUri', 80],
    ['Editor.getText', 80],
  ])
  expect(rendererRpc.invocations).toEqual([['Preview.rerender']])
})
