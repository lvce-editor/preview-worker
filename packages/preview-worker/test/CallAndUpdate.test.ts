import { expect, jest, test } from '@jest/globals'
import * as CallAndUpdate from '../src/parts/CallAndUpdate/CallAndUpdate.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('callAndUpdate should call sandbox method and return same state reference', async () => {
  const currentParsedDom = [{ childCount: 0, type: 1 }] as any
  const invoke = jest.fn(async (method: string) => {
    return undefined
  })
  const state = {
    ...createDefaultState(),
    parsedDom: currentParsedDom,
    parsedNodesChildNodeCount: 1,
    sandboxRpc: {
      invoke,
    } as any,
    uid: 1,
  }

  const result = await CallAndUpdate.callAndUpdate(state, 'SandBox.eval', 'abc')

  expect(result).toBe(state)
  expect(result.parsedDom).toBe(currentParsedDom)
  expect(result.parsedNodesChildNodeCount).toBe(1)
  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke.mock.calls[0]).toEqual(['SandBox.eval', 1, 'abc'])
})

test('callAndUpdate should pass uid and arguments through to sandbox invoke', async () => {
  const currentParsedDom = [{ childCount: 0, type: 1 }] as any
  const invoke = jest.fn(async (method: string) => {
    return undefined
  })
  const state = {
    ...createDefaultState(),
    parsedDom: currentParsedDom,
    parsedNodesChildNodeCount: 1,
    sandboxRpc: {
      invoke,
    } as any,
    uid: 1,
  }

  const result = await CallAndUpdate.callAndUpdate(state, 'SandBox.eval')

  expect(result).toBe(state)
  expect(result.parsedDom).toBe(currentParsedDom)
  expect(result.parsedNodesChildNodeCount).toBe(1)
  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke.mock.calls[0]).toEqual(['SandBox.eval', 1])
})
