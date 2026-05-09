import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getGeometryBuffer } from '../src/parts/GetGeometryBuffer/GetGeometryBuffer.ts'

test('getGeometryBuffer should return the geometry buffer from state', () => {
  const geometryBuffer = new ArrayBuffer(128)
  const state = {
    ...createDefaultState(),
    geometryBuffer,
  }

  const result = getGeometryBuffer(state)

  expect(result).toBe(geometryBuffer)
})
