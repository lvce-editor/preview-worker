import { expect, test } from '@jest/globals'
import * as ToBaseUrl from '../src/parts/LoadStyleSheets/ToBaseUrl/ToBaseUrl.ts'

test('toBaseUrl should return uri when it has scheme', () => {
  expect(ToBaseUrl.toBaseUrl('memfs://workspace/index.html')).toBe('memfs://workspace/index.html')
})

test('toBaseUrl should prepend file:// when no scheme present', () => {
  expect(ToBaseUrl.toBaseUrl('/tmp/index.html')).toBe('file:///tmp/index.html')
})
