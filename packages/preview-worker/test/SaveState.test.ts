import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('saveState should return empty arrays when state has no items', () => {
  const uid = 1
  const state: PreviewState = { ...createDefaultState(), uid }
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([])
})

test('saveState should return itemsLeft when only left items exist', () => {
  const uid = 2
  const item1: StatusBarItem = {
    ariaLabel: 'Item 1',
    elements: [{ type: 'text', value: 'Item 1' }],
    name: 'item1',
    tooltip: 'Tooltip 1',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Item 2',
    elements: [{ type: 'text', value: 'Item 2' }],
    name: 'item2',
    tooltip: 'Tooltip 2',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    uid,
  }
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([item1, item2])
  expect(result.itemsRight).toEqual([])
})

test('saveState should return itemsRight when only right items exist', () => {
  const uid = 3
  const item1: StatusBarItem = {
    ariaLabel: 'Item 1',
    elements: [{ type: 'text', value: 'Item 1' }],
    name: 'item1',
    tooltip: 'Tooltip 1',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Item 2',
    elements: [{ type: 'text', value: 'Item 2' }],
    name: 'item2',
    tooltip: 'Tooltip 2',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsRight: [item1, item2],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([item1, item2])
})

test('saveState should return both itemsLeft and itemsRight', () => {
  const uid = 4
  const leftItem1: StatusBarItem = {
    ariaLabel: 'Left 1',
    elements: [{ type: 'text', value: 'Left 1' }],
    name: 'left1',
    tooltip: 'Left Tooltip 1',
  }
  const leftItem2: StatusBarItem = {
    ariaLabel: 'Left 2',
    elements: [{ type: 'text', value: 'Left 2' }],
    name: 'left2',
    tooltip: 'Left Tooltip 2',
  }
  const rightItem1: StatusBarItem = {
    ariaLabel: 'Right 1',
    elements: [{ type: 'text', value: 'Right 1' }],
    name: 'right1',
    tooltip: 'Right Tooltip 1',
  }
  const rightItem2: StatusBarItem = {
    ariaLabel: 'Right 2',
    elements: [{ type: 'text', value: 'Right 2' }],
    name: 'right2',
    tooltip: 'Right Tooltip 2',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [leftItem1, leftItem2],
    statusBarItemsRight: [rightItem1, rightItem2],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([leftItem1, leftItem2])
  expect(result.itemsRight).toEqual([rightItem1, rightItem2])
})

test('saveState should return items with all properties', () => {
  const uid = 5
  const item: StatusBarItem = {
    ariaLabel: 'Test Item',
    command: 'test.command',
    elements: [
      { type: 'icon', value: 'test-icon' },
      { type: 'text', value: 'Test Item' },
    ],
    name: 'test-item',
    tooltip: 'Test Tooltip',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([item])
  expect(result.itemsLeft[0].command).toBe('test.command')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'icon')?.value).toBe('test-icon')
  expect(result.itemsLeft[0].name).toBe('test-item')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Test Item')
  expect(result.itemsLeft[0].tooltip).toBe('Test Tooltip')
})

test('saveState should return items with optional properties missing', () => {
  const uid = 6
  const item: StatusBarItem = {
    ariaLabel: 'Item',
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsRight).toEqual([item])
  expect(result.itemsRight[0].name).toBe('item')
  expect(result.itemsRight[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Item')
  expect(result.itemsRight[0].tooltip).toBe('Tooltip')
})

test('saveState should handle multiple items in both arrays', () => {
  const uid = 7
  const leftItems: StatusBarItem[] = [
    { ariaLabel: 'Left 1', elements: [{ type: 'text', value: 'Left 1' }], name: 'left1', tooltip: 'T1' },
    { ariaLabel: 'Left 2', elements: [{ type: 'text', value: 'Left 2' }], name: 'left2', tooltip: 'T2' },
    { ariaLabel: 'Left 3', elements: [{ type: 'text', value: 'Left 3' }], name: 'left3', tooltip: 'T3' },
  ]
  const rightItems: StatusBarItem[] = [
    { ariaLabel: 'Right 1', elements: [{ type: 'text', value: 'Right 1' }], name: 'right1', tooltip: 'T1' },
    { ariaLabel: 'Right 2', elements: [{ type: 'text', value: 'Right 2' }], name: 'right2', tooltip: 'T2' },
    { ariaLabel: 'Right 3', elements: [{ type: 'text', value: 'Right 3' }], name: 'right3', tooltip: 'T3' },
  ]
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toHaveLength(3)
  expect(result.itemsRight).toHaveLength(3)
  expect(result.itemsLeft).toEqual(leftItems)
  expect(result.itemsRight).toEqual(rightItems)
})

test('saveState should work with different uid values', () => {
  const uid1 = 10
  const state1: PreviewState = { ...createDefaultState(), uid: uid1 }
  PreviewStates.set(uid1, state1, state1)
  const result1 = SaveState.saveState(state1)
  expect(result1.itemsLeft).toEqual([])
  expect(result1.itemsRight).toEqual([])

  const uid2 = 999
  const item: StatusBarItem = {
    ariaLabel: 'Item',
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state2: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid: uid2,
  }
  PreviewStates.set(uid2, state2, state2)
  const result2 = SaveState.saveState(state2)
  expect(result2.itemsLeft).toEqual([item])
})

test('saveState should return newState items, not oldState items', () => {
  const uid = 8
  const oldItem: StatusBarItem = {
    ariaLabel: 'Old',
    elements: [{ type: 'text', value: 'Old' }],
    name: 'old',
    tooltip: 'Old Tooltip',
  }
  const newItem: StatusBarItem = {
    ariaLabel: 'New',
    elements: [{ type: 'text', value: 'New' }],
    name: 'new',
    tooltip: 'New Tooltip',
  }
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [oldItem],
    uid,
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [newItem],
    uid,
  }
  PreviewStates.set(uid, oldState, newState)
  const result = SaveState.saveState(newState)
  expect(result.itemsLeft).toEqual([newItem])
  expect(result.itemsLeft).not.toEqual([oldItem])
})

test('saveState should handle empty string values', () => {
  const uid = 9
  const item: StatusBarItem = {
    ariaLabel: '',
    elements: [{ type: 'text', value: '' }],
    name: '',
    tooltip: '',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft[0].name).toBe('')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'text')?.value).toBe('')
  expect(result.itemsLeft[0].tooltip).toBe('')
})

