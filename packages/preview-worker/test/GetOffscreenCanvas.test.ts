import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getOffscreenCanvas } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'

test('getOffscreenCanvas should invoke RendererWorker with correct parameters', async () => {
  const mockOffscreenCanvas = {} as OffscreenCanvas
  using mockRpc = RendererWorker.registerMockRpc({ 'OffscreenCanvas.create': () => mockOffscreenCanvas })

  const canvasId = 42
  const result = await getOffscreenCanvas(canvasId)

  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.create', canvasId]])
  expect(result).toBe(mockOffscreenCanvas)
})

test('getOffscreenCanvas should return the OffscreenCanvas from RendererWorker', async () => {
  const mockCanvas = {} as OffscreenCanvas
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({ 'OffscreenCanvas.create': () => mockCanvas })

  const result = await getOffscreenCanvas(1)

  expect(result).toBe(mockCanvas)
})

test('getOffscreenCanvas should propagate errors from RendererWorker', async () => {
  const testError = new Error('Failed to create OffscreenCanvas')
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.create': () => {
      throw testError
    },
  })

  await expect(getOffscreenCanvas(1)).rejects.toThrow(testError)
})
