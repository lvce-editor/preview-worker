import { expect, test } from '@jest/globals'
import type { StyleSheet } from '../src/parts/StyleSheet/StyleSheet.ts'
import * as HasMatchingLinkedStyleSheet from '../src/parts/HasMatchingLinkedStyleSheet/HasMatchingLinkedStyleSheet.ts'

test('isSameUri should handle empty uri values', () => {
  expect(HasMatchingLinkedStyleSheet.isSameUri('', '/tmp/app.css')).toBe(false)
})

test('isSameUri should handle malformed file uris', () => {
  expect(HasMatchingLinkedStyleSheet.isSameUri('file:///tmp/%E0%A4%A.css', '/tmp/app.css')).toBe(false)
})

test('isSameUri should handle malformed encoded uris', () => {
  expect(HasMatchingLinkedStyleSheet.isSameUri('%E0%A4%A.css', '/tmp/app.css')).toBe(false)
})

test('hasMatchingLinkedStyleSheet should return true for matching linked stylesheet', () => {
  const styleSheets: readonly StyleSheet[] = [{ href: './app.css', type: 'link' }]
  const result = HasMatchingLinkedStyleSheet.hasMatchingLinkedStyleSheet('/tmp/index.html', styleSheets, '/tmp/app.css')
  expect(result).toBe(true)
})

test('hasMatchingLinkedStyleSheet should return false when no linked stylesheet matches', () => {
  const styleSheets: readonly StyleSheet[] = [{ content: 'body { color: red; }', type: 'style' }]
  const result = HasMatchingLinkedStyleSheet.hasMatchingLinkedStyleSheet('/tmp/index.html', styleSheets, '/tmp/app.css')
  expect(result).toBe(false)
})
