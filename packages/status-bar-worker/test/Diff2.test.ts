import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('diff2 should return empty array when states are equal', () => {
  const uid = 1
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([])
})

test('diff2 should return RenderIncremental when left items differ', () => {
  const uid = 1
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
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when right items differ', () => {
  const uid = 1
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
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item2],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when both left and right items differ', () => {
  const uid = 1
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
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [item1],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [item2],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when left array length differs', () => {
  const uid = 1
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when right array length differs', () => {
  const uid = 1
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should ignore uid when comparing', () => {
  const uid = 1
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([])
})

test('diff2 should return RenderIncremental when multiple items are added', () => {
  const uid = 1
  const item1: StatusBarItem = {
    ariaLabel: 'Test 1',
    elements: [{ type: 'text', value: 'Test 1' }],
    name: 'test1',
    tooltip: 'Test tooltip 1',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test 2',
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when items are removed', () => {
  const uid = 1
  const item1: StatusBarItem = {
    ariaLabel: 'Test 1',
    elements: [{ type: 'text', value: 'Test 1' }],
    name: 'test1',
    tooltip: 'Test tooltip 1',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test 2',
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when item text changes', () => {
  const uid = 1
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test Updated',
    elements: [{ type: 'text', value: 'Test Updated' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental when item tooltip changes', () => {
  const uid = 1
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Updated tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should work with different uids independently', () => {
  const uid1 = 1
  const uid2 = 2
  const item1: StatusBarItem = {
    ariaLabel: 'Test 1',
    elements: [{ type: 'text', value: 'Test 1' }],
    name: 'test1',
    tooltip: 'Test tooltip 1',
  }
  const state1 = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: uid1,
  }
  const state2 = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid: uid1,
  }
  const state3 = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: uid2,
  }
  StatusBarStates.set(uid1, state1, state2)
  StatusBarStates.set(uid2, state3, state3)
  const result1 = Diff2.diff2(uid1)
  const result2 = Diff2.diff2(uid2)
  expect(result1).toEqual([DiffType.RenderIncremental])
  expect(result2).toEqual([])
})
