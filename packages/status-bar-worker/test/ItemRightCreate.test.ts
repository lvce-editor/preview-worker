import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ItemRightCreate from '../src/parts/ItemRightCreate/ItemRightCreate.ts'

test('itemRightCreate should add item to empty right array', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    elements: [{ type: 'text', value: 'Test Item' }],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(state, newItem)

  expect(result.statusBarItemsRight).toHaveLength(1)
  expect(result.statusBarItemsRight[0]).toEqual(newItem)
  expect(result.statusBarItemsRight[0]?.name).toBe('test.item')
  expect(result.statusBarItemsRight[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Test Item')
  expect(result.statusBarItemsRight[0]?.tooltip).toBe('Test Tooltip')
})

test('itemRightCreate should add item to non-empty right array', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const firstItem: StatusBarItem = {
    ariaLabel: 'First Item',
    elements: [{ type: 'text', value: 'First Item' }],
    name: 'first.item',
    tooltip: 'First Tooltip',
  }
  const stateWithFirstItem: StatusBarState = ItemRightCreate.itemRightCreate(state, firstItem)
  const secondItem: StatusBarItem = {
    ariaLabel: 'Second Item',
    elements: [{ type: 'text', value: 'Second Item' }],
    name: 'second.item',
    tooltip: 'Second Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(stateWithFirstItem, secondItem)

  expect(result.statusBarItemsRight).toHaveLength(2)
  expect(result.statusBarItemsRight[0]).toEqual(firstItem)
  expect(result.statusBarItemsRight[1]).toEqual(secondItem)
})

test('itemRightCreate should not modify left array', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    elements: [{ type: 'text', value: 'Test Item' }],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(state, newItem)

  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.statusBarItemsLeft).toHaveLength(0)
})

test('itemRightCreate should preserve uid', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    elements: [{ type: 'text', value: 'Test Item' }],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(state, newItem)

  expect(result.uid).toBe(state.uid)
})

test('itemRightCreate should return new state object', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    elements: [{ type: 'text', value: 'Test Item' }],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(state, newItem)

  expect(result).not.toBe(state)
  expect(result.statusBarItemsRight).not.toBe(state.statusBarItemsRight)
})

test('itemRightCreate should not mutate original state', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    elements: [{ type: 'text', value: 'Test Item' }],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  ItemRightCreate.itemRightCreate(state, newItem)

  expect(state.statusBarItemsRight).toHaveLength(0)
  expect(state.statusBarItemsLeft).toHaveLength(0)
})

test('itemRightCreate should handle item with all properties', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    command: 'test.command',
    elements: [
      { type: 'icon', value: 'test-icon' },
      { type: 'text', value: 'Test Item' },
    ],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(state, newItem)

  expect(result.statusBarItemsRight[0]).toEqual(newItem)
  expect(result.statusBarItemsRight[0]?.command).toBe('test.command')
  expect(result.statusBarItemsRight[0]?.elements.find((e) => e.type === 'icon')?.value).toBe('test-icon')
})

test('itemRightCreate should handle item with optional properties missing', () => {
  const state: StatusBarState = CreateDefaultState.createDefaultState()
  const newItem: StatusBarItem = {
    ariaLabel: 'Test Item',
    elements: [{ type: 'text', value: 'Test Item' }],
    name: 'test.item',
    tooltip: 'Test Tooltip',
  }

  const result = ItemRightCreate.itemRightCreate(state, newItem)

  expect(result.statusBarItemsRight[0]).toEqual(newItem)
  expect(result.statusBarItemsRight[0]?.command).toBeUndefined()
  expect(result.statusBarItemsRight[0]?.elements.find((e) => e.type === 'icon')).toBeUndefined()
})
