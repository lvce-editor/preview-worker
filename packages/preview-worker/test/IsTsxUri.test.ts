import { expect, test } from '@jest/globals'
import { isTsxUri } from '../src/parts/IsTsxUri/IsTsxUri.ts'

test('isTsxUri should return true for tsx and jsx files', () => {
  expect(isTsxUri('/tmp/Component.tsx')).toBe(true)
  expect(isTsxUri('/tmp/App.jsx')).toBe(true)
})

test('isTsxUri should support file uris and query params', () => {
  expect(isTsxUri('file:///tmp/Component.tsx')).toBe(true)
  expect(isTsxUri('/tmp/Component.tsx?v=1#hash')).toBe(true)
})

test('isTsxUri should return false for non-tsx files', () => {
  expect(isTsxUri('/tmp/index.html')).toBe(false)
  expect(isTsxUri('/tmp/style.css')).toBe(false)
})
