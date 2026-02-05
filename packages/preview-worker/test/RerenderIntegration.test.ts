import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'
import { rerender } from '../src/parts/Rerender/Rerender.ts'

test('rerender should cause DiffItems.isEqual to return false', () => {
  const state: PreviewState = {
    ...createDefaultState(),
    parsedDom: [{ type: 1, childCount: 0 }],
  }
  
  const newState = rerender(state)

  // DiffItems.isEqual should return false because parsedDom reference changed
  expect(DiffItems.isEqual(state, newState)).toBe(false)
})

test('rerender should trigger rerender even with same content', () => {
  const state: PreviewState = {
    ...createDefaultState(),
    content: '<div>same content</div>',
    parsedDom: [{ type: 1, childCount: 1 }],
    initial: false,
    warningCount: 0,
  }
  
  const newState = rerender(state)

  // Even though content, warningCount, and initial are the same,
  // the parsedDom reference change should trigger diff
  expect(state.content).toBe(newState.content)
  expect(state.warningCount).toBe(newState.warningCount)
  expect(state.initial).toBe(newState.initial)
  expect(DiffItems.isEqual(state, newState)).toBe(false)
})
