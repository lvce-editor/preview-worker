import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff should return empty array when states are equal', () => {
  const state = createDefaultState()
  const result = Diff.diff(state, state)
  expect(result).toEqual([])
})

test('diff should return RenderIncremental when non-css state changed', () => {
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

  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental])
})

test('diff should return RenderIncremental and RenderCss when css changed', () => {
  const state = createDefaultState()
  const oldState = {
    ...state,
    css: ['body { color: red; }'],
  }
  const newState = {
    ...state,
    css: ['body { color: red; }', 'div { color: blue; }'],
  }

  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})
