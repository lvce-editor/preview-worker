import { expect, test } from '@jest/globals'
import { normalizeAttributeName } from '../src/parts/NormalizeAttributeName/NormalizeAttributeName.ts'

test('normalizeAttributeName should convert class to className', () => {
  const result = normalizeAttributeName('class')
  expect(result).toBe('className')
})

test('normalizeAttributeName should convert type to inputType', () => {
  const result = normalizeAttributeName('type')
  expect(result).toBe('inputType')
})

test('normalizeAttributeName should leave other attributes unchanged', () => {
  const result = normalizeAttributeName('data-test')
  expect(result).toBe('data-test')
})
