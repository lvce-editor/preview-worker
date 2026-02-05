import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as GetStatusBarItems from '../src/parts/GetStatusBarItems/GetStatusBarItems.ts'

test('getStatusBarItems should return empty array when showItems is false', async () => {
  const result = await GetStatusBarItems.getStatusBarItems(false, '', 0, 0, 0)
  expect(result).toEqual([])
})

test('getStatusBarItems should return transformed items when showItems is true', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
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

  const result = await GetStatusBarItems.getStatusBarItems(true, '', 0, 0, 0)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
  expect(result).toEqual([
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
})

test('getStatusBarItems should return empty array when no items are returned', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  const result = await GetStatusBarItems.getStatusBarItems(true, '', 0, 0, 0)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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

test('getStatusBarItems should handle null items', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => null,
  })

  const result = await GetStatusBarItems.getStatusBarItems(true, '', 0, 0, 0)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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

test('getStatusBarItems should handle undefined items', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => undefined,
  })

  const result = await GetStatusBarItems.getStatusBarItems(true, '', 0, 0, 0)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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

test('getStatusBarItems should default missing fields to empty strings', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        id: 'item1',
      },
      {
        text: 'Item 2',
      },
    ],
  })

  const result = await GetStatusBarItems.getStatusBarItems(true, '', 0, 0, 0)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
    {
      ariaLabel: 'item1',
      command: undefined,
      elements: [{ type: 'text', value: '' }],
      name: 'item1',
      tooltip: '',
    },
    {
      ariaLabel: 'Item 2',
      command: undefined,
      elements: [{ type: 'text', value: 'Item 2' }],
      name: '',
      tooltip: '',
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

test('getStatusBarItems should handle multiple items', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
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

  const result = await GetStatusBarItems.getStatusBarItems(true, '', 0, 0, 0)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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
