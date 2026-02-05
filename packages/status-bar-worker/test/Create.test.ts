import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import * as Create from '../src/parts/Create/Create.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('create should store state with the given uid', () => {
  const uid = 123
  Create.create(uid, '', 0, 0, 0, 0, 0, '')
  const result = StatusBarStates.get(uid)
  const { newState } = result
  const newStateTyped: StatusBarState = newState
  const { oldState } = result
  const oldStateTyped: StatusBarState = oldState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.uid).toBe(uid)
  expect(newStateTyped.statusBarItemsLeft).toEqual([])
  expect(newStateTyped.statusBarItemsRight).toEqual([])
  expect(oldStateTyped).toBeDefined()
  expect(oldStateTyped.uid).toBe(uid)
})
