import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff should return empty array when states are equal', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderIncremental when left items differ', () => {
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
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when right items differ', () => {
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
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item2],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when both left and right items differ', () => {
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
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [item1],
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [item2],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when left array length differs', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental when right array length differs', () => {
  const item1: StatusBarItem = {
    ariaLabel: 'Test',
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should ignore uid when comparing', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const oldState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid: 1,
  }
  const newState: PreviewState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid: 2,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})
