import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ItemRightUpdate from '../src/parts/ItemRightUpdate/ItemRightUpdate.ts'

test('itemRightUpdate should update existing item by name', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const item1: StatusBarItem = {
    ariaLabel: 'text1',
    elements: [{ type: 'text', value: 'text1' }],
    name: 'item1',
    tooltip: 'tooltip1',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'text2',
    elements: [{ type: 'text', value: 'text2' }],
    name: 'item2',
    tooltip: 'tooltip2',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsRight: [item1, item2],
  }
  const updatedItem: StatusBarItem = {
    ariaLabel: 'updated text',
    elements: [{ type: 'text', value: 'updated text' }],
    name: 'item1',
    tooltip: 'updated tooltip',
  }
  const result = ItemRightUpdate.itemRightUpdate(stateWithItems, updatedItem)
  expect(result.statusBarItemsRight).toHaveLength(2)
  expect(result.statusBarItemsRight[0]).toEqual(updatedItem)
  expect(result.statusBarItemsRight[1]).toEqual(item2)
  expect(result.uid).toBe(1)
  expect(result.statusBarItemsLeft).toEqual(state.statusBarItemsLeft)
})

test('itemRightUpdate should add new item when name does not exist', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const item1: StatusBarItem = {
    ariaLabel: 'text1',
    elements: [{ type: 'text', value: 'text1' }],
    name: 'item1',
    tooltip: 'tooltip1',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsRight: [item1],
  }
  const newItem: StatusBarItem = {
    ariaLabel: 'text2',
    elements: [{ type: 'text', value: 'text2' }],
    name: 'item2',
    tooltip: 'tooltip2',
  }
  const result = ItemRightUpdate.itemRightUpdate(stateWithItems, newItem)
  expect(result.statusBarItemsRight).toHaveLength(2)
  expect(result.statusBarItemsRight[0]).toEqual(newItem)
  expect(result.statusBarItemsRight[1]).toEqual(item1)
  expect(result.uid).toBe(1)
  expect(result.statusBarItemsLeft).toEqual(state.statusBarItemsLeft)
})

test('itemRightUpdate should handle empty array', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const newItem: StatusBarItem = {
    ariaLabel: 'text1',
    elements: [{ type: 'text', value: 'text1' }],
    name: 'item1',
    tooltip: 'tooltip1',
  }
  const result = ItemRightUpdate.itemRightUpdate(state, newItem)
  expect(result.statusBarItemsRight).toHaveLength(1)
  expect(result.statusBarItemsRight[0]).toEqual(newItem)
  expect(result.uid).toBe(1)
  expect(result.statusBarItemsLeft).toEqual(state.statusBarItemsLeft)
})

test('itemRightUpdate should not mutate original state', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const item1: StatusBarItem = {
    ariaLabel: 'text1',
    elements: [{ type: 'text', value: 'text1' }],
    name: 'item1',
    tooltip: 'tooltip1',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsRight: [item1],
  }
  const updatedItem: StatusBarItem = {
    ariaLabel: 'updated text',
    elements: [{ type: 'text', value: 'updated text' }],
    name: 'item1',
    tooltip: 'updated tooltip',
  }
  const originalItems = [...stateWithItems.statusBarItemsRight]
  ItemRightUpdate.itemRightUpdate(stateWithItems, updatedItem)
  expect(stateWithItems.statusBarItemsRight).toEqual(originalItems)
})

test('itemRightUpdate should update item in middle of array', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const item1: StatusBarItem = {
    ariaLabel: 'text1',
    elements: [{ type: 'text', value: 'text1' }],
    name: 'item1',
    tooltip: 'tooltip1',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'text2',
    elements: [{ type: 'text', value: 'text2' }],
    name: 'item2',
    tooltip: 'tooltip2',
  }
  const item3: StatusBarItem = {
    ariaLabel: 'text3',
    elements: [{ type: 'text', value: 'text3' }],
    name: 'item3',
    tooltip: 'tooltip3',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsRight: [item1, item2, item3],
  }
  const updatedItem: StatusBarItem = {
    ariaLabel: 'updated text',
    elements: [{ type: 'text', value: 'updated text' }],
    name: 'item2',
    tooltip: 'updated tooltip',
  }
  const result = ItemRightUpdate.itemRightUpdate(stateWithItems, updatedItem)
  expect(result.statusBarItemsRight).toHaveLength(3)
  expect(result.statusBarItemsRight[0]).toEqual(item1)
  expect(result.statusBarItemsRight[1]).toEqual(updatedItem)
  expect(result.statusBarItemsRight[2]).toEqual(item3)
})
