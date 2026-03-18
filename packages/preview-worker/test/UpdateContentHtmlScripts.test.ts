import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { updateContent } from '../src/parts/UpdateContent/UpdateContent.ts'

test('updateContent should load external script src and execute scripts in order', async () => {
  const originalFetch = globalThis.fetch

  const fetchMock = jest.fn(async () => {
    return {
      ok: true,
      text: async () => 'globalThis.THREE = { Scene: function Scene() {} }',
    } as Response
  })

  globalThis.fetch = fetchMock as any

  let rpc: any
  try {
    rpc = RendererWorker.registerMockRpc({
      'FileSystem.readFile': (uri: string) => {
        if (uri === '/tmp/index.html') {
          return `<script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script><script>new THREE.Scene()</script>`
        }
        throw new Error(`unexpected uri ${uri}`)
      },
    })

    const invocations: readonly any[][] = []
    const sandboxRpc = {
      invoke: async (...args: readonly any[]): Promise<any> => {
        ;(invocations as any[]).push(args)
        if (args[0] === 'SandBox.getSerializedDom') {
          return {
            css: [],
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

    const result = await updateContent(state, '/tmp/index.html')

    expect(rpc.invocations).toEqual([['FileSystem.readFile', '/tmp/index.html']])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]).toEqual(['https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js'])
    expect(invocations).toHaveLength(2)
    expect(invocations[0][0]).toBe('SandBox.loadContent')
    expect(invocations[0][1]).toBe(7)
    expect(invocations[0][2]).toBe(640)
    expect(invocations[0][3]).toBe(480)
    expect(invocations[0][4]).toBe(
      '<script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script><script>new THREE.Scene()</script>',
    )
    expect(invocations[0][5]).toEqual(['globalThis.THREE = { Scene: function Scene() {} }', 'new THREE.Scene()'])
    expect(invocations[1]).toEqual(['SandBox.getSerializedDom', 7])
    expect(result.scripts).toEqual(['globalThis.THREE = { Scene: function Scene() {} }', 'new THREE.Scene()'])
  } finally {
    rpc?.dispose?.()
    rpc?.[Symbol.dispose]?.()
    globalThis.fetch = originalFetch
  }
})
