import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getOffscreenCanvas } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'

test.skip('getOffscreenCanvas should invoke RendererWorker with correct parameters', async () => {
  const mockOffscreenCanvas = {} as OffscreenCanvas
  using mockRpc = RendererWorker.registerMockRpc({ 'OffscreenCanvas.create': () => mockOffscreenCanvas })

  const result = await getOffscreenCanvas()

  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.create']])
  expect(result).toBe(mockOffscreenCanvas)
})

test.skip('getOffscreenCanvas should return the OffscreenCanvas from RendererWorker', async () => {
  const mockCanvas = {} as OffscreenCanvas
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({ 'OffscreenCanvas.create': () => mockCanvas })

  const result = await getOffscreenCanvas()

  expect(result).toBe(mockCanvas)
})

test.skip('getOffscreenCanvas should propagate errors from RendererWorker', async () => {
  const testError = new Error('Failed to create OffscreenCanvas')
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.create': () => {
      throw testError
    },
  })

  await expect(getOffscreenCanvas()).rejects.toThrow(testError)
})
