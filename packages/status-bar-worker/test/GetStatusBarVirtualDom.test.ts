import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetStatusBarVirtualDom from '../src/parts/GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

test('getStatusBarVirtualDom should return empty array when both arrays are empty', () => {
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom([], [])
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toMatchObject({
    className: 'StatusBar',
    type: 4,
  })
})

test('getStatusBarVirtualDom should return items for left when only left has items', () => {
  const leftItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [{ type: 'text', value: 'Item 1' }],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
  ]
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom(leftItems, [])
  expect(result.length).toBeGreaterThan(0)
  const leftDiv = result.find((node) => node.className === ClassNames.StatusBarItemsLeft)
  expect(leftDiv).toBeDefined()
  expect(leftDiv).toMatchObject({
    className: ClassNames.StatusBarItemsLeft,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should return items for right when only right has items', () => {
  const rightItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [{ type: 'text', value: 'Item 1' }],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
  ]
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom([], rightItems)
  expect(result.length).toBeGreaterThan(0)
  const rightDiv = result.find((node) => node.className === ClassNames.StatusBarItemsRight)
  expect(rightDiv).toBeDefined()
  expect(rightDiv).toMatchObject({
    className: ClassNames.StatusBarItemsRight,
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarVirtualDom should return items for both when both have items', () => {
  const leftItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Left Item',
      elements: [{ type: 'text', value: 'Left Item' }],
      name: 'leftItem',
      tooltip: 'Left Tooltip',
    },
  ]
  const rightItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Right Item',
      elements: [{ type: 'text', value: 'Right Item' }],
      name: 'rightItem',
      tooltip: 'Right Tooltip',
    },
  ]
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom(leftItems, rightItems)
  expect(result.length).toBeGreaterThan(0)
  const leftDiv = result.find((node) => node.className === ClassNames.StatusBarItemsLeft)
  const rightDiv = result.find((node) => node.className === ClassNames.StatusBarItemsRight)
  expect(leftDiv).toBeDefined()
  expect(rightDiv).toBeDefined()
})

test('getStatusBarVirtualDom should skip empty arrays', () => {
  const leftItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [{ type: 'text', value: 'Item 1' }],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
  ]
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom(leftItems, [])
  const rightDiv = result.find((node) => node.className === ClassNames.StatusBarItemsRight)
  expect(rightDiv).toBeUndefined()
})

test('getStatusBarVirtualDom should handle multiple items in left array', () => {
  const leftItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [{ type: 'text', value: 'Item 1' }],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
    {
      ariaLabel: 'Item 2',
      elements: [{ type: 'text', value: 'Item 2' }],
      name: 'item2',
      tooltip: 'Tooltip 2',
    },
  ]
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom(leftItems, [])
  const leftDiv = result.find((node) => node.className === ClassNames.StatusBarItemsLeft)
  expect(leftDiv).toBeDefined()
  expect(leftDiv?.childCount).toBe(2)
})

test('getStatusBarVirtualDom should handle multiple items in right array', () => {
  const rightItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Item 1',
      elements: [{ type: 'text', value: 'Item 1' }],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
    {
      ariaLabel: 'Item 2',
      elements: [{ type: 'text', value: 'Item 2' }],
      name: 'item2',
      tooltip: 'Tooltip 2',
    },
  ]
  const result = GetStatusBarVirtualDom.getStatusBarVirtualDom([], rightItems)
  const rightDiv = result.find((node) => node.className === ClassNames.StatusBarItemsRight)
  expect(rightDiv).toBeDefined()
  expect(rightDiv?.childCount).toBe(2)
})
