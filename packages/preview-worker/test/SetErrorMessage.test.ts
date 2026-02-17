import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { setErrorMessage } from '../src/parts/SetErrorMessage/SetErrorMessage.ts'

test('setErrorMessage should set the error message on the state', () => {
  const state = createDefaultState()
  const result = setErrorMessage(state, 'Something went wrong')
  expect(result.errorMessage).toBe('Something went wrong')
})

test('setErrorMessage should return a new state object', () => {
  const state = createDefaultState()
  const result = setErrorMessage(state, 'error')
  expect(result).not.toBe(state)
})

test('setErrorMessage should preserve all other state properties', () => {
  const state = {
    ...createDefaultState(),
    assetDir: '/assets',
    content: '<div>test</div>',
    errorCount: 2,
    initial: false,
    uid: 123,
    uri: 'file:///test.html',
    warningCount: 3,
  }
  const result = setErrorMessage(state, 'test error')
  expect(result.assetDir).toBe('/assets')
  expect(result.content).toBe('<div>test</div>')
  expect(result.errorCount).toBe(2)
  expect(result.initial).toBe(false)
  expect(result.uid).toBe(123)
  expect(result.uri).toBe('file:///test.html')
  expect(result.warningCount).toBe(3)
  expect(result.errorMessage).toBe('test error')
})

test('setErrorMessage should clear the error message with empty string', () => {
  const state = {
    ...createDefaultState(),
    errorMessage: 'previous error',
  }
  const result = setErrorMessage(state, '')
  expect(result.errorMessage).toBe('')
})
