import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffCss from '../src/parts/DiffCss/DiffCss.ts'

test('iEqual should return true for identical css arrays', () => {
  const state = createDefaultState()
  const oldState = {
    ...state,
    css: ['body { color: red; }'],
  }
  const newState = {
    ...state,
    css: ['body { color: red; }'],
  }

  expect(DiffCss.iEqual(oldState, newState)).toBe(true)
})

test('iEqual should return false for different css array lengths', () => {
  const state = createDefaultState()
  const oldState = {
    ...state,
    css: ['body { color: red; }'],
  }
  const newState = {
    ...state,
    css: ['body { color: red; }', 'div { color: blue; }'],
  }

  expect(DiffCss.iEqual(oldState, newState)).toBe(false)
})

test('iEqual should return false for differing css item content', () => {
  const state = createDefaultState()
  const oldState = {
    ...state,
    css: ['body { color: red; }', 'div { color: blue; }'],
  }
  const newState = {
    ...state,
    css: ['body { color: red; }', 'div { color: green; }'],
  }

  expect(DiffCss.iEqual(oldState, newState)).toBe(false)
})
