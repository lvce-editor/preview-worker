import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as Initialize from '../src/parts/Initialize/Initialize.ts'

test('initialize should create extension host rpc and set it', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
  })
  await Initialize.initialize()

  expect(mockRendererRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker', expect.anything(), 'HandleMessagePort.handleMessagePort2', 7201],
  ])
  await ExtensionHost.dispose()
})
