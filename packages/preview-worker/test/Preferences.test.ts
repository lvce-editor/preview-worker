import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Preferences from '../src/parts/Preferences/Preferences.ts'

test('get should return preference value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'test.key') {
        return 'test.value'
      }
      return undefined
    },
  })
  const value = await Preferences.get('test.key')
  expect(value).toBe('test.value')
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'test.key']])
})

test('get should return undefined for non-existent key', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => undefined,
  })
  const value = await Preferences.get('non.existent.key')
  expect(value).toBeUndefined()
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'non.existent.key']])
})

test('get should handle different preference types', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'number.key') {
        return 42
      }
      if (key === 'boolean.key') {
        return true
      }
      if (key === 'object.key') {
        return { nested: 'value' }
      }
      return undefined
    },
  })
  const numberValue = await Preferences.get('number.key')
  expect(numberValue).toBe(42)
  const booleanValue = await Preferences.get('boolean.key')
  expect(booleanValue).toBe(true)
  const objectValue = await Preferences.get('object.key')
  expect(objectValue).toEqual({ nested: 'value' })
  expect(mockRpc.invocations).toEqual([
    ['Preferences.get', 'number.key'],
    ['Preferences.get', 'boolean.key'],
    ['Preferences.get', 'object.key'],
  ])
})
