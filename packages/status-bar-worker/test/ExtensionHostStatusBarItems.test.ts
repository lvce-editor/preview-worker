import { expect, test, afterEach } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostStatusBarItems from '../src/parts/ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as Listener from '../src/parts/Listener/Listener.ts'

afterEach(() => {
  for (const id in Listener.state) {
    delete Listener.state[id]
  }
  ExtensionHostStatusBarItems.state.changeListeners.length = 0
})

test('getStatusBarItems should activate by event and invoke GetStatusBarItems', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        id: 'item1',
        text: 'Item 1',
      },
    ],
  })

  const result = await ExtensionHostStatusBarItems.getStatusBarItems('', 0)

  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0]])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
  expect(result).toEqual([
    {
      id: 'item1',
      text: 'Item 1',
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

  const result = await ExtensionHostStatusBarItems.getStatusBarItems('', 0)

  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0]])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
  expect(result).toEqual([])
})

test('getStatusBarItems should return items from provider', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        id: 'item1',
        text: 'Item 1',
      },
      {
        id: 'item2',
        text: 'Item 2',
      },
    ],
  })

  const result = await ExtensionHostStatusBarItems.getStatusBarItems('', 0)

  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0]])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
  expect(result).toEqual([
    {
      id: 'item1',
      text: 'Item 1',
    },
    {
      id: 'item2',
      text: 'Item 2',
    },
  ])
})

const emptyListener = (): void => {}
const listener2 = (): void => {}

test('onChange should register a listener and call RegisterStatusBarChangeListener', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.RegisterStatusBarChangeListener]: async () => undefined,
  })

  await ExtensionHostStatusBarItems.onChange(emptyListener)

  expect(mockExtensionHostRpc.invocations.length).toBe(1)
  expect(mockExtensionHostRpc.invocations[0][0]).toBe(ExtensionHostCommandType.RegisterStatusBarChangeListener)
  expect(mockExtensionHostRpc.invocations[0].length).toBe(2)
  expect(typeof mockExtensionHostRpc.invocations[0][1]).toBe('number')
  expect(Listener.state[mockExtensionHostRpc.invocations[0][1]]).toBe(emptyListener)
})

test('onChange should register multiple listeners independently', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.RegisterStatusBarChangeListener]: async () => undefined,
  })

  await ExtensionHostStatusBarItems.onChange(emptyListener)
  await ExtensionHostStatusBarItems.onChange(listener2)

  expect(mockExtensionHostRpc.invocations.length).toBe(2)
  expect(mockExtensionHostRpc.invocations[0][0]).toBe(ExtensionHostCommandType.RegisterStatusBarChangeListener)
  expect(mockExtensionHostRpc.invocations[1][0]).toBe(ExtensionHostCommandType.RegisterStatusBarChangeListener)
  expect(mockExtensionHostRpc.invocations[0][1]).not.toBe(mockExtensionHostRpc.invocations[1][1])
  expect(Listener.state[mockExtensionHostRpc.invocations[0][1]]).toBe(emptyListener)
  expect(Listener.state[mockExtensionHostRpc.invocations[1][1]]).toBe(listener2)
})

test('onChange should pass empty params array to executeProviders', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  await ExtensionHostStatusBarItems.getStatusBarItems('', 0)

  expect(mockRendererRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0]])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
})
