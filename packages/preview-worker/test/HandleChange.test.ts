import { expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleChange } from '../src/parts/HandleChange/HandleChange.ts'

test('handleChange forwards the changed value to the sandbox', async () => {
  const invoke = jest.fn(async (..._args: readonly any[]) => undefined)
  const state = {
    ...createDefaultState(),
    sandboxRpc: { invoke } as any,
    uid: 7,
  }

  const result = await handleChange(state, '1', '#00ff00')

  expect(result).toBe(state)
  expect(invoke).toHaveBeenCalledWith('SandBox.handleChange', 7, '1', '#00ff00')
})

test('handleChange ignores events without an element id', async () => {
  const invoke = jest.fn(async (..._args: readonly any[]) => undefined)
  const state = {
    ...createDefaultState(),
    sandboxRpc: { invoke } as any,
  }

  const result = await handleChange(state, '', '#00ff00')

  expect(result).toBe(state)
  expect(invoke).not.toHaveBeenCalled()
})
