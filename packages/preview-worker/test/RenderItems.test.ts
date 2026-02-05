import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems should return SetDom2 command with uid and empty dom when no items', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = { ...createDefaultState(), initial: false, uid: 1 }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(1)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should return SetDom2 command with items in left side', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    initial: false,
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

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(2)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should return SetDom2 command with items in right side', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    initial: false,
    statusBarItemsRight: [
      {
        ariaLabel: 'Item 2',
        command: 'command2',
        elements: [
          { type: 'icon', value: 'icon2' },
          { type: 'text', value: 'Item 2' },
        ],
        name: 'item2',
        tooltip: 'Tooltip 2',
      },
    ],
    uid: 3,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(3)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should return SetDom2 command with items in both sides', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    initial: false,
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
    statusBarItemsRight: [
      {
        ariaLabel: 'Item 2',
        command: 'command2',
        elements: [
          { type: 'icon', value: 'icon2' },
          { type: 'text', value: 'Item 2' },
        ],
        name: 'item2',
        tooltip: 'Tooltip 2',
      },
    ],
    uid: 4,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(4)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should use uid from newState', () => {
  const oldState: StatusBarState = { ...createDefaultState(), uid: 10 }
  const newState: StatusBarState = { ...createDefaultState(), uid: 20 }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[1]).toBe(20)
})

test('renderItems should ignore oldState and only use newState', () => {
  const oldState: StatusBarState = {
    ...createDefaultState(),
    initial: false,
    statusBarItemsLeft: [
      {
        ariaLabel: 'Old Item',
        command: 'old-command',
        elements: [
          { type: 'icon', value: 'old-icon' },
          { type: 'text', value: 'Old Item' },
        ],
        name: 'old-item',
        tooltip: 'Old Tooltip',
      },
    ],
    uid: 100,
  }
  const newState: StatusBarState = {
    ...createDefaultState(),
    initial: false,
    statusBarItemsLeft: [
      {
        ariaLabel: 'New Item',
        command: 'new-command',
        elements: [
          { type: 'icon', value: 'new-icon' },
          { type: 'text', value: 'New Item' },
        ],
        name: 'new-item',
        tooltip: 'New Tooltip',
      },
    ],
    uid: 200,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[1]).toBe(200)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should handle multiple items', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    initial: false,
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
      {
        ariaLabel: 'Item 2',
        command: 'command2',
        elements: [
          { type: 'icon', value: 'icon2' },
          { type: 'text', value: 'Item 2' },
        ],
        name: 'item2',
        tooltip: 'Tooltip 2',
      },
    ],
    statusBarItemsRight: [
      {
        ariaLabel: 'Item 3',
        command: 'command3',
        elements: [
          { type: 'icon', value: 'icon3' },
          { type: 'text', value: 'Item 3' },
        ],
        name: 'item3',
        tooltip: 'Tooltip 3',
      },
    ],
    uid: 5,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(5)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})
