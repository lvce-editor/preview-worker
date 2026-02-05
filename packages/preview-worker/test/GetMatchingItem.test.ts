import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import * as GetMatchingItem from '../src/parts/GetMatchingItem/GetMatchingItem.ts'

test('getMatchingItem should return item from itemsLeft when found', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1',
    },
    {
      ariaLabel: 'Item 2',
      elements: [],
      name: 'item2',
      tooltip: 'Item 2',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = []

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result).toEqual({
    ariaLabel: 'Item 1',
    elements: [],
    name: 'item1',
    tooltip: 'Item 1',
  })
})

test('getMatchingItem should return item from itemsRight when not found in itemsLeft', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 2',
      elements: [],
      name: 'item2',
      tooltip: 'Item 2',
    },
  ]

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item2')

  expect(result).toEqual({
    ariaLabel: 'Item 2',
    elements: [],
    name: 'item2',
    tooltip: 'Item 2',
  })
})

test('getMatchingItem should return undefined when item not found in either list', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 2',
      elements: [],
      name: 'item2',
      tooltip: 'Item 2',
    },
  ]

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item3')

  expect(result).toBeUndefined()
})

test('getMatchingItem should return undefined when both lists are empty', () => {
  const itemsLeft: readonly StatusBarItem[] = []
  const itemsRight: readonly StatusBarItem[] = []

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result).toBeUndefined()
})

test('getMatchingItem should return first matching item from itemsLeft when multiple items with same name exist', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1 first',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1 first',
    },
    {
      ariaLabel: 'Item 1 second',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1 second',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = []

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result).toEqual({
    ariaLabel: 'Item 1 first',
    elements: [],
    name: 'item1',
    tooltip: 'Item 1 first',
  })
})

test('getMatchingItem should prefer itemsLeft over itemsRight when item exists in both', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1 from left',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1 from left',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1 from right',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1 from right',
    },
  ]

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result).toEqual({
    ariaLabel: 'Item 1 from left',
    elements: [],
    name: 'item1',
    tooltip: 'Item 1 from left',
  })
})

test('getMatchingItem should handle items with command property', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      command: 'test.command',
      elements: [],
      name: 'item1',
      tooltip: 'Item 1',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = []

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result).toEqual({
    ariaLabel: 'Item 1',
    command: 'test.command',
    elements: [],
    name: 'item1',
    tooltip: 'Item 1',
  })
})

test('getMatchingItem should handle items with complex elements array', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [
        { type: 'icon', value: 'test-icon' },
        { type: 'text', value: 'Test Item' },
      ] as any,
      name: 'item1',
      tooltip: 'Item 1',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = []

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result?.name).toBe('item1')
  expect(result?.elements).toEqual([
    { type: 'icon', value: 'test-icon' },
    { type: 'text', value: 'Test Item' },
  ])
})

test('getMatchingItem should be case sensitive when searching by name', () => {
  const itemsLeft: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [],
      name: 'Item1',
      tooltip: 'Item 1',
    },
  ]
  const itemsRight: readonly StatusBarItem[] = []

  const result = GetMatchingItem.getMatchingItem(itemsLeft, itemsRight, 'item1')

  expect(result).toBeUndefined()
})
