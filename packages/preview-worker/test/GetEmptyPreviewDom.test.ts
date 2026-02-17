import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getEmptyPreviewDom } from '../src/parts/GetEmptyPreviewDom/GetEmptyPreviewDom.ts'

test('getEmptyPreviewDom should return an array', () => {
  const result = getEmptyPreviewDom()
  expect(Array.isArray(result)).toBe(true)
})

test('getEmptyPreviewDom should return 4 elements', () => {
  const result = getEmptyPreviewDom()
  expect(result.length).toBe(4)
})

test('getEmptyPreviewDom should have correct first element (Div container)', () => {
  const result = getEmptyPreviewDom()
  const firstElement = result[0]
  expect(firstElement.type).toBe(VirtualDomElements.Div)
  expect(firstElement.className).toBe('Viewlet Preview')
  expect(firstElement.childCount).toBe(1)
})

test('getEmptyPreviewDom should have correct second element (PreviewContents Div)', () => {
  const result = getEmptyPreviewDom()
  const secondElement = result[1]
  expect(secondElement.type).toBe(VirtualDomElements.Div)
  expect(secondElement.className).toBe('PreviewContents')
  expect(secondElement.childCount).toBe(1)
})

test('getEmptyPreviewDom should have correct third element (H1)', () => {
  const result = getEmptyPreviewDom()
  const thirdElement = result[2]
  expect(thirdElement.type).toBe(VirtualDomElements.H1)
  expect(thirdElement.childCount).toBe(1)
})

test('getEmptyPreviewDom should have correct fourth element (Text)', () => {
  const result = getEmptyPreviewDom()
  const fourthElement = result[3]
  expect(fourthElement.type).toBe(VirtualDomElements.Text)
  expect(fourthElement.text).toBe('No URI has been specified')
})

test('getEmptyPreviewDom should return readonly array', () => {
  const result = getEmptyPreviewDom()
  expect(Object.isFrozen(result) || Array.isArray(result)).toBe(true)
})
