import { expect, test } from '@jest/globals'
import * as HasScheme from '../src/parts/LoadStyleSheets/HasScheme/HasScheme.ts'

test('hasScheme should detect http scheme', () => {
  expect(HasScheme.hasScheme('http://example.com')).toBe(true)
})

test('hasScheme should detect file scheme', () => {
  expect(HasScheme.hasScheme('file:///tmp/index.html')).toBe(true)
})

test('hasScheme should return false for plain path', () => {
  expect(HasScheme.hasScheme('/tmp/index.html')).toBe(false)
})
