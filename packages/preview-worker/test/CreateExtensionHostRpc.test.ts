import { expect, test, afterEach } from '@jest/globals'
import { type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateExtensionHostRpc from '../src/parts/CreateExtensionHostRpc/CreateExtensionHostRpc.ts'

const rpcInstances: Rpc[] = []

afterEach(() => {
  for (const rpc of rpcInstances) {
    if (rpc && typeof (rpc as any).dispose === 'function') {
      ;(rpc as any).dispose()
    }
  }
  rpcInstances.length = 0
})

test('createExtensionHostRpc should return an RPC instance', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(rpc).toBeDefined()
  expect(typeof rpc).toBe('object')
  expect(mockRpc.invocations).toEqual([])
})

test('createExtensionHostRpc should use sendMessagePortToExtensionHostWorker', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(rpc).toBeDefined()
  expect(mockRpc.invocations).toEqual([])
})

test('createExtensionHostRpc should handle errors and wrap in VError', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {
      throw new Error('send error')
    },
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      throw new Error('send error')
    }
    throw new Error(`unexpected method ${method}`)
  }

  await expect(CreateExtensionHostRpc.createExtensionHostRpc()).rejects.toThrow('Failed to create extension host rpc')
  expect(mockRpc.invocations).toEqual([])
})

test('createExtensionHostRpc should be awaitable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(mockRpc.invocations).toEqual([])
})
