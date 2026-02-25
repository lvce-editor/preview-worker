import { expect, jest, test } from '@jest/globals'
import * as CallAndUpdate from '../src/parts/CallAndUpdate/CallAndUpdate.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('callAndUpdate should reuse current parsedDom reference when serialized dom is deeply equal', async () => {
  const currentParsedDom = [{ childCount: 0, type: 1 }] as any
  const nextParsedDom = [{ childCount: 0, type: 1 }] as any
  const invoke = jest.fn(async (method: string) => {
    if (method === 'SandBox.getSerializedDom') {
      return {
        css: [],
        dom: nextParsedDom,
      }
    }
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

  expect(result.parsedDom).toBe(currentParsedDom)
  expect(result.parsedNodesChildNodeCount).toBe(1)
  expect(invoke).toHaveBeenNthCalledWith(1, 'SandBox.eval', 1, 'abc')
  expect(invoke).toHaveBeenNthCalledWith(2, 'SandBox.getSerializedDom', 1)
})

test('callAndUpdate should use new parsedDom reference when serialized dom is different', async () => {
  const currentParsedDom = [{ childCount: 0, type: 1 }] as any
  const nextParsedDom = [
    { childCount: 0, type: 1 },
    { childCount: 0, type: 1 },
  ] as any
  const invoke = jest.fn(async (method: string) => {
    if (method === 'SandBox.getSerializedDom') {
      return {
        css: [],
        dom: nextParsedDom,
      }
    }
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

  expect(result.parsedDom).toBe(nextParsedDom)
  expect(result.parsedNodesChildNodeCount).toBe(2)
})
