import { expect, jest, test } from '@jest/globals'
import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { setImmediate } from 'node:timers/promises'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('editor change notification completes while the preview is still rendering', async () => {
  const uid = 9100
  const state = { ...createDefaultState(), uid, uri: '/tmp/index.html' }
  PreviewStates.set(uid, state, state)
  const rendering = Promise.withResolvers<void>()
  const started = Promise.withResolvers<void>()
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => '<p>updated</p>',
    'Editor.getUri': () => state.uri,
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {
      started.resolve()
      return rendering.promise
    },
  })
  const notification = Promise.resolve(commandMap.handleEditorChanged(77))
  try {
    await started.promise
    const result = await Promise.race([notification.then(() => 'acknowledged'), setImmediate('blocked')])
    expect(result).toBe('acknowledged')
  } finally {
    rendering.resolve()
    await notification
    await setImmediate()
    PreviewStates.dispose(uid)
  }
})

test('rapid changes during script execution run one latest refresh without overlapping sandbox calls', async () => {
  const uid = 9101
  const execution = Promise.withResolvers<void>()
  const started = Promise.withResolvers<void>()
  const invoke = jest.fn(async (method: string) => {
    if (method === 'SandBox.loadContent') {
      started.resolve()
      await execution.promise
    }
    return { css: [], dom: [] }
  })
  const state = { ...createDefaultState(), sandboxRpc: { invoke } as any, uid, uri: '/tmp/index.html' }
  PreviewStates.set(uid, state, state)
  let content = '<script>draw(0)</script>'
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => content,
    'Editor.getUri': () => state.uri,
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })
  try {
    commandMap.handleEditorChanged(77)
    await started.promise
    for (let i = 1; i <= 100; i++) {
      content = `<script>draw(${i})</script>`
      await commandMap.handleEditorChanged(77)
    }
    expect(invoke).toHaveBeenCalledTimes(1)
    expect(rendererRpc.invocations).toEqual([])

    execution.resolve()
    await setImmediate()

    expect(PreviewStates.get(uid).newState.scripts).toEqual(['draw(100)'])
    expect(invoke.mock.calls.map(([method]) => method)).toEqual([
      'SandBox.loadContent',
      'SandBox.getSerializedDom',
      'SandBox.loadContent',
      'SandBox.getSerializedDom',
    ])
    expect(editorRpc.invocations.filter(([method]) => method === 'Editor.getText')).toHaveLength(2)
    expect(rendererRpc.invocations).toHaveLength(2)
  } finally {
    execution.resolve()
    await setImmediate()
    PreviewStates.dispose(uid)
  }
})

test('pending changes from different editors are both applied', async () => {
  const firstUid = 9102
  const secondUid = 9103
  const firstState = { ...createDefaultState(), uid: firstUid, uri: '/tmp/first.html' }
  const secondState = { ...createDefaultState(), uid: secondUid, uri: '/tmp/second.html' }
  PreviewStates.set(firstUid, firstState, firstState)
  PreviewStates.set(secondUid, secondState, secondState)
  const rendering = Promise.withResolvers<void>()
  const started = Promise.withResolvers<void>()
  let content = '<p>initial</p>'
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => content,
    'Editor.getUri': (editorUid: number) => (editorUid === 77 ? firstState.uri : secondState.uri),
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {
      started.resolve()
      return rendering.promise
    },
  })
  try {
    commandMap.handleEditorChanged(77)
    await started.promise
    content = '<p>latest</p>'
    commandMap.handleEditorChanged(77)
    commandMap.handleEditorChanged(78)
    rendering.resolve()
    await setImmediate()

    expect(PreviewStates.get(firstUid).newState.content).toBe(content)
    expect(PreviewStates.get(secondUid).newState.content).toBe(content)
    expect(rendererRpc.invocations).toHaveLength(3)
  } finally {
    rendering.resolve()
    await setImmediate()
    PreviewStates.dispose(firstUid)
    PreviewStates.dispose(secondUid)
  }
})

test('a failed background refresh does not prevent queued or future updates', async () => {
  const uid = 9104
  const state = { ...createDefaultState(), uid, uri: '/tmp/index.html' }
  PreviewStates.set(uid, state, state)
  const failure = new Error('editor closed')
  const firstUri = Promise.withResolvers<string>()
  let first = true
  using warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => '<p>latest</p>',
    'Editor.getUri': () => {
      if (first) {
        first = false
        return firstUri.promise
      }
      return state.uri
    },
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })
  try {
    commandMap.handleEditorChanged(77)
    commandMap.handleEditorChanged(78)
    firstUri.reject(failure)
    await setImmediate()
    expect(warn).toHaveBeenCalledWith('Failed to update preview after editor change:', failure)
    expect(PreviewStates.get(uid).newState.content).toBe('<p>latest</p>')
    expect(rendererRpc.invocations).toHaveLength(1)

    commandMap.handleEditorChanged(78)
    await setImmediate()
    expect(rendererRpc.invocations).toHaveLength(2)
  } finally {
    firstUri.resolve(state.uri)
    await setImmediate()
    PreviewStates.dispose(uid)
  }
})

test('closing a preview during a refresh does not restore it or render queued edits', async () => {
  const uid = 9105
  const state = { ...createDefaultState(), uid, uri: '/tmp/index.html' }
  PreviewStates.set(uid, state, state)
  const content = Promise.withResolvers<string>()
  const started = Promise.withResolvers<void>()
  using editorRpc = EditorWorker.registerMockRpc({
    'Editor.getText': () => {
      started.resolve()
      return content.promise
    },
    'Editor.getUri': () => state.uri,
  })
  using rendererRpc = RendererWorker.registerMockRpc({
    'Preview.rerender': () => {},
  })
  try {
    commandMap.handleEditorChanged(77)
    await started.promise
    commandMap.handleEditorChanged(77)
    PreviewStates.dispose(uid)
    content.resolve('<p>updated</p>')
    await setImmediate()
    expect(PreviewStates.getKeys()).not.toContain(uid)
    expect(rendererRpc.invocations).toEqual([])
  } finally {
    content.resolve('')
    await setImmediate()
  }
})
