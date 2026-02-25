import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('diff2 should return empty array when old and new state are equal', () => {
  const uid = 1001
  const state = createDefaultState()
  PreviewStates.set(uid, state, state)

  const result = Diff2.diff2(uid)
  expect(result).toEqual([])
})

test('diff2 should return RenderIncremental for non-css changes', () => {
  const uid = 1002
  const state = createDefaultState()
  const sharedCss = ['body { color: red; }']
  const oldState = {
    ...state,
    content: '<h1>old</h1>',
    css: sharedCss,
  }
  const newState = {
    ...state,
    content: '<h1>new</h1>',
    css: sharedCss,
  }
  PreviewStates.set(uid, oldState, newState)

  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff2 should return RenderIncremental and RenderCss for css changes', () => {
  const uid = 1003
  const state = createDefaultState()
  const oldState = {
    ...state,
    css: ['body { color: red; }'],
  }
  const newState = {
    ...state,
    css: ['body { color: red; }', 'div { color: blue; }'],
  }
  PreviewStates.set(uid, oldState, newState)

  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})
