import { expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { initializeGeometryBuffer } from '../src/parts/InitializeGeometryBuffer/InitializeGeometryBuffer.ts'

test('initializeGeometryBuffer should create a geometry buffer and send it to the sandbox', async () => {
  const invoke = jest.fn(async () => undefined)
  const state = {
    ...createDefaultState(),
    sandboxRpc: {
      invoke,
    } as any,
    uid: 7,
  }

  const result = await initializeGeometryBuffer(state, 16)

  expect(result.geometryBuffer).not.toBeNull()
  expect(result.geometryBuffer?.byteLength).toBeGreaterThan(0)
  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke.mock.calls[0]).toEqual(['SandBox.setGeometryBuffer', 7, result.geometryBuffer])
})
