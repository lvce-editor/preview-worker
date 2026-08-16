import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { resize } from '../src/parts/Resize/Resize.ts'

test('resize forwards viewport dimensions to the preview sandbox', async () => {
  const invocations: unknown[][] = []
  const invoke = async (...args: unknown[]): Promise<void> => {
    invocations.push(args)
  }
  const state: PreviewState = {
    ...createDefaultState(),
    sandboxRpc: { invoke } as any,
    uid: 12,
  }
  const dimensions = { height: 600, width: 400, x: 1452, y: 29 }

  const result = await resize(state, dimensions)

  expect(invocations).toEqual([['SandBox.resize', 12, dimensions]])
  expect(result).toMatchObject(dimensions)
})
