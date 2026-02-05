import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('applyRender should return empty array when diffResult is empty', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = createDefaultState()

  const result = ApplyRender.applyRender(oldState, newState, [])

  expect(result).toEqual([])
})

test('applyRender should return commands when diffResult contains RenderItems', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Item 1',
        command: 'command1',
        elements: [
          { type: 'icon', value: 'icon1' },
          { type: 'text', value: 'Item 1' },
        ],
        name: 'item1',
        tooltip: 'Tooltip 1',
      },
    ],
    uid: 1,
  }

  const result = ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems])

  expect(result.length).toBe(1)
  expect(result[0][0]).toBe(ViewletCommand.SetDom2)
  expect(result[0][1]).toBe(1)
  expect(Array.isArray(result[0][2])).toBe(true)
})

test('applyRender should return multiple commands when diffResult contains multiple items', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'Item 1',
        command: 'command1',
        elements: [
          { type: 'icon', value: 'icon1' },
          { type: 'text', value: 'Item 1' },
        ],
        name: 'item1',
        tooltip: 'Tooltip 1',
      },
    ],
    uid: 2,
  }

  const result = ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems, DiffType.RenderItems])

  expect(result.length).toBe(2)
  expect(result[0][0]).toBe(ViewletCommand.SetDom2)
  expect(result[0][1]).toBe(2)
  expect(result[1][0]).toBe(ViewletCommand.SetDom2)
  expect(result[1][1]).toBe(2)
})

test('applyRender should throw error when diffResult contains unknown diffType', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = createDefaultState()

  expect(() => {
    ApplyRender.applyRender(oldState, newState, [999])
  }).toThrow('unknown renderer')
})

test('applyRender should handle mixed valid and invalid diffTypes', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    uid: 3,
  }

  expect(() => {
    ApplyRender.applyRender(oldState, newState, [DiffType.RenderItems, 999])
  }).toThrow('unknown renderer')
})
