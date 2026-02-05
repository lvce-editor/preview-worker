import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual should return true for identical states', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return true for states with same items', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test 2',
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const leftItems: readonly StatusBarItem[] = [item1]
  const rightItems: readonly StatusBarItem[] = [item2]
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when left arrays differ', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test 2',
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when right arrays differ', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test 2',
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item2],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when both arrays differ', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test 2',
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [item1],
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [item2],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when left array length differs', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when right array length differs', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return true for empty states', () => {
  const state1: StatusBarState = createDefaultState()
  const state2: StatusBarState = state1
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should ignore uid when comparing', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const state1: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid: 1,
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid: 2,
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})