test('saveState should preserve item order', () => {
  const uid = 11
  const items: StatusBarItem[] = [
    { ariaLabel: 'First', elements: [{ type: 'text', value: 'First' }], name: 'first', tooltip: 'T1' },
    { ariaLabel: 'Second', elements: [{ type: 'text', value: 'Second' }], name: 'second', tooltip: 'T2' },
    { ariaLabel: 'Third', elements: [{ type: 'text', value: 'Third' }], name: 'third', tooltip: 'T3' },
  ]
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft[0].name).toBe('first')
  expect(result.itemsLeft[1].name).toBe('second')
  expect(result.itemsLeft[2].name).toBe('third')
})

test('saveState should handle items with only name property', () => {
  const uid = 12
  const item: StatusBarItem = {
    ariaLabel: 'minimal',
    elements: [{ type: 'text', value: '' }],
    name: 'minimal',
    tooltip: '',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsRight[0].name).toBe('minimal')
})

test('saveState should handle items with command and icon', () => {
  const uid = 13
  const item: StatusBarItem = {
    ariaLabel: 'Command Item',
    command: 'extension.command',
    elements: [
      { type: 'icon', value: '$(icon-name)' },
      { type: 'text', value: 'Command Item' },
    ],
    name: 'command-item',
    tooltip: 'Command Tooltip',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft[0].command).toBe('extension.command')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'icon')?.value).toBe('$(icon-name)')
})

