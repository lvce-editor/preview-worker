/* eslint-disable jest/no-disabled-tests */

import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { updateContent } from '../src/parts/UpdateContent/UpdateContent.ts'

test.skip('updateContent should execute tsx content in sandbox with react and babel scripts', async () => {
  const originalCaches = Object.getOwnPropertyDescriptor(globalThis, 'caches')

  const fetchMock = jest.fn(async (url: string) => {
    const text = url.includes('babel') ? 'globalThis.Babel = { transform: (source) => ({ code: source }) }' : '/* cdn script */'
    return {
      ok: true,
      text: async () => text,
    } as Response
  })

  const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(fetchMock as any)
  Object.defineProperty(globalThis, 'caches', { configurable: true, value: undefined })

  try {
    using rpc = RendererWorker.registerMockRpc({
      'FileSystem.readFile': (uri: string) => {
        if (uri === '/tmp/Component.tsx') {
          return 'export const Component = () => React.createElement("div", null, "Hello")'
        }
        throw new Error('unexpected uri')
      },
    })

    const invocations: readonly any[][] = []
    const sandboxRpc = {
      invoke: async (...args: readonly any[]): Promise<any> => {
        ;(invocations as any[]).push(args)
        if (args[0] === 'SandBox.getSerializedDom') {
          return {
            css: ['.tsx { color: red; }'],
            dom: [{ childCount: 0, type: 1 }],
          }
        }
        return undefined
      },
    }

    const state: PreviewState = {
      ...createDefaultState(),
      height: 480,
      sandboxRpc: sandboxRpc as any,
      uid: 7,
      width: 640,
    }

    const result = await updateContent(state, '/tmp/Component.tsx')

    expect(rpc.invocations).toEqual([['FileSystem.readFile', '/tmp/Component.tsx']])
    expect(invocations).toHaveLength(2)
    expect(invocations[0][0]).toBe('SandBox.loadContent')
    expect(invocations[0][1]).toBe(7)
    expect(invocations[0][2]).toBe(640)
    expect(invocations[0][3]).toBe(480)
    expect(invocations[0][4]).toBe('<!doctype html><html><head></head><body><div id="root"></div></body></html>')
    expect(invocations[0][5]).toHaveLength(1)
    expect(invocations[1]).toEqual(['SandBox.getSerializedDom', 7])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result.content).toBe('export const Component = () => React.createElement("div", null, "Hello")')
    expect(result.css).toEqual([])
    expect(result.errorMessage).toBe('')
    expect(result.scripts).toHaveLength(1)
    expect(result.styleSheets).toEqual([])
  } finally {
    fetchSpy.mockRestore()
    if (originalCaches) {
      Object.defineProperty(globalThis, 'caches', originalCaches)
    } else {
      Object.defineProperty(globalThis, 'caches', { configurable: true, value: undefined })
    }
  }
})
