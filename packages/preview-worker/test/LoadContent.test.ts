import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should load Preview items when preference is true', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return true
      }
      return undefined
    },
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        command: 'test.command',
        icon: 'test-icon',
        id: 'test.item',
        text: 'Test Item',
        tooltip: 'Test Tooltip',
      },
    ],
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    ['Preferences.get', 'statusBar.itemsVisible'],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result.statusBarItemsLeft).toEqual([
    {
      ariaLabel: 'Test Item',
      command: 'test.command',
      elements: [
        { type: 'icon', value: 'test-icon' },
        { type: 'text', value: 'Test Item' },
      ],
      name: 'test.item',
      tooltip: 'Test Tooltip',
    },
    {
      ariaLabel: 'Notifications',
      command: '',
      elements: [{ type: 'text', value: 'Notifications' }],
      name: 'Notifications',
      tooltip: 'Notifications',
    },
    {
      ariaLabel: 'No Problems',
      command: '',
      elements: [
        { type: 'icon', value: 'ProblemsErrorIcon' },
        { type: 'text', value: '0' },
        { type: 'icon', value: 'ProblemsWarningIcon' },
        { type: 'text', value: '0' },
      ],
      name: 'Problems',
      tooltip: 'Problems',
    },
  ])
  expect(result.uid).toBe(1)
  expect(result.statusBarItemsRight).toEqual([])
})

test('loadContent should return empty array when preference is false', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return false
      }
      return undefined
    },
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 2 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])

  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.uid).toBe(2)
  expect(result.statusBarItemsRight).toEqual([])
})

test('loadContent should return empty array when preference is undefined', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Preferences.get': async () => undefined,
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 3 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    ['Preferences.get', 'statusBar.itemsVisible'],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result.statusBarItemsLeft).toEqual([
    {
      ariaLabel: 'Notifications',
      command: '',
      elements: [{ type: 'text', value: 'Notifications' }],
      name: 'Notifications',
      tooltip: 'Notifications',
    },
    {
      ariaLabel: 'No Problems',
      command: '',
      elements: [
        { type: 'icon', value: 'ProblemsErrorIcon' },
        { type: 'text', value: '0' },
        { type: 'icon', value: 'ProblemsWarningIcon' },
        { type: 'text', value: '0' },
      ],
      name: 'Problems',
      tooltip: 'Problems',
    },
  ])
  expect(result.uid).toBe(3)
  expect(result.statusBarItemsRight).toEqual([])
})

test('loadContent should preserve existing state properties', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => false,
  })

  const state: StatusBarState & { disposed?: boolean } = {
    ...createDefaultState(),
    disposed: true,
    uid: 4,
  }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])

  expect(result.uid).toBe(4)
  expect(result.disposed).toBe(true)
  expect(result.statusBarItemsLeft).toEqual([])
})

test('loadContent should handle multiple Preview items', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Preferences.get': async () => true,
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        command: 'command1',
        icon: 'icon1',
        id: 'item1',
        text: 'Item 1',
        tooltip: 'Tooltip 1',
      },
      {
        command: 'command2',
        icon: 'icon2',
        id: 'item2',
        text: 'Item 2',
        tooltip: 'Tooltip 2',
      },
    ],
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 5 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    ['Preferences.get', 'statusBar.itemsVisible'],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result.statusBarItemsLeft).toEqual([
    {
      ariaLabel: 'Item 1',
      command: 'command1',
      elements: [
        { type: 'icon', value: 'icon1' },
        { type: 'text', value: 'Item 1' },
      ],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
    {
      ariaLabel: 'Item 2',
      command: 'command2',
      elements: [
        { type: 'icon', value: 'icon2' },
        { type: 'text', value: 'Item 2' },
      ],
      name: 'item2',
      tooltip: 'Tooltip 2',
    },
    {
      ariaLabel: 'Notifications',
      command: '',
      elements: [{ type: 'text', value: 'Notifications' }],
      name: 'Notifications',
      tooltip: 'Notifications',
    },
    {
      ariaLabel: 'No Problems',
      command: '',
      elements: [
        { type: 'icon', value: 'ProblemsErrorIcon' },
        { type: 'text', value: '0' },
        { type: 'icon', value: 'ProblemsWarningIcon' },
        { type: 'text', value: '0' },
      ],
      name: 'Problems',
      tooltip: 'Problems',
    },
  ])
})
