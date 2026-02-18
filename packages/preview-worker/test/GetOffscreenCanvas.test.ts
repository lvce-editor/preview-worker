import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getOffscreenCanvas, executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'

const createState = () => {
  const sandboxRpc = {
    invokeAndTransfer: () => {},
  }
  const state = {
    sandboxRpc,
  }
  return {
    sandboxRpc,
    state,
  }
}

test('getOffscreenCanvas should invoke RendererWorker with correct parameters', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': () => {},
  })
  const { state } = createState()

  await getOffscreenCanvas(state as any, 0, 0, 0)

  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.createForPreview', 0, 0, 0]])
})

test('getOffscreenCanvas should store callback rpc and execute callback', async () => {
  const { sandboxRpc, state } = createState()
  const invokeAndTransfer = jest.fn()
  sandboxRpc.invokeAndTransfer = invokeAndTransfer

  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, 'arg-1', 'arg-2')
    },
  })

  await getOffscreenCanvas(state as any, 1, 100, 200)

  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.createForPreview', 1, 100, 200]])
  expect(invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(invokeAndTransfer).toHaveBeenCalledWith('SandBox.executeCallback', 1, 'arg-1', 'arg-2')
})

test('getOffscreenCanvas should propagate errors from RendererWorker', async () => {
  const testError = new Error('Failed to create OffscreenCanvas')
  const { state } = createState()
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': () => {
      throw testError
    },
  })

  await expect(getOffscreenCanvas(state as any, 2, 0, 0)).rejects.toThrow(testError)
  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.createForPreview', 2, 0, 0]])
})
