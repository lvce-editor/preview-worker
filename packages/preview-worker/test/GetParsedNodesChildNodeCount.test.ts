import { expect, test } from '@jest/globals'
import { getParsedNodesChildNodeCount } from '../src/parts/GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'

test('getParsedNodesChildNodeCount should return 0 for empty string', () => {
  const result = getParsedNodesChildNodeCount('')
  expect(result).toBe(0)
})

test('getParsedNodesChildNodeCount should return 1 for single element', () => {
  const result = getParsedNodesChildNodeCount('<div></div>')
  expect(result).toBe(1)
})

test('getParsedNodesChildNodeCount should return 2 for two sibling elements', () => {
  const result = getParsedNodesChildNodeCount('<div></div><span></span>')
  expect(result).toBe(2)
})

test('getParsedNodesChildNodeCount should return 3 for three sibling elements', () => {
  const result = getParsedNodesChildNodeCount('<div></div><span></span><p></p>')
  expect(result).toBe(3)
})

test('getParsedNodesChildNodeCount should count nested elements as 1', () => {
  const result = getParsedNodesChildNodeCount('<div><span></span></div>')
  expect(result).toBe(1) // Only the outer div counts as root
})

test('getParsedNodesChildNodeCount should handle text nodes', () => {
  const result = getParsedNodesChildNodeCount('Hello World')
  expect(result).toBe(1)
})

test('getParsedNodesChildNodeCount should count mixed content', () => {
  const result = getParsedNodesChildNodeCount('Text<div></div>More text')
  expect(result).toBe(3) // text, div, text
})

test('getParsedNodesChildNodeCount should handle self-closing tags', () => {
  const result = getParsedNodesChildNodeCount('<br><hr><img>')
  expect(result).toBe(3)
})

test('getParsedNodesChildNodeCount should count complex structure', () => {
  const result = getParsedNodesChildNodeCount('<div><span></span></div><p>text</p>')
  expect(result).toBe(2) // div and p are root level
})

test('getParsedNodesChildNodeCount should handle deeply nested structure', () => {
  const result = getParsedNodesChildNodeCount('<div><div><div></div></div></div>')
  expect(result).toBe(1) // Only the outermost div
})

test('getParsedNodesChildNodeCount should count multiple root elements with nesting', () => {
  const result = getParsedNodesChildNodeCount('<header><h1>Title</h1></header><main><p>Content</p></main>')
  expect(result).toBe(2) // header and main
})
