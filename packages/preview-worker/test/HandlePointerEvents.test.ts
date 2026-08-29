import { expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handlePointermove } from '../src/parts/HandlePointermove/HandlePointermove.ts'
import { handlePointerup } from '../src/parts/HandlePointerup/HandlePointerup.ts'

const createState = (invoke: ReturnType<typeof jest.fn>): any => {
  return {
    ...createDefaultState(),
    sandboxRpc: { invoke },
    uid: 7,
    x: 100,
    y: 20,
  }
}

test('handlePointermove forwards preview-relative coordinates to the sandbox', async () => {
  const invoke = jest.fn(async (..._args: readonly unknown[]) => undefined)
  const state = createState(invoke)

  const result = await handlePointermove(state, '4', 160, 75)

  expect(result).toBe(state)
  expect(invoke).toHaveBeenCalledWith('SandBox.handlePointermove', 7, '4', 60, 55)
})

test('handlePointerup forwards preview-relative coordinates to the sandbox', async () => {
  const invoke = jest.fn(async (..._args: readonly unknown[]) => undefined)
  const state = createState(invoke)

  const result = await handlePointerup(state, '4', 170, 80)

  expect(result).toBe(state)
  expect(invoke).toHaveBeenCalledWith('SandBox.handlePointerup', 7, '4', 70, 60)
})

test('pointer tracking ignores events without a sandbox element id', async () => {
  const invoke = jest.fn(async (..._args: readonly unknown[]) => undefined)
  const state = createState(invoke)

  await handlePointermove(state, '', 160, 75)
  await handlePointerup(state, '', 170, 80)

  expect(invoke).not.toHaveBeenCalled()
})
