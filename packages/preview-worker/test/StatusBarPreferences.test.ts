import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as StatusBarPreferences from '../src/parts/StatusBarPreferences/StatusBarPreferences.ts'

test('itemsVisible should return true when preference is true', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return true
      }
      return undefined
    },
  })
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])
})

test('itemsVisible should return false when preference is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return false
      }
      return undefined
    },
  })
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(false)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])
})

test('itemsVisible should return false when preference is undefined', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => undefined,
  })
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(true)
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])
})
