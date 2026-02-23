import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import * as Create from '../src/parts/Create/Create.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('create should store state with the given uid', async () => {
  const uid = 123
  await Create.create(uid, '', 0, 0, 0, 0, 0, '')
  const result = PreviewStates.get(uid)
  const { newState } = result
  const newStateTyped: PreviewState = newState
  const { oldState } = result
  const oldStateTyped: PreviewState = oldState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.uid).toBe(uid)
  expect(newStateTyped.loadJavaScript).toBe(true)
  expect(newStateTyped.loadExternalStyleSheets).toBe(true)
  expect(newStateTyped.loadStyleElements).toBe(true)
  expect(oldStateTyped).toBeDefined()
  expect(oldStateTyped.uid).toBe(uid)
  expect(oldStateTyped.loadJavaScript).toBe(true)
  expect(oldStateTyped.loadExternalStyleSheets).toBe(true)
  expect(oldStateTyped.loadStyleElements).toBe(true)
})

test('create should store configured feature flags', async () => {
  const uid = 124
  await Create.create(uid, '', 0, 0, 0, 0, 0, '', {
    loadExternalStyleSheets: false,
    loadJavaScript: false,
    loadStyleElements: false,
  })
  const result = PreviewStates.get(uid)
  const { newState } = result
  const newStateTyped: PreviewState = newState

  expect(newStateTyped.uid).toBe(uid)
  expect(newStateTyped.loadJavaScript).toBe(false)
  expect(newStateTyped.loadExternalStyleSheets).toBe(false)
  expect(newStateTyped.loadStyleElements).toBe(false)
})
