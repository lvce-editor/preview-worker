import { expect, test } from '@jest/globals'
import * as Resolve from '../src/parts/LoadStyleSheets/ResolveStylesheetUri/ResolveStylesheetUri.ts'

test('resolveStylesheetUri should return empty for empty href', () => {
  expect(Resolve.resolveStylesheetUri('/tmp/index.html', '')).toBe('')
})

test('resolveStylesheetUri should block external http href', () => {
  expect(Resolve.resolveStylesheetUri('/tmp/index.html', 'https://example.com/app.css')).toBe('')
})

test('resolveStylesheetUri should resolve relative file path for file document uri without scheme', () => {
  const result = Resolve.resolveStylesheetUri('/tmp/index.html', './app.css')
  expect(result).toBe('/tmp/app.css')
})

test('resolveStylesheetUri should allow absolute custom scheme uris', () => {
  const result = Resolve.resolveStylesheetUri('/tmp/index.html', 'memfs://workspace/theme.css')
  expect(result).toBe('memfs://workspace/theme.css')
})