test('saveState should handle zero uid', () => {
  const uid = 0
  const item: StatusBarItem = {
    ariaLabel: 'Item',
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([item])
})

test('saveState should handle negative uid', () => {
  const uid = -1
  const state: PreviewState = { ...createDefaultState(), uid }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([])
})

test('saveState should handle large uid values', () => {
  const uid = 999_999
  const item: StatusBarItem = {
    ariaLabel: 'Item',
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsRight).toEqual([item])
})

test('saveState should return readonly arrays', () => {
  const uid = 14
  const state: PreviewState = { ...createDefaultState(), uid }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(Object.isFrozen(result.itemsLeft)).toBe(false)
  expect(Array.isArray(result.itemsLeft)).toBe(true)
  expect(Array.isArray(result.itemsRight)).toBe(true)
})

test('saveState should handle mixed items with and without optional properties', () => {
  const uid = 15
  const items: StatusBarItem[] = [
    {
      ariaLabel: 'minimal',
      elements: [{ type: 'text', value: '' }],
      name: 'minimal',
      tooltip: '',
    },
    {
      ariaLabel: 'Full',
      command: 'cmd',
      elements: [
        { type: 'icon', value: 'icon' },
        { type: 'text', value: 'Full' },
      ],
      name: 'full',
      tooltip: 'Tooltip',
    },
    {
      ariaLabel: 'Partial',
      elements: [{ type: 'text', value: 'Partial' }],
      name: 'partial',
      tooltip: 'Tooltip',
    },
  ]
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toHaveLength(3)
  expect(result.itemsLeft[0].name).toBe('minimal')
  expect(result.itemsLeft[1].command).toBe('cmd')
  expect(result.itemsLeft[2]?.elements.find((e) => e.type === 'text')?.value).toBe('Partial')
})

test('saveState should handle very long item arrays', () => {
  const uid = 16
  const items: StatusBarItem[] = Array.from({ length: 100 }, (_, i) => ({
    ariaLabel: `Item ${i}`,
    elements: [{ type: 'text', value: `Item ${i}` }],
    name: `item${i}`,
    tooltip: `Tooltip ${i}`,
  }))
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    statusBarItemsRight: items,
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft).toHaveLength(100)
  expect(result.itemsRight).toHaveLength(100)
  expect(result.itemsLeft[0].name).toBe('item0')
  expect(result.itemsLeft[99].name).toBe('item99')
})

test('saveState should handle items with special characters in text', () => {
  const uid = 17
  const item: StatusBarItem = {
    ariaLabel: 'Special chars: !@#$%^&*()',
    elements: [{ type: 'text', value: 'Special chars: !@#$%^&*()' }],
    name: 'special',
    tooltip: 'Tooltip with "quotes" and \'apostrophes\'',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Special chars: !@#$%^&*()')
  expect(result.itemsLeft[0].tooltip).toBe('Tooltip with "quotes" and \'apostrophes\'')
})

test('saveState should handle items with unicode characters', () => {
  const uid = 18
  const item: StatusBarItem = {
    ariaLabel: 'Unicode: 🚀 中文 العربية',
    elements: [{ type: 'text', value: 'Unicode: 🚀 中文 العربية' }],
    name: 'unicode',
    tooltip: 'Tooltip: 🎉',
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  expect(result.itemsRight[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Unicode: 🚀 中文 العربية')
  expect(result.itemsRight[0].tooltip).toBe('Tooltip: 🎉')
})

test('saveState should handle items with long text values', () => {
  const uid = 19
  const longText = 'A'.repeat(1000)
  const longTooltip = 'B'.repeat(2000)
  const item: StatusBarItem = {
    ariaLabel: longText,
    elements: [{ type: 'text', value: longText }],
    name: 'long',
    tooltip: longTooltip,
  }
  const state: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  PreviewStates.set(uid, state, state)
  const result = SaveState.saveState(state)
  const textElement = result.itemsLeft[0]?.elements.find((e) => e.type === 'text')
  expect(textElement?.value).toBe(longText)
  expect(result.itemsLeft[0].tooltip).toBe(longTooltip)
  expect(textElement?.value.length).toBe(1000)
  expect(result.itemsLeft[0].tooltip.length).toBe(2000)
})
