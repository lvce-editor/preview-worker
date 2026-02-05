import { expect, test } from '@jest/globals'
import { getParsedNodesChildNodeCount } from '../src/parts/GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as ParseHtml from '../src/parts/ParseHtml/ParseHtml.ts'

test('getParsedNodesChildNodeCount should return 0 for empty string', () => {
  const parsed = ParseHtml.parseHtml('', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(0)
})

test('getParsedNodesChildNodeCount should return 1 for single element', () => {
  const parsed = ParseHtml.parseHtml('<div></div>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1)
})

test('getParsedNodesChildNodeCount should return 2 for two sibling elements', () => {
  const parsed = ParseHtml.parseHtml('<div></div><span></span>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(2)
})

test('getParsedNodesChildNodeCount should return 3 for three sibling elements', () => {
  const parsed = ParseHtml.parseHtml('<div></div><span></span><p></p>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(3)
})

test('getParsedNodesChildNodeCount should count nested elements as 1', () => {
  const parsed = ParseHtml.parseHtml('<div><span></span></div>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1) // Only the outer div counts as root
})

test('getParsedNodesChildNodeCount should handle text nodes', () => {
  const parsed = ParseHtml.parseHtml('Hello World', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1)
})

test('getParsedNodesChildNodeCount should count mixed content', () => {
  const parsed = ParseHtml.parseHtml('Text<div></div>More text', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(3) // text, div, text
})

test.skip('getParsedNodesChildNodeCount should handle self-closing tags', () => {
  const parsed = ParseHtml.parseHtml('<br><hr><img>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(3)
})

test('getParsedNodesChildNodeCount should count complex structure', () => {
  const parsed = ParseHtml.parseHtml('<div><span></span></div><p>text</p>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(2) // div and p are root level
})

test('getParsedNodesChildNodeCount should handle deeply nested structure', () => {
  const parsed = ParseHtml.parseHtml('<div><div><div></div></div></div>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1) // Only the outermost div
})

test('getParsedNodesChildNodeCount should count multiple root elements with nesting', () => {
  const parsed = ParseHtml.parseHtml('<header><h1>Title</h1></header><main><p>Content</p></main>', [])
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(2) // header and main
})
