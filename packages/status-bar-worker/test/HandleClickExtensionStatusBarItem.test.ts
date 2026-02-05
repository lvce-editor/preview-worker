import { expect, test } from '@jest/globals'
import { ExtensionHost } from '@lvce-editor/rpc-registry'
import * as HandleClickExtensionStatusBarItem from '../src/parts/HandleClickExtensionStatusBarItem/HandleClickExtensionStatusBarItem.ts'

test('handleClickExtensionStatusBarItem should invoke ExtensionHostStatusBar.executeCommand', async () => {
  using mockRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  await HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem('test-command')

  expect(mockRpc.invocations).toEqual([['ExtensionHostStatusBar.executeCommand', 'test-command']])
})

test('handleClickExtensionStatusBarItem should pass command name to RPC', async () => {
  using mockRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  await HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem('my-custom-command')

  expect(mockRpc.invocations).toEqual([['ExtensionHostStatusBar.executeCommand', 'my-custom-command']])
})
