import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

test('handleClick should return state unchanged when name is empty', async () => {
  const state: PreviewState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should return state unchanged when item is not found', async () => {
  const state: PreviewState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'non-existent-item')
  expect(result).toBe(state)
})

test('handleClick should return the same state object', async () => {
  const state: PreviewState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'any-item')
  expect(result).toBe(state)
})

test('handleClick should call handleClickNotification when item is Notifications', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Notifications',
        elements: [],
        name: 'Notifications',
        tooltip: 'Notifications',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'Notifications')

  // HandleClickNotification is a TODO, so it doesn't call any RPC methods yet
  expect(mockRendererRpc.invocations).toEqual([])
})

test('handleClick should call handleClickProblems when item is Problems', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [
      {
        ariaLabel: 'Problems',
        elements: [],
        name: 'Problems',
        tooltip: 'Problems',
      },
    ],
  }

  await HandleClick.handleClick(state, 'Problems')

  expect(mockRendererRpc.invocations).toContainEqual(['Layout.showPanel'])
  expect(mockRendererRpc.invocations).toContainEqual(['Panel.toggleView', 'Problems'])
})

test('handleClick should call handleClickExtensionStatusBarItem for extension items', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'My Extension Item',
        command: 'my.extension.command',
        elements: [],
        name: 'my-extension-item',
        tooltip: 'My Extension Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'my-extension-item')

  expect(mockExtensionHostRpc.invocations).toContainEqual(['ExtensionHostStatusBar.executeCommand', 'my-extension-item'])
})

test('handleClick should find item in statusBarItemsLeft', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Left Item',
        elements: [],
        name: 'left-item',
        tooltip: 'Left Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'left-item')

  expect(mockExtensionHostRpc.invocations).toContainEqual(['ExtensionHostStatusBar.executeCommand', 'left-item'])
})

test('handleClick should find item in statusBarItemsRight', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [
      {
        ariaLabel: 'Right Item',
        elements: [],
        name: 'right-item',
        tooltip: 'Right Item',
      },
    ],
  }

  await HandleClick.handleClick(state, 'right-item')

  expect(mockExtensionHostRpc.invocations).toContainEqual(['ExtensionHostStatusBar.executeCommand', 'right-item'])
})

test('handleClick should prioritize left items over right items with same name', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Left Item',
        command: 'left.command',
        elements: [],
        name: 'duplicate-item',
        tooltip: 'Left Item',
      },
    ],
    statusBarItemsRight: [
      {
        ariaLabel: 'Right Item',
        command: 'right.command',
        elements: [],
        name: 'duplicate-item',
        tooltip: 'Right Item',
      },
    ],
  }

  await HandleClick.handleClick(state, 'duplicate-item')

  expect(mockExtensionHostRpc.invocations).toEqual([['ExtensionHostStatusBar.executeCommand', 'duplicate-item']])
})

test('handleClick should handle extension item with command property', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Extension with Command',
        command: 'my.extension.command',
        elements: [],
        name: 'extension-with-command',
        tooltip: 'Extension with Command',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'extension-with-command')

  expect(mockExtensionHostRpc.invocations).toContainEqual(['ExtensionHostStatusBar.executeCommand', 'extension-with-command'])
})

test('handleClick should handle multiple items in left array', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Item 1',
        elements: [],
        name: 'item-1',
        tooltip: 'Item 1',
      },
      {
        ariaLabel: 'Item 2',
        elements: [],
        name: 'item-2',
        tooltip: 'Item 2',
      },
      {
        ariaLabel: 'Item 3',
        elements: [],
        name: 'item-3',
        tooltip: 'Item 3',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'item-2')

  expect(mockExtensionHostRpc.invocations).toContainEqual(['ExtensionHostStatusBar.executeCommand', 'item-2'])
})

test('handleClick should handle multiple items in right array', async () => {
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [
      {
        ariaLabel: 'Right 1',
        elements: [],
        name: 'right-1',
        tooltip: 'Right 1',
      },
      {
        ariaLabel: 'Right 2',
        elements: [],
        name: 'right-2',
        tooltip: 'Right 2',
      },
      {
        ariaLabel: 'Right 3',
        elements: [],
        name: 'right-3',
        tooltip: 'Right 3',
      },
    ],
  }

  await HandleClick.handleClick(state, 'right-2')

  expect(mockExtensionHostRpc.invocations).toContainEqual(['ExtensionHostStatusBar.executeCommand', 'right-2'])
})

test('handleClick should not call RPC methods for empty name', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = createDefaultState()

  await HandleClick.handleClick(state, '')

  expect(mockRendererRpc.invocations).toEqual([])
  expect(mockExtensionHostRpc.invocations).toEqual([])
})

test('handleClick should not call RPC methods for item not found', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostStatusBar.executeCommand': async () => {},
  })

  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Existing Item',
        elements: [],
        name: 'existing-item',
        tooltip: 'Existing Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'non-existent-item')

  expect(mockRendererRpc.invocations).toEqual([])
  expect(mockExtensionHostRpc.invocations).toEqual([])
})
